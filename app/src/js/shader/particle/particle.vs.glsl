	attribute float size;
	attribute vec3 translate;
	attribute vec2 sprite;
	attribute float opacity;
	attribute vec3 color;

	varying float vOpacity;
	varying vec3 vColor;
	varying vec2 vUv;

	void main() {

		vColor = color;
		vOpacity = opacity;
		vUv = uv + sprite;

		vec4 mvPosition = modelViewMatrix * vec4( translate, 1.0 );
		mvPosition.xyz += position * size;

		gl_Position = projectionMatrix * mvPosition;
	}
