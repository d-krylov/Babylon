#define EPSILON (0.001)

float random (vec2 uv) {
  return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453123);
}

float ring(vec2 uv, vec2 origin, float r, float thickness) {
  float r1 = length(uv - origin) - (r + 0.5 * thickness);
  float r2 = length(uv - origin) - (r - 0.5 * thickness);
  return max(-r2, r1);
}

float sd_truchet(vec2 uv, float n, float thickness) {
  vec2 id = n * round(uv / n);
  float s = random(id) > 0.5 ? 1.0 : -1.0;
  uv -= id;
  uv *= vec2(s, 1.0);
  uv = uv.x > -uv.y ? uv : -uv;
  float r = ring(uv / n, vec2(0.5, 0.5), 0.5, thickness);
  return r;
}

void mainImage(out vec4 out_color, in vec2 in_position) {
  vec2 uv = (2.0 * in_position - iResolution.xy) / iResolution.x;
  
  float t = sd_truchet(uv, 0.1, 0.2);
  vec3 color = vec3(0.0);

  if (t < EPSILON) {
    color.x = 0.5;
  } else {
    color.y = 0.2;
  }

  out_color = vec4(color, 1.0);
}