
/* Test Shader
 * This is example shader for testing calculations on a video card
 *
 *
*/

uniform vec3 sResolution;
uniform vec3 ro;
uniform vec3 rr;
uniform float time;
uniform int frame;

#define PI 3.1415926
#define TWO_PI 6.2831852
#define HALF_PI 1.5707963
#define QUARTER_PI 0.78539815

mat2 rotate(float a) {
	float sin = sin(a);
	float cos = cos(a);
	return mat2(cos, -sin, sin, cos);
}

vec2 sphIntersect(in vec3 ro, in vec3 rd, in vec3 ce, float ra) {
	vec3 oc = ro - ce;
	float b = dot(oc, rd);
	float c = dot(oc, oc) - ra * ra;
	float h = b * b - c;
	if(h < 0.0) return vec2(-1.0); // no intersection
	h = sqrt(h);
	return vec2(-b - h, -b + h);
}

vec3 castRay(in vec3 ro, in vec3 rd, in vec3 ce) {
	float is = sphIntersect(ro, normalize(rd), ce, 1.0).x;
	if(is < 0.0) return vec3(0.0);
	vec3 color = vec3(1.0, 1.0, 1.0);
	vec3 lPos = vec3(cos(time * HALF_PI) * 2 + 5, 2.0, sin(time * HALF_PI) * 2);
	vec3 light = vec3(1.0, 1.0, 1.0);
	vec3 isPos = ro + rd * is;
	vec3 n = normalize(isPos - ce);
	vec3 lSubN = lPos - ce - n;
	vec3 diffuse = max(dot(n, lPos - ce), 0.0) * light * color / dot(lSubN, lSubN);
	return diffuse;
}

// Entry

void main() {
	vec2 uv = (gl_FragCoord.xy / sResolution.xy) - vec2(0.5);
	vec3 col = castRay(ro, normalize(vec3(1.0, uv)), vec3(5.0, 0.0, 0.0));
	gl_FragColor = vec4(col, 1.0);
}