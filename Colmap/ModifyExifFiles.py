
import piexif
from PIL import Image
import numpy as np
import os 
import re

# Function used to transform euler angles into quaternion
def get_quaternion_from_euler(roll, pitch, yaw):
  qx = np.sin(roll/2) * np.cos(pitch/2) * np.cos(yaw/2) - np.cos(roll/2) * np.sin(pitch/2) * np.sin(yaw/2)
  qy = np.cos(roll/2) * np.sin(pitch/2) * np.cos(yaw/2) + np.sin(roll/2) * np.cos(pitch/2) * np.sin(yaw/2)
  qz = np.cos(roll/2) * np.cos(pitch/2) * np.sin(yaw/2) - np.sin(roll/2) * np.sin(pitch/2) * np.cos(yaw/2)
  qw = np.cos(roll/2) * np.cos(pitch/2) * np.cos(yaw/2) + np.sin(roll/2) * np.sin(pitch/2) * np.sin(yaw/2)
 
  return [qw, qx, qy, qz]

# Count number of file
def number_of_files(folder_path):
    file_names = os.listdir(folder_path)
    tot_files = sum (1 for file_name in file_names if os.path.isfile(os.path.join(folder_path,file_name)))
    return tot_files


# Function used to extract the gps values from the name string
def extract_ALLdata_name(file_name):
    # Defining the regex used to extract every single parameter from the filename
    pattern = r"lat(-?\d*\.\d+)_lon(-?\d*\.\d+)_alt(-?\d*\.\d+)_pitch(-?\d*\.\d+)_yaw(-?\d*\.\d+)_roll(-?\d*\.\d+)"
    # Search for match in the filename
    match = re.search(pattern, file_name)
    if match:
        # Extract all the values from the strinf using the regex
        value_lat   = float(match.group(1))
        value_lon   = float(match.group(2))
        value_alt   = float(match.group(3))
        value_pitch = float(match.group(4))
        value_yaw   = float(match.group(5))
        value_roll  = float(match.group(6))

        # Create list containing the single values
        list_values = (value_lat, value_lon, value_alt, value_pitch, value_yaw, value_roll)
        return list_values
    else:
        raise ValueError("no numeric value.")

#Function to convert the coordinate
def dec_to_dms(dec):
    degree = np.floor(dec)
    minutes = dec % 1.0 * 60
    seconds = minutes % 1.0 * 60
    minutes = np.floor(minutes)
    return (degree, minutes, seconds)


#Function to save the cordinate in Exif image
def add_coords(path_image, coordinates):
    img = Image.open(path_image)
    #load metadata
    exif_dict = piexif.load(img.info['exif'])
    #print(exif_dict)
    # Latitude and Longitude conversion
    lat_deg, lat_min, lat_sec = dec_to_dms(coordinates[0])
    lon_deg, lon_min, lon_sec = dec_to_dms(coordinates[1])
    # Set GPS Info
    # add Latitude value
    exif_dict['GPS'][piexif.GPSIFD.GPSLatitude] = [(abs(int(lat_deg)),1), (int(lat_min),1), (int(lat_sec),1)]
    exif_dict['GPS'][piexif.GPSIFD.GPSLatitudeRef] = 'N' if coordinates[0] >= 0 else 'S'
    # add Longitude value
    exif_dict['GPS'][piexif.GPSIFD.GPSLongitude] = [(abs(int(lon_deg)),1), (int(lon_min),1), (int(lon_sec),1)]
    exif_dict['GPS'][piexif.GPSIFD.GPSLongitudeRef] = 'E' if coordinates[1] >= 0 else 'W'
    # add Altitude value
    exif_dict['GPS'][piexif.GPSIFD.GPSAltitude] = (int(coordinates[2] * 1000), 1000) 
    exif_dict['GPS'][piexif.GPSIFD.GPSAltitudeRef] = 0
    
    exif_bytes = piexif.dump(exif_dict)
    img.save(path_image, exif=exif_bytes)

    # # User comment for Pitch, Yaw, roll
    # custom_info = {
    #     "Pitch": pitch,
    #     "Yaw": yaw,
    #     "Roll": roll
    # }
    # exif_dict["Exif"][piexif.ExifIFD.UserComment] = json.dumps(custom_info)

#Progress Bar
def progress(percent=0, width=30):
    left = width * percent // 100
    right = width - left
    print('\r[', '#' * left, ' ' * right, ']',
          f' {percent: .0f}%', sep='', end='', flush=True)

# path folder dataset                                          
path_folder = "PATH"        # IMPORTANT! Modify the path to the fodler containing the images
# List of [filename, GPS coords]
list_image = []
count = 0

try:     
    path_current_image = ""
    file_names = os.listdir(path_folder)
    for  file_name in file_names:
        if file_name.lower().endswith('.jpeg'):
            value_gps = extract_ALLdata_name(file_name)

            pitch = value_gps[3]
            yaw = value_gps[4]
            roll = value_gps[5]
            quat = get_quaternion_from_euler(roll, pitch, yaw)
            print(quat[0],",", quat[1], ", ",  quat[2], ", ", quat[3])

            list_image.append([file_name,value_gps])

    if list_image:
        for image in list_image:
            print(image)
    else:
        print("Nessun valore di latitudine e longitudine trovato nel nome del file.")

    print ("\n\n Image or Exif_file editing Processs")
    for image in list_image:
        count+=1
        progress(count)
        path_current_image = path_folder + "/" + image[0]
        add_coords(path_current_image,image[1])
        
except FileNotFoundError: 
    print (f"the folder '{path_folder}' doesn't exist")
except PermissionError: 
    print (f"you can not to open folder'{path_folder}'")
except Exception as e: 
    print (f"there is an error: {e}")
    
print (f"\n\n\nPerfect the implementation is DONE! + image change:  {count}\n\n\n")