	uniform sampler2D texture;
	varying vec2 vUv;
	varying vec3 vColor;
	varying float vOpacity;
	void main() {
		gl_FragColor = vec4( color, vOpacity) * texture2D( texture, vUv);
	}
