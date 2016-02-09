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

/* stuff that will be initialized, put here */
/* just some simple geometry */
var box = new THREE.Mesh(new THREE.BoxGeometry(0.2,0.2,0.2), new THREE.MeshNormalMaterial())
var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.2,0.2,0.2), new THREE.MeshNormalMaterial())
var octohedron = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), new THREE.MeshNormalMaterial())

box.position.set(5,0,0)
sphere.position.set(0,0,-4)
octohedron.position.set(-2,0,3)

scene.add(box)
scene.add(sphere)
scene.add(octohedron)

/* gui stuff */
Gui.add(box.position, 'x', -10, 10).name('box x')
Gui.add(box.position, 'y', -10, 10).name('box y')
Gui.add(box.position, 'z', -10, 10).name('box z')

Gui.add(sphere.position, 'x', -10, 10).name('sphere x')
Gui.add(sphere.position, 'y', -10, 10).name('sphere y')
Gui.add(sphere.position, 'z', -10, 10).name('sphere z')

Gui.add(octohedron.position, 'x', -10, 10).name('octohedron x')
Gui.add(octohedron.position, 'y', -10, 10).name('octohedron y')
Gui.add(octohedron.position, 'z', -10, 10).name('octohedron z')

window.camera = camera
window.stage = stage

Gui.add(camera.position, 'x', -100, 100).name('camera position x')
Gui.add(camera.position, 'y', -100, 100).name('camera position y')
Gui.add(camera.position, 'z', -100, 100).name('camera position z')
//
Gui.add(camera.rotation, 'x', -Math.PI, Math.PI).name('camera rotation x')
Gui.add(camera.rotation, 'y', -Math.PI, Math.PI).name('camera rotation y')
Gui.add(camera.rotation, 'z', -Math.PI, Math.PI).name('camera rotation z')



// Gui.add(config, 'rotationSpeed', -0.5, 0.5, 0.01).name('rotate')
// Gui.add(config, 'x', -2.5, 2.5, 0.01).name('rotate')
// Gui.add(config, 'y', -2.5, 2.5, 0.01).name('rotate')
// Gui.add(config, 'z', -2.5, 2.5, 0.01).name('rotate')



var run = function(time) {
	/* bootstrap timing */
	if(!start) start = lastTime = time
	requestAnimationFrame(run)

	/* timing */
	var step = time-lastTime
	if(step < fps) return
	lastTime = time
	var dt = step || 0


	/* Stuff that will be done every time: put here */

	camera.updateMatrixWorld()
	cameraHelper.update()
	stage.update(dt, time)
	stage.render()
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
