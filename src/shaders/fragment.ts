
export const highlight = `
precision highp float;

in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uProgress;

uniform float uLineSmoothness;
uniform float uLineWidth;
uniform float uBrightness;
uniform float uRotationDeg;
uniform float uDistortion;

// We leave these here so your JS doesn't throw a missing uniform error, 
// but we will no longer add them to the progress math.
uniform float uPosition;
uniform float uPositionMin;
uniform float uPositionMax;
uniform float uAlpha;

vec2 rotateUV(vec2 uv, vec2 center, float rotation, bool useDegrees) {
  float _angle = rotation;
  if (useDegrees) {
    _angle = rotation * (3.1415926 / 180.0);
  }
  mat2 _rotation = mat2(
    vec2(cos(_angle), -sin(_angle)),
    vec2(sin(_angle), cos(_angle))
  );
  vec2 _delta = uv - center;
  _delta = _rotation * _delta;
  return _delta + center;
}

void main(void) {
  vec2 centerUV = vTextureCoord - vec2(0.5, 0.5);
  
  float gradientToEdge = max(abs(centerUV.x), abs(centerUV.y));
  gradientToEdge = gradientToEdge * uDistortion;
  gradientToEdge = 1.0 - gradientToEdge;
  
  vec2 rotatedUV = rotateUV(vTextureCoord, vec2(0.5, 0.5), uRotationDeg, true);

  float lineSmoothness = clamp(uLineSmoothness, 0.001, 1.0);
  float offsetPlus = uLineWidth + lineSmoothness;
  float offsetMinus = uLineWidth - lineSmoothness;

  // 1. Just use uProgress directly. 
  // (We keep fract so if you pass a value over 1.0, it seamlessly loops)
  float rawProgress = fract(uProgress);

  // 2. Safely out of bounds Left and Right
  // Pushed slightly wider to -0.3 and 1.3 to guarantee it is invisible at 0.0
  float startPos = -0.3 - offsetPlus; 
  float endPos   = 1.3 + offsetPlus;  
  float travel   = endPos - startPos;
  
  // 3. Move the line based strictly on your progress value
  float currentPos = startPos + travel * rawProgress;

  vec2 offsetUV = vec2(rotatedUV.xy) - vec2(currentPos, 0.0);
  
  float line = vec3(offsetUV, 0.0).x;
  line = abs(line);
  line = gradientToEdge * line;
  line = sqrt(line);

  float remappedLine;
  {
    float inputRange = offsetMinus - offsetPlus;
    remappedLine = (line - offsetPlus) / inputRange;
  }
  remappedLine = remappedLine * uBrightness;
  remappedLine = min(remappedLine, uAlpha);

  vec4 base = texture2D(uTexture, vTextureCoord);

  vec3 baseStraight = (base.a > 0.0) ? (base.rgb / base.a) : vec3(0.0);

  float lineMask = clamp(remappedLine, 0.0, 1.0);
  vec3 lineStraight = vec3(lineMask) * uBrightness;

  vec3 outStraight = clamp(baseStraight + lineStraight, 0.0, 1.0);

  gl_FragColor = vec4(outStraight * base.a, base.a);
}
`;

/*
export const highlight = `
precision highp float;

in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uTime;

uniform float uLineSmoothness;
uniform float uLineWidth;
uniform float uBrightness;
uniform float uRotationDeg;
uniform float uDistortion;
uniform float uSpeed;
uniform float uPosition;
uniform float uPositionMin;
uniform float uPositionMax;
uniform float uAlpha;

vec2 rotateUV(vec2 uv, vec2 center, float rotation, bool useDegrees) {
  float _angle = rotation;
  if (useDegrees) {
    _angle = rotation * (3.1415926 / 180.0);
  }
  mat2 _rotation = mat2(
    vec2(cos(_angle), -sin(_angle)),
    vec2(sin(_angle), cos(_angle))
  );
  vec2 _delta = uv - center;
  _delta = _rotation * _delta;
  return _delta + center;
}

void main(void) {
  vec2 centerUV = vTextureCoord - vec2(0.5, 0.5);
  
  float gradientToEdge = max(abs(centerUV.x), abs(centerUV.y));
  gradientToEdge = gradientToEdge * uDistortion;
  gradientToEdge = 1.0 - gradientToEdge;
  
  vec2 rotatedUV = rotateUV(vTextureCoord, vec2(0.5, 0.5), uRotationDeg, true);

  float remappedPosition;
  {
    float outPutRange = uPositionMax - uPositionMin;
    remappedPosition = uPositionMin + outPutRange * uPosition;
  }

  float lineSmoothness = clamp(uLineSmoothness, 0.001, 1.0);
  float offsetPlus = uLineWidth + lineSmoothness;
  float offsetMinus = uLineWidth - lineSmoothness;

  float rawTime = fract(uTime * uSpeed + remappedPosition);

  float startPos = -1.25 - offsetPlus;
  float endPos   = 0.25 + offsetPlus;
  float travel   = endPos - startPos;
  
  float remappedTime = startPos + travel * rawTime;

  vec2 offsetUV = vec2(rotatedUV.xy) + vec2(remappedTime, 0.0);
  float line = vec3(offsetUV, 0.0).x;
  line = abs(line);
  line = gradientToEdge * line;
  line = sqrt(line);

  float remappedLine;
  {
    float inputRange = offsetMinus - offsetPlus;
    remappedLine = (line - offsetPlus) / inputRange;
  }
  remappedLine = remappedLine * uBrightness;
  remappedLine = min(remappedLine, uAlpha);

  vec4 base = texture2D(uTexture, vTextureCoord);

  vec3 baseStraight = (base.a > 0.0) ? (base.rgb / base.a) : vec3(0.0);

  float lineMask = clamp(remappedLine, 0.0, 1.0);
  vec3 lineStraight = vec3(lineMask) * uBrightness;

  vec3 outStraight = clamp(baseStraight + lineStraight, 0.0, 1.0);

  gl_FragColor = vec4(outStraight * base.a, base.a);
}
`;

*/