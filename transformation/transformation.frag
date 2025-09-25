#include "common.frag"

//#define ROTATE_CAMERA

#define PLANE_ID (0.0)
#define BOX1_ID  (1.0)
#define BOX2_ID  (2.0)

vec2 map(vec3 p) {
  vec3 q1 = p; q1 -= vec3(+2.0, 1.0, 0.0); q1 *= rotation_xz(iTime);
  vec3 q2 = p; q2 -= vec3(-2.0, 1.0, 0.0); q2 *= rotation_xy(iTime);
  float box1 = sd_box(q1, vec3(0.5, 0.5, 0.5));
  float box2 = sd_box(q2, vec3(0.5, 0.5, 0.5));
  float plane = p.y;
  float ret = min(plane, min(box1, box2));
  float id = PLANE_ID * float(ret == plane) + BOX1_ID * float(ret == box1) + BOX2_ID * float(ret == box2);
  return vec2(ret, id);
}

// https://iquilezles.org/articles/normalsSDF/

vec3 get_normal(vec3 p) {
  const float h = 0.01; 
  const vec2 k = vec2(1.0, -1.0);
  return normalize(k.xyy * map(p + k.xyy * h).x + 
                   k.yyx * map(p + k.yyx * h).x + 
                   k.yxy * map(p + k.yxy * h).x + 
                   k.xxx * map(p + k.xxx * h).x);
}

Hit march(Ray ray, float near, float far, float step_size, int step_count) {
  Hit hit;
  hit.id = -1.0;
  float t = near, EPSILON = 0.001;
  for (int i = 0; i < step_count && t < far; i++) {
    vec3 p = ray.origin + ray.direction * t;
    vec2 d = map(p);
    if (d.x < EPSILON) {
      hit.id = d.y; 
      hit.position = p;
      hit.normal = get_normal(hit.position);
      break;
    }
    t += step_size * d.x;
  }
  return hit;
}

vec3 chessboard(vec2 p) {
  vec3 c1 = vec3(0.5, 0.5, 0.2);
  vec3 c2 = vec3(0.5, 0.2, 0.5);
  return mix(c1, c2, mod(floor(p.x) + floor(p.y), 2.0));
}

vec3 get_material(Hit hit) {
  if (hit.id == PLANE_ID) return chessboard(hit.position.xz);
  if (hit.id == BOX1_ID) return vec3(0.2, 0.2, 0.5);
  if (hit.id == BOX2_ID) return vec3(0.2, 0.5, 0.2);
}

void mainImage(out vec4 out_color, in vec2 in_position) {
  vec2 uv = (2.0 * in_position - iResolution.xy) / iResolution.y;

  vec3 target = vec3(0.0, 0.0, 0.0);
  vec3 origin = vec3(0.0, 2.0, 3.0);
  
  #ifdef ROTATE_CAMERA
  float R = 4.0;
  float V = 0.5;
  origin = vec3(R * cos(V * iTime), 1.0, R * sin(V * iTime));
  #endif

  vec3 direction = normalize(look_at(origin, target) * vec3(uv, -1.0));

  Ray ray = Ray(origin, direction);

  Hit hit = march(ray, 0.0, 20.0, 0.5, 1000);
  vec3 sun = normalize(vec3(1.0, 1.0, 1.0));
  vec3 color = vec3(0.0, 0.0, 0.0);

  if (hit.id != -1.0) {
    color = get_material(hit);
    color += vec3(0.4) * max(0.0, dot(hit.normal, sun));
  } else {
    color = vec3(0.0, 0.5, uv.y);
  }

  out_color = vec4(color, 1.0);
}