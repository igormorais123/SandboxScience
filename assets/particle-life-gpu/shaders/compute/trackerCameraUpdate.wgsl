struct TrackerState {
    x: f32,
    y: f32,
    vx: f32,
    vy: f32,
    searchRadius: f32,
    expectedCount: u32,
    _padding1: u32,
    _padding2: u32,
}

struct Camera {
    centerX: f32,
    centerY: f32,
    scaleX: f32,
    scaleY: f32,
}

@group(0) @binding(0) var<storage, read> tracker: TrackerState;
@group(0) @binding(1) var<storage, read_write> camera: Camera;

const SMOOTHING_FACTOR: f32 = 0.75;

@compute @workgroup_size(1)
fn main() {
    camera.centerX += (tracker.x - camera.centerX) * SMOOTHING_FACTOR;
    camera.centerY += (tracker.y - camera.centerY) * SMOOTHING_FACTOR;
}
