struct SimOptions {
    simWidth: f32,
    simHeight: f32,
    gridWidth: u32,
    gridHeight: u32,
    cellSize: f32,
    numParticles: u32,
    numTypes: u32,
    particleSize: f32,
    particleOpacity: f32,
    isWallRepel: u32,
    isWallWrap: u32,
    forceFactor: f32,
    frictionFactor: f32,
    repel: f32,
    extendedGridWidth: u32,
    extendedGridHeight: u32,
    gridOffsetX: u32,
    gridOffsetY: u32,
    mirrorWrapCount: u32,
};
struct Particle {
    x : f32,
    y : f32,
    vx : f32,
    vy : f32,
    particleType : f32,
}

@group(0) @binding(0) var<storage, read_write> particles : array<Particle>;
@group(1) @binding(0) var<uniform> options : SimOptions;
@group(2) @binding(0) var<uniform> deltaTime: f32;

@compute @workgroup_size(64)
fn particleAdvance(@builtin(global_invocation_id) id : vec3u) {
    if (id.x >= options.numParticles) { return; }

    let width = options.simWidth;
    let height = options.simHeight;

    var particle = particles[id.x];

    // Fricao exponencial no tempo (independente de FPS)
    let dtNorm = clamp(deltaTime * 60.0, 0.25, 3.0);
    let frictionScale = pow(max(0.0, 1.0 - options.frictionFactor), dtNorm);
    particle.vx *= frictionScale;
    particle.vy *= frictionScale;

    // Limite de velocidade: deslocamento por frame <= cellSize,
    // senao a particula atravessa a vizinhanca 3x3 do hash espacial
    let maxSpeed = options.cellSize / max(deltaTime, 1e-4);
    let speedSq = particle.vx * particle.vx + particle.vy * particle.vy;
    if (speedSq > maxSpeed * maxSpeed) {
        let scale = maxSpeed / sqrt(speedSq);
        particle.vx *= scale;
        particle.vy *= scale;
    }

    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;

    if (options.isWallRepel == 1u) {
        let margin = options.particleSize;
        if (particle.x < margin || particle.x > width - margin) {
          particle.vx *= -1.0;
          particle.x = clamp(particle.x, margin, width - margin);
        }
        if (particle.y < margin || particle.y > height - margin) {
          particle.vy *= -1.0;
          particle.y = clamp(particle.y, margin, height - margin);
        }
    } else if (options.isWallWrap == 1u) {
        if (particle.x < 0.0) { particle.x += width; }
        else if (particle.x >= width) { particle.x -= width; }
        if (particle.y < 0.0) { particle.y += height; }
        else if (particle.y >= height) { particle.y -= height; }
    }

    particles[id.x] = particle;
}