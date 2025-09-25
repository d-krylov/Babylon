#ifndef COMMON_FRAG
#define COMMON_FRAG

struct Ray {
  vec3 origin;
  vec3 direction;
};

struct Hit {
  float id;
  vec3 position;
  vec3 normal;
};

float sd_box(vec3 p, vec3 size) {
  vec3 q = abs(p) - size;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

// rx ux fx
// ry uy fy
// rz uz fz
mat3 look_at(vec3 origin, vec3 target) {
  vec3 wu = vec3(0.0, 1.0, 0.0);
  vec3 f = normalize(origin - target);
  vec3 r = normalize(cross(wu, f));
  vec3 u = normalize(cross(f, r));
  return mat3(r, u, f);
}

//  C 0 S 
//  0 1 0
// -S 0 C
mat3 rotation_xz(float angle) {
  float Sin = sin(angle);
  float Cos = cos(angle);
  return mat3(
    Cos,  0.0, -Sin,
    0.0,  1.0,  0.0,
    Sin,  0.0,  Cos
  );
}

// C -S  0 
// S  C  0
// 0  0  1
mat3 rotation_xy(float angle) {
  float Sin = sin(angle);
  float Cos = cos(angle);
  return mat3(
    Cos, Sin, 0.0,
   -Sin, Cos, 0.0,
    0.0, 0.0, 1.0
  );
}

#endif // COMMON_FRAG