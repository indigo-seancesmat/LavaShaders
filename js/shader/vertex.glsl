uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vSurfaceToLight;
uniform vec3 uColor[3];
uniform vec2 pixels;
uniform float uWaveSize;
uniform float uWaveSpeed;
uniform float uColorSpread;
uniform float uColorSpeed;
uniform vec3 uLightPos;
float PI = 3.141592653589793238;

#include "lygia/generative/snoise.glsl"

void main() {
    vNormal = normalMatrix * normal;
    
    vec2 noiseCoord = uv * vec2(3., 4.);
    
    float tilt = -0.1*uv.y;
    float incline = uv.x*0.5;
    float offset = incline*mix(-0.25,0.25,uv.y);

    float noise = snoise(vec4(noiseCoord.x + time*3.0, noiseCoord.y, time * uWaveSpeed, 3.0));
    noise = max(0.0, noise);
    
    vec3 pos = vec3(position.x, position.y, position.z + noise * uWaveSize +tilt +incline +offset);

    vColor = uColor[2];

    for(int i = 0; i < 2; i++) {
        float noiseFlow = 5. + float(i)*uColorSpeed;
        float noiseSpeed = 10. + float(i)*uColorSpeed;

        float noiseSeed = 1. + float(i)*10.;
        vec2 noiseFreq = vec2(1.,1.4)*uColorSpread;

        float noiseFloor = 0.1;
        float noiseCeil = 0.6 + float(i)*0.07;

        float noise = smoothstep(noiseFloor, noiseCeil, snoise(
            vec3(
                noiseCoord.x*noiseFreq.x + time*noiseFlow,
                noiseCoord.y*noiseFreq.y,
                time * noiseSpeed + noiseSeed
            )));

        vColor = mix(vColor, uColor[i], noise);
    }
    
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    vec3 surfaceToLightDirection = vec3( modelViewMatrix * vec4(position, 1.0));
    vec3 worldLightPos = vec3( viewMatrix * vec4(uLightPos, 1.0));
    vSurfaceToLight = normalize(worldLightPos - surfaceToLightDirection);
}