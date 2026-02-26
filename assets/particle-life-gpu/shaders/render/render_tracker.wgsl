struct Camera {
    centerX: f32,
    centerY: f32,
    scaleX: f32,
    scaleY: f32,
};
struct TrackerState {
    x: f32,
    y: f32,
    vx: f32,
    vy: f32,
    searchRadius: f32,
    minParticles: u32,
    expectedCount: u32,
    _padding: u32,
};

const TRACKER_SIZE: f32 = 75.0;
const TRACKER_COLOR: vec3<f32> = vec3<f32>(0.4, 0.9, 1.0); // Cyan
const HIGHLIGHT_COLOR: vec3<f32> = vec3<f32>(1.0, 1.0, 0.8); // Bright white/yellow
const QUAD_VERTICES = array<vec2<f32>, 4>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(1.0, -1.0),
    vec2<f32>(-1.0, 1.0),
    vec2<f32>(1.0, 1.0)
);

@group(0) @binding(0) var<uniform> camera: Camera;
@group(1) @binding(0) var<storage, read> tracker: TrackerState;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) localPos: vec2<f32>,
};

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    let quadPos = QUAD_VERTICES[vertexIndex];
    let maxSize = max(TRACKER_SIZE, tracker.searchRadius);
    let worldPos = vec2<f32>(tracker.x, tracker.y) + quadPos * maxSize;
    let clipPos = (worldPos - vec2<f32>(camera.centerX, camera.centerY)) * vec2<f32>(camera.scaleX, -camera.scaleY);
    return VertexOutput(
        vec4<f32>(clipPos, 0.0, 1.0),
        quadPos * (maxSize / TRACKER_SIZE)
    );
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
    let dist = length(input.localPos);
    let fw = fwidth(dist);
    
    // --- OUTER RING ---
    let alpha_outer_out = smoothstep(0.95 + fw, 0.95 - fw, dist);
    let alpha_outer_in = smoothstep(0.83 - fw, 0.83 + fw, dist);
    let outerRingAlpha = alpha_outer_out * alpha_outer_in;
    
    // --- MIDDLE RING (searchRadius) ---
    let searchRadiusRatio = tracker.searchRadius / TRACKER_SIZE;
    let alpha_middle_out = smoothstep(searchRadiusRatio + fw, searchRadiusRatio - fw, dist);
    let alpha_middle_in = smoothstep(searchRadiusRatio - 0.06 - fw, searchRadiusRatio - 0.06 + fw, dist);
    let middleRingAlpha = alpha_middle_out * alpha_middle_in * 0.9;

    // --- CENTER DOT ---
    let centerDotAlpha = smoothstep(0.15 + fw, 0.15 - fw, dist);
    
    // --- CROSSHAIR ---
    let absX = abs(input.localPos.x);
    let absY = abs(input.localPos.y);
    let isHorizontalBar = absY < 0.08 && absX > 0.25 && absX < 1.0;
    let isVerticalBar = absX < 0.08 && absY > 0.25 && absY < 1.0;
    let crosshairAlpha = select(0.0, 1.0, isHorizontalBar || isVerticalBar);

    // --- COMBINE STRUCTURE ---
    let structureAlpha = max(max(max(outerRingAlpha, middleRingAlpha), centerDotAlpha), crosshairAlpha);
    if (structureAlpha <= 0.01) { discard; }

    // --- GLOW EFFECT ---
    let glowAlpha = smoothstep(1.1, 0.5, dist) * 0.3;
    let totalAlpha = max(structureAlpha, glowAlpha);

    // --- COLOR GRADIENT ---
    let finalColor = mix(HIGHLIGHT_COLOR, TRACKER_COLOR, smoothstep(0.3, 0.8, dist));

    return vec4<f32>(finalColor * 1.3, totalAlpha);
}
