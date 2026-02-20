import { useEffect, useRef } from "react";

interface LiquidEtherProps {
    colors?: [string, string, string];
    speed?: number;
    className?: string;
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color0;
  uniform vec3 u_color1;
  uniform vec3 u_color2;

  // Simplex noise helpers
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.3;

    // Multiple noise layers for fluid look
    float n1 = snoise(uv * 3.0 + vec2(t * 0.5, t * 0.3));
    float n2 = snoise(uv * 5.0 - vec2(t * 0.4, t * 0.2));
    float n3 = snoise(uv * 2.0 + vec2(t * 0.2, -t * 0.5));

    float blend1 = smoothstep(-0.3, 0.5, n1);
    float blend2 = smoothstep(-0.2, 0.6, n2);

    vec3 color = mix(u_color0, u_color1, blend1);
    color = mix(color, u_color2, blend2 * 0.5);

    // Glow effect
    float glow = (n1 + n2 + n3) * 0.15 + 0.1;
    color += glow * u_color1;

    // Vignette
    float vig = 1.0 - length((uv - 0.5) * 1.4);
    color *= smoothstep(0.0, 0.8, vig);

    gl_FragColor = vec4(color * 0.35, 1.0);
  }
`;

function hexToRGB(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
}

export function LiquidEther({
    colors = ["#5227FF", "#FF9FFC", "#B19EEF"],
    speed = 1,
    className = "",
}: LiquidEtherProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
        if (!gl) return;

        // Compile shader
        function createShader(gl: WebGLRenderingContext, type: number, source: string) {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        }

        const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

        const program = gl.createProgram()!;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Fullscreen quad
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        // Uniforms
        const uTime = gl.getUniformLocation(program, "u_time");
        const uRes = gl.getUniformLocation(program, "u_resolution");
        const uColor0 = gl.getUniformLocation(program, "u_color0");
        const uColor1 = gl.getUniformLocation(program, "u_color1");
        const uColor2 = gl.getUniformLocation(program, "u_color2");

        const c0 = hexToRGB(colors[0]);
        const c1 = hexToRGB(colors[1]);
        const c2 = hexToRGB(colors[2]);

        gl.uniform3f(uColor0, ...c0);
        gl.uniform3f(uColor1, ...c1);
        gl.uniform3f(uColor2, ...c2);

        function resize() {
            const dpr = Math.min(window.devicePixelRatio, 1.5);
            canvas!.width = canvas!.clientWidth * dpr;
            canvas!.height = canvas!.clientHeight * dpr;
            gl!.viewport(0, 0, canvas!.width, canvas!.height);
            gl!.uniform2f(uRes, canvas!.width, canvas!.height);
        }

        resize();
        window.addEventListener("resize", resize);

        const startTime = performance.now();
        function render() {
            const t = ((performance.now() - startTime) / 1000) * speed;
            gl!.uniform1f(uTime, t);
            gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
            animRef.current = requestAnimationFrame(render);
        }
        render();

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [colors, speed]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full ${className}`}
            style={{ pointerEvents: "none" }}
        />
    );
}
