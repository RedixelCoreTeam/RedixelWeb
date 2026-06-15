import { useEffect, useRef } from 'react';

export function ShaderBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    function syncSize() {
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;

      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      const actualWidth = Math.round(displayWidth * dpr);
      const actualHeight = Math.round(displayHeight * dpr);

      if (canvas.width !== actualWidth || canvas.height !== actualHeight) {
        canvas.width = actualWidth;
        canvas.height = actualHeight;
      }
    }

    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(canvas);
    syncSize();

    const gl =
      canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return;

    const vs = `attribute vec2 a_position;
                varying vec2 v_texCoord;
                
                void main() {
                  v_texCoord = a_position * 0.5 + 0.5;
                  gl_Position = vec4(a_position, 0.0, 1.0);
                }`;

    const fs = `precision highp float;
                varying vec2 v_texCoord;
                uniform float u_time;
                uniform vec2 u_resolution;
                
                float hash(vec2 p) {
                    p = fract(p * vec2(123.34, 456.21));
                    p += dot(p, p + 45.32);
                    return fract(p.x * p.y);
                }
                
                void main() {
                    vec2 uv = v_texCoord;
                    float aspect = u_resolution.x / u_resolution.y;
                
                    vec3 color = vec3(0.06, 0.06, 0.08);

                    float bottomDist = 1.0 - uv.y;
                    float bottomGlow = pow(bottomDist, 2.2);
                    float pulse = 0.88 + 0.12 * sin(u_time * 0.7);
                    vec3 glowColor = mix(vec3(1.0, 0.33, 0.12), vec3(1.0, 0.71, 0.16), uv.x);
                    color += glowColor * bottomGlow * 0.42 * pulse;
                
                    for(float i = 0.0; i < 40.0; i++) {
                        float h = hash(vec2(i, 1.23));
                        float speed = 0.1 + h * 0.2;
                        float xPos = fract(h + sin(u_time * 0.1 + i) * 0.1);
                        float yPos = fract(h * 10.0 + u_time * speed);
                        
                        vec2 p = vec2(xPos, yPos);
                        
                        vec2 d = abs(uv - p);
                        d.x *= aspect; 
                        float dist = max(d.x, d.y);
                        
                        float size = 0.002 + h * 0.003;
                        
                        if (dist < size) {
                            float blink = 0.5 + 0.5 * sin(u_time * 2.0 + i);
                            vec3 pColor = mix(vec3(0.9, 0.2, 0.1), vec3(1.0, 0.5, 0.2), h);
                            
                            color += pColor * blink; 
                        }
                    }
                
                    gl_FragColor = vec4(color, 1.0);
                }`;

    function cs(type: number, src: string) {
      const s = gl?.createShader(type);
      if (!s) return null;
      gl?.shaderSource(s, src);
      gl?.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    if (!prog) return;

    const vertexShader = cs(gl.VERTEX_SHADER, vs);
    const fragmentShader = cs(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    const programMethod: 'useProgram' = 'useProgram';
    gl[programMethod](prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    function render(t: number) {
      if (!canvas || !gl) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={`block ${className}`} />;
}
