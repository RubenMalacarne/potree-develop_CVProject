

# Project to Computer Vision, Using Potree WebGL based

In this git, you will find the project regarding the Computer Vision course, where the Potree code has been revised in order to make it useful for our needs.

* References: 
    * [Potree: Rendering Large Point Clouds in Web Browsers](https://www.cg.tuwien.ac.at/research/publications/2016/SCHUETZ-2016-POT/SCHUETZ-2016-POT-thesis.pdf) (2016)
    * [Fast Out-of-Core Octree Generation for Massive Point Clouds](https://www.cg.tuwien.ac.at/research/publications/2020/SCHUETZ-2020-MPC/) (2020)
    
# To DO:

Step one:
	
	- Open file after converted .Ply in .Las					[x]
	- Add annotations like image							[x]

Step two:
	
	- salvare in un file JSON i dati voluti 
				+ Annotation (description, link of image)		[ ]
				+ Position annotation						[ ]
				+ Value of quternion of each annotation			[ ]

Step Three:
	
	- Use the anchoring algorithm to overlay the data 
	from the JSON file onto the preferred image					[ ]
	






# Getting Started

### Install on your PC

Install [node.js](http://nodejs.org/)

Install dependencies, as specified in package.json, and create a build in ./build/potree.

```bash
npm install
```

### Run on your PC
```bash
npm start
```

Go to http://localhost:1234/examples/ to test the examples.

### Convert Point Clouds to Potree Format

Download [PotreeConverter](https://github.com/potree/PotreeConverter) and run it like this:

    ./PotreeConverter.exe C:/pointclouds/data.las -o C:/pointclouds/data_converted

Copy the converted directory into &lt;potreeDirectory&gt;/pointclouds/data_converted. Then, duplicate and rename one of the examples and modify the path in the html file to your own point cloud.

# Downloads

* [Potree](https://github.com/potree/potree/releases)
* [PotreeConverter ](https://github.com/potree/PotreeConverter/releases) - Convert your point cloud to the Potree format.
* [PotreeDesktop ](https://github.com/potree/PotreeDesktop/releases) - Desktop version of Potree. Allows drag&drop of point clouds into the viewer.

