/**
 *
 * @author sigeom sa / http://sigeom.ch
 * @author Ioda-Net Sàrl / https://www.ioda-net.ch/
 * @author Markus Schütz / http://potree.org
 *
 */

import {Measure} from "../utils/Measure.js";

export class GeoJSONExporter{

	static measurementToFeatures (measurement) {
		let coords = measurement.points.map(e => e.position.toArray());

		let features = [];

		if (coords.length === 1) {
			let feature = {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: coords[0]
				},
				properties: {
					name: measurement.name
				}
			};
			features.push(feature);
		} else if (coords.length > 1 && !measurement.closed) {
			let object = {
				'type': 'Feature',
				'geometry': {
					'type': 'LineString',
					'coordinates': coords
				},
				'properties': {
					name: measurement.name
				}
			};

			features.push(object);
		} else if (coords.length > 1 && measurement.closed) {
			let object = {
				'type': 'Feature',
				'geometry': {
					'type': 'Polygon',
					'coordinates': [[...coords, coords[0]]]
				},
				'properties': {
					name: measurement.name
				}
			};
			features.push(object);
		}

		if (measurement.showDistances) {
			measurement.edgeLabels.forEach((label) => {
				let labelPoint = {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: label.position.toArray()
					},
					properties: {
						distance: label.text
					}
				};
				features.push(labelPoint);
			});
		}

		if (measurement.showArea) {
			let point = measurement.areaLabel.position;
			let labelArea = {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: point.toArray()
				},
				properties: {
					area: measurement.areaLabel.text
				}
			};
			features.push(labelArea);
		}

		return features;
	}

	static toString (measurements) {
		if (!(measurements instanceof Array)) {
			measurements = [measurements];
		}

		measurements = measurements.filter(m => m instanceof Measure);

		let features = [];
		for (let measure of measurements) {
			let f = GeoJSONExporter.measurementToFeatures(measure);

			features = features.concat(f);
		}

		let geojson = {
			'type': 'FeatureCollection',
			'features': features
		};

		return JSON.stringify(geojson, null, '\t');
	}

	static getAnnotation(annotations, scene){
		let features = [];

		for(let i=0; i<annotations.length; i++){
			let feature = {
				type: 'Feature',
				geometry: {
					type: 'Annotation',
					coordinates: annotations[i].position.toArray()
				},
				properties: {
					title: annotations[i].title,
					description: annotations[i].description,
					src: annotations[i].src
				}
			};
			features.push(feature);
		}

		let geojson = {
			'type': 'FeatureCollection',
			'quaternion': scene.getActiveCamera().quaternion.toArray(),
			'features': features
		};

		return JSON.stringify(geojson, null, '\t');
	}

	static getMesh(meshes, scene){
		let features = [];

		for(let i=0; i<mesh.length; i++){
			let feature = {
				type: 'Feature',
				geometry: {
					type: 'mesh',
					coordinates: mesh[i].position.toArray()
				},
				properties: {
					title: mesh[i].title,
					description: mesh[i].description,
					src: mesh[i].src
				}
			};
			features.push(feature);
		}

		let geojson = {
			'type': 'FeatureCollection',
			'quaternion': scene.getActiveCamera().quaternion.toArray(),
			'features': features
		};

		return JSON.stringify(geojson, null, '\t');
	}

}
