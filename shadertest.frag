
/* Test Shader
 * This is example shader for testing calculations on a video card
 *
 *
*/

uniform vec3 sResolution;
uniform float time;
uniform int frame;

#define PI 3.1415926
#define TWO_PI 6.2831852
#define HALF_PI 1.5707963
#define QUARTER_PI 0.78539815



// Entry
 
void main() {
	vec2 uv = (gl_FragCoord.xy / sResolution.xy);
	gl_FragColor = vec4(uv.x * sin(PI * time), 0.0, uv.y * cos(HALF_PI * time), 1.0);
}