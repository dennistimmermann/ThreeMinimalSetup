var THREE = require('three')
var _ = require('lodash')

class Skybox extends THREE.Object3D {
	constructor(color, width, height, seg_x, seg_y) {
		super()

		// var uniforms = {
		// 	topColor: 	 { type: "c", value: new THREE.Color( 0x292D28 ) },
		// 	bottomColor: { type: "c", value: new THREE.Color( 0x000000 ) },
		// 	offset:		 { type: "f", value: 400 },
		// 	exponent:	 { type: "f", value: 1.5 }
		// };

		var uniforms = {
			topColor: 	 { type: "c", value: new THREE.Color( 0xffffff ) },
			bottomColor: { type: "c", value: new THREE.Color( 0xe3e3e3 ) },
			offset:		 { type: "f", value: 400 },
			exponent:	 { type: "f", value: 1.1 }
		};

		var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
		var skyMat = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: require('./shader/skybox/vertexshader.glsl')(),
			fragmentShader: require('./shader/skybox/fragmentshader.glsl')(),
			side: THREE.BackSide
		} );

		var skybox = new THREE.Mesh( skyGeo, skyMat );

		this.add(skybox)
		this.light()
		this.name = "skybox";

		this.gridHelper = new THREE.GridHelper(50, 5)
		this.add(this.gridHelper)
	}

	light() {
		//hemisphere
		// var light = new THREE.HemisphereLight( 0xADB9A6, 0xB3B9B9, 1 );
		var light = new THREE.HemisphereLight( 0xe6e4e5, 0xc8bcbf, 1 );
		this.add( light );

		//sun
		var geometry = new THREE.SphereGeometry(200, 20, 20)
		var material = new THREE.MeshNormalMaterial()

		var sun = new THREE.Mesh(geometry, material)
		var position = new THREE.Vector3(2500,1150,2500)
		sun.position.copy( position )
		// this.add( sun )

		var sunlight = new THREE.PointLight(0xB3B9B9, 1, 0)
		// var sunlight = new THREE.DirectionalLight(0xB3B9B9, 1, 0)
		sunlight.position.copy( new THREE.Vector3( 20, 50, 40 ) )
		sunlight.target = new THREE.Vector3( 0, 0, 0 )
		// sunlight.castShadow = true
		// sunlight.position.copy( position )

		this.sunlight = sunlight
		this.add( sunlight )
	}

	update(dt) {

	}
}

module.exports = Skybox
