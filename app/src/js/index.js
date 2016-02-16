/**
 * HP Avatar Prototype
 */

'use strict'

// __DEBUG = false
if(__DEBUG) {
	console.log('debug on')
}

/* require */
if(__DEBUG) var stats = require('./utils/stats')

var _ = require('lodash')
var THREE = require('three')
window.THREE = THREE
var $ = require('jquery')
window.$ = $

var mixin_update = require('./mixins/update')
mixin_update.call(THREE.Object3D.prototype)

var dat = require('dat-gui')

var Gui = new dat.GUI()

var Stage = require('./Stage')
var Skybox = require('./Skybox')

var fps = 1000/60 //target
var start = undefined
var lastTime = undefined


var stage = new Stage(window.innerWidth, window.innerHeight)
var scene = stage.scene
var skybox = new Skybox()
scene.add(skybox)


/* our fake camera */
var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 10000)
var cameraHelper = new THREE.CameraHelper(camera)
scene.add(cameraHelper)

var params = {
	DistanceToTarget: 2,
	speedOrbit: 0.1,
	roty: 0,

}

var pointOfInterest = {
	x: 0,
	z: 0,
}

//var Object2 

/* stuff that will be initialized, put here */
/* just some simple geometry */
var box = new THREE.Mesh(new THREE.BoxGeometry(0.2,0.2,0.2), new THREE.MeshNormalMaterial())
var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.2,0.2,0.2), new THREE.MeshNormalMaterial())
var octohedron = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), new THREE.MeshNormalMaterial())

box.position.set(6,0,0)
sphere.position.set(0,0,-4)
//octohedron.position.set(-2,0,3)

scene.add(box)
scene.add(sphere)
scene.add(octohedron)

/* gui stuff */

//Gui.add(octohedron.position, 'x', -10, 10).name('octohedron x')

window.camera = camera
window.stage = stage

//Gui.add(camera.position, 'x', -100, 100).name('camera position x')

//Gui.add(camera.rotation, 'x', -Math.PI, Math.PI).name('camera rotation x')

Gui.add(params, 'roty', -3,3).name('RotationY')
Gui.add(params, 'DistanceToTarget',0,10).name('DistanceToTarget')
//Gui.add(params, 'speedOrbit',0,0.3).name('speedOrbit')
Gui.add(pointOfInterest, 'x',-4,4).name('pointOfInterestX')
Gui.add(pointOfInterest, 'z', -4,4).name('pointOfInterestZ')


var newAngle =0.2

var poiCurrentX = 0
var poiNewX = 0

var poiCurrentZ = 0
var poiNewZ= 0

var camCurrentX = 0
var camNewX = 0
var camOldX = 0

var camCurrentZ = 0
var camNewZ = 0
var camOldZ = 0


var run = function(time) {
	/* bootstrap timing */
	if(!start) start = lastTime = time
	requestAnimationFrame(run)


	/* timing */
	var step = time-lastTime
	if(step < fps) return
	lastTime = time
	var dt = step || 0;


	/* Stuff that will be done every time: put here */

	octohedron.position.set(pointOfInterest.x,0,pointOfInterest.z)
	sphere.position.set(poiCurrentX,0,poiCurrentZ)
	box.rotation.x = newAngle
	// Smooth Camera Movement 

	if (poiCurrentX != pointOfInterest.x){
		poiNewX = poiCurrentX + (pointOfInterest.x - poiCurrentX)/60
		if (poiNewZ - camCurrentZ<0){
			newAngle = Math.atan( ( poiNewX - camCurrentX ) / ( poiNewZ- camCurrentZ ) )
		}
		else{
			newAngle = Math.atan( ( poiNewX - camCurrentX ) / ( poiNewZ- camCurrentZ ) ) - Math.PI
		}
	}
	else{
		poiNewX = pointOfInterest.x
	}


	if (poiCurrentZ != pointOfInterest.z){
		poiNewZ = poiCurrentZ + (pointOfInterest.z- poiCurrentZ)/60
		if (poiNewZ - camCurrentZ<0){
			newAngle = Math.atan( ( poiNewX - camCurrentX ) / ( poiNewZ- camCurrentZ ) )
		}
		else{
			newAngle = Math.atan( ( poiNewX - camCurrentX ) / ( poiNewZ- camCurrentZ ) ) - Math.PI
		}
	}
	else{
		poiNewZ = pointOfInterest.z
	}

	poiCurrentX = poiNewX
	poiCurrentZ = poiNewZ

	

	camNewX = pointOfInterest.x + params.DistanceToTarget*Math.sin(newAngle)
	camNewZ = pointOfInterest.z + params.DistanceToTarget*Math.cos(newAngle)

	if (camOldX != camNewX){
		camCurrentX = camOldX + (camNewX - camOldX)/120
	}

	if (camOldZ != camNewZ){
		camCurrentZ = camOldZ + (camNewZ - camOldZ)/120
	}
	camOldX = camCurrentX
	camOldZ = camCurrentZ


	// Camera Rotation

	camera.position.x = camCurrentX
	camera.position.z = camCurrentZ

	//camera.position.x = movex/30
	//camera.position.z = movez/30


	camera.rotation.y = newAngle
	//camera.rotation.x = params.rotx-Math.cos(angle)
	//camera.rotation.z = params.rotz
	//camera.rotation.z = params.rotx

	camera.updateMatrixWorld()
	cameraHelper.update()
	stage.update(dt, time)
	stage.render()
	//stage.renderer.render(stage.scene,camera)

	//controls.update()

	if(__DEBUG) stats.update()
}




/* add to dom */
var dom = stage.renderer.domElement;
$(dom).attr('id','canvas');
// document.body.appendChild(dom);
document.getElementById('webgl-container').appendChild(dom)

/* resize */
window.addEventListener('resize', function(e) {
	var [width,height] = [window.innerWidth, window.innerHeight]
	stage.resize(width, height)
})

run()
