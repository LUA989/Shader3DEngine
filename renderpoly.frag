
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
uniform sampler2D mat;
uniform sampler2D sky;
uniform sampler2D cubemap;
uniform mat2 polys[];
uniform float zoom;

#define PI 3.1415926
#define TWO_PI 6.2831852
#define TAU 6.2831852
#define HALF_PI 1.5707963
#define QUARTER_PI 0.78539815
#define SQRT_2 0.41421356
#define GAMMA 0.45454545

vec3 SUN_POS = vec3(1.0, 0.0, 0.0);
vec3 SUN_COLOR = vec3(1.0, 1.0, 1.0);
vec4 AMBIENT = vec4(1.0, 1.0, 1.0, 0.85);

float MAX_DIST = 256.0;

mat2 rotate(float a) {
	float sin = sin(a);
	float cos = cos(a);
	return mat2(cos, -sin, sin, cos);
}

// Intersector from: https://iquilezles.org/articles/intersectors/

vec3 triIntersect(in vec3 ro, in vec3 rd, in vec3 v0, in vec3 v1, in vec3 v2) {
	vec3 v1v0 = v1 - v0;
	vec3 v2v0 = v2 - v0;
	vec3 rov0 = ro - v0;
	vec3  n = cross(v1v0, v2v0);
	vec3  q = cross(rov0, rd);
	float d = 1.0 / dot(rd, n);
	float u = d * dot(-q, v2v0);
	float v = d * dot(q, v1v0);
	float t = d * dot(-n, rov0);
	if(u < 0.0 || v < 0.0 || (u + v) > 1.0) t = -1.0;
	return vec3(t, u, v);
}

/*vec4 lineIntersect(vec3 p1, vec3 p2, vec4 color) {
	float zn = p1.x * p1.y - p2.x * p2.y;
	if (abs(zn) < 1E-9) return vec3(-1.0);
	res.x = -(p1.z * p1.y - p2.z * p2.y) / zn;
	res.y = -(p1.x * p1.z - p2.y * p2.z) / zn;
	return color;
}*/

vec3 getSkybox(vec3 rd) {
	vec3 sun = SUN_COLOR.rgb * pow(max(dot(rd, normalize(SUN_POS)), 0.0), 256.0) / 3.0;
	return texture(sky, vec2(atan(rd.y / rd.x) / PI + 0.5, 0.5 - asin(rd.z) / PI)).rgb + sun;
}

vec3 getCubemap(vec3 rd, vec3 n) {
	vec3 rf = reflect(rd, n);
	return texture(cubemap, vec2(atan(rf.x / rf.y), -asin(rf.z)) / PI + vec2(0.5)).rgb;
}

vec3 castRay(in vec3 ro, in vec3 rd, in vec3 p1, in vec3 p2, in vec3 p3) {
	vec3 is = triIntersect(ro, normalize(rd), p1, p2, p3);
	if(is.x < 0.0 || is.x > MAX_DIST) return getSkybox(rd);
	//vec3 lPos = vec3(cos(time * HALF_PI) * 2.0 + 5.0, 2.0, sin(time * HALF_PI) * 2.0); // Rotating light
	vec3 lPos = ro; // Flashlight
	vec3 light = vec3(0.0, 0.0, 0.0); //light color
	vec3 isPos = ro + rd * is.x;
	vec3 n = normalize(cross(p3 - p1, p2 - p1));
	vec3 lSubN = lPos - isPos - n;
	vec3 diffuse = max(dot(n, lPos - isPos), 0.0) * light / dot(lSubN, lSubN);
	vec4 mat = texture(mat, is.yz);
	vec4 cubemap = vec4(getSkybox(reflect(rd, n)), 1.0);
	return diffuse * mat.rgb * mat.a + diffuse + AMBIENT.rgb * AMBIENT.a * mat.rgb * mat.a;
}

// Entry

void main() {
	vec3 p1 = vec3(5.0, 1.5, 0.0);
	vec3 p2 = vec3(5.0, -1.5, 2.0);
	vec3 p3 = vec3(3.0, -1.5, -2.0);
	vec2 uv = (gl_FragCoord.xy / sResolution.xy) - vec2(0.5);
	uv.x *= (sResolution.x / sResolution.y);
	uv /= zoom;
	vec3 ca = normalize(vec3(1.0, uv));
	ca.yz *= rotate(rr.x);
	ca.xz *= rotate(rr.y);
	ca.xy *= rotate(rr.z);
	vec3 col = castRay(ro, ca, p1, p2, p3).rgb;
	gl_FragColor = vec4(col, 1.0);
}