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

struct TrackerCameraOptions {
    panOffsetX: f32,
    panOffsetY: f32,
    smoothing: f32,
}

@group(0) @binding(0) var<storage, read> tracker: TrackerState;
@group(0) @binding(1) var<storage, read_write> camera: Camera;
@group(0) @binding(2) var<uniform> cameraOptions: TrackerCameraOptions;

@compute @workgroup_size(1)
fn main() {
    let targetX = tracker.x + cameraOptions.panOffsetX;
    let targetY = tracker.y + cameraOptions.panOffsetY;
    camera.centerX += (targetX - camera.centerX) * cameraOptions.smoothing;
    camera.centerY += (targetY - camera.centerY) * cameraOptions.smoothing;
}
