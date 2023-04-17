uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
uniform float uLightIntensity;
uniform vec3 uLightColor;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vSurfaceToLight;
float PI = 3.141592653589793238;

 vec3 light_reflection(vec3 lightColor) {
    // AMBIENT is just the light's color
    vec3 ambient = lightColor;
  
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // DIFFUSE  calculations
    // Calculate the cosine of the angle between the vertex's normal
    // vector and the vector going to the light.
    vec3 diffuse = lightColor * dot(vSurfaceToLight, vNormal);
  
    // Combine 
    return (ambient + diffuse);
  }
  

void main() {
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
    vec3 light_value = light_reflection(uLightColor);
    light_value *= uLightIntensity;
    // gl_FragColor = vec4(vUv, 0.0, 1.);
    gl_FragColor = vec4(vColor * light_value, 1.);
}