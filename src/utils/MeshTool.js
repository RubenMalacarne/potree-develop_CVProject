
import * as THREE from "../../libs/three.js/build/three.module.js";
import {Mesh} from "../Mesh.js";
import {Utils} from "../utils.js";
import {CameraMode} from "../defines.js";
import {EventDispatcher} from "../EventDispatcher.js";

import {STLLoader} from "../../libs/three.js/loaders/STLLoader.js"


export class MeshTool extends EventDispatcher{
	constructor (viewer) {
		super();

		this.viewer = viewer;
		this.renderer = viewer.renderer;

		this.sg = new THREE.SphereGeometry(0.1);
		this.sm = new THREE.MeshNormalMaterial();
		this.s = new THREE.Mesh(this.sg, this.sm);
		
		
		this.mesh3 = new THREE.Mesh() ;

	

	}

	startInsertion (args = {}) {
		let domElement = this.viewer.renderer.domElement;
		let mesh3 = new THREE.Mesh() ;	
		let mesh = new Mesh({
		position: [589748.270, 231444.540, 753.675],
		title: "Obj Mesh",
		description: `Description of Object`,
		image: ''
		});
		this.dispatchEvent({type: 'start_inserting_mesh', mesh : mesh});
	
		//load STL file:
		var loader = new STLLoader();
		//after click of the mouse
		this.getlink();

		loader.load( Potree.resourcePath + "/models/prova.stl",(geometry) => {
			geometry.computeVertexNormals();	
		{ 
		let material1 = new THREE.MeshPhysicalMaterial( {
					color: 0x664422,
					metalness: 0,
					roughness: 0.5,
					clearCoat:  1.0,
					clearCoatRoughness: 1.0,
					reflectivity: 1.0
				} );
		// ritornare la posizione di dove lo metto
		this.mesh3 = new THREE.Mesh( geometry, material1 );
		this.mesh3.position.set(589969.587, 231428.213, 710.634);
		this.mesh3.scale.multiplyScalar(1);
		this.mesh3.rotation.set(Math.PI / 2, Math.PI, 0)
		this.viewer.scene.scene.add(this.mesh3)
		//this.viewer.scene.scene.add(mesh3);
			}

		});
		const meshes = this.viewer.scene.meshes;
		meshes.add(this.mesh3);

		let callbacks = {
			cancel: null,
			finish: null,
		};

		let insertionCallback = (e) => {
			if (e.button === THREE.MOUSE.LEFT) {
				callbacks.finish();
			} else if (e.button === THREE.MOUSE.RIGHT) {
				callbacks.cancel();
			}
		};

		callbacks.cancel = e => {
			meshlist.remove(this.mesh3);

			domElement.removeEventListener('mouseup', insertionCallback, true);
		};

		callbacks.finish = e => {
			domElement.removeEventListener('mouseup', insertionCallback, true);
		};

		domElement.addEventListener('mouseup', insertionCallback, true);

		let drag = (e) => {
			let I = Utils.getMousePointCloudIntersection(
				e.drag.end, 
				e.viewer.scene.getActiveCamera(), 
				e.viewer, 
				e.viewer.scene.pointclouds,
				{pickClipped: true});

			if (I) {
				this.s.position.copy(I.location);

				this.mesh3.position.copy(I.location);
			}
		};

		let drop = (e) => {
			viewer.scene.scene.remove(this.s);
			this.s.removeEventListener("drag", drag);
			this.s.removeEventListener("drop", drop);
		};

		this.s.addEventListener('drag', drag);
		this.s.addEventListener('drop', drop);

		this.viewer.scene.scene.add(this.s);
		this.viewer.inputHandler.startDragging(this.s);

		this.viewer.scene.addMesh3d(this.mesh3);

		return this.mesh3;
	}
	//-------------------------------------------------------------
	//funztion to take an file.STL from Computer
	getlink(){
		(e) => {
			var files = e.target.files;
			if(FileReader && files && files.length) {
				var fr = new FileReader();

				fr.onload = function () {
					this.link = fr.result
					console.log (fr.result)
					console.log ("upload mesh")
				}
				fr.readAsDataURL(files[0]);
			} else {
				console.log("FileReader error");
			}
		};
		
	}
	//-------------------------------------------------------------
	
	update(){
		// let camera = this.viewer.scene.getActiveCamera();
		// let domElement = this.renderer.domElement;
		// let measurements = this.viewer.scene.measurements;

		// const renderAreaSize = this.renderer.getSize(new THREE.Vector2());
		// let clientWidth = renderAreaSize.width;
		// let clientHeight = renderAreaSize.height;

	}

	render(){
		//this.viewer.renderer.render(this.scene, this.viewer.scene.getActiveCamera());
	}
};
