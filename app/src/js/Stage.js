
/* require */
var THREE = require('three')
var Orbit = require('three-orbit-controls')(THREE)

/**
 * @class  Stage
 */
class Stage {
	constructor(width, height) {
		var renderer = new THREE.WebGLRenderer({antialias: false, preserveDrawingBuffer: true})
		// renderer.setPixelRatio( window.devicePixelRatio ); /* BAD PERFORMANCE */
		var scene = new THREE.Scene()
		// scene.fog = new THREE.Fog( 0xffffff ) // not yet implemented in shader
		// window.fog = scene.fog
		var camera = new THREE.PerspectiveCamera(55, width / height, 1, 10000)
			// camera.rotation.set(0,3.14159,0)
		// var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, -1000, 10000 );
		scene.add( camera );
		window.cam = camera
		// var frustum = new THREE.Frustum()
		camera.position.set(0, 1, -3)
		// camera.rotateY(Math.PI/2)
		camera.lookAt(new THREE.Vector3(0,0,1))

		this.controls = new Orbit(camera, document.getElementById('webgl-container'))

		this.renderer = renderer
		this.scene = scene
		scene.add(camera)
		this.camera = camera
		this.resize(width, height)

		if(__DEBUG) {
			// window.stage = this
			// this.cameraHelper = new THREE.CameraHelper(this.camera)
			// this.scene.add(this.cameraHelper)
		}
	}

	resize(width, height) {
		this.width = width
		this.height = height
		this.renderer.setSize(width, height);
		this.camera.aspect = width / height
		this.camera.updateProjectionMatrix();
	}

	update(dt, time) {
		// this.camera.updateMatrixWorld()

		this.scene._update(dt, this, time)
		if(__DEBUG) {
			// this.cameraHelper.update()
		}
	}

	render() {
		this.renderer.render(this.scene, this.camera)
	}
}

module.exports = Stage
