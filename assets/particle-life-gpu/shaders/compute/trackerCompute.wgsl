struct Particle {
    x: f32,
    y: f32,
    vx: f32,
    vy: f32,
    particleType: f32,
}

// Tracker state persisted across frames
struct TrackerState {
    x: f32,
    y: f32,
    vx: f32,
    vy: f32,
    searchRadius: f32,
    minRadius: f32, // max(currentMaxRadius * 0.8, 16)
    deltaTime: f32,
    minParticles: u32,
    numParticles: u32,
    expectedCount: u32,
    _padding: u32,
}

// Accumulator for each search radius level (uses atomics for parallel accumulation)
struct LevelAccum {
    sumDx: atomic<i32>,
    sumDy: atomic<i32>,
    sumVx: atomic<i32>,
    sumVy: atomic<i32>,
    totalWeight: atomic<i32>,
    count: atomic<u32>,
    _padding1: u32,
    _padding2: u32,
}

@group(0) @binding(0) var<storage, read> particles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> trackerState: TrackerState;
@group(0) @binding(2) var<storage, read_write> levels: array<LevelAccum, 6>;

const SCALE: f32 = 100.0;        // Fixed-point scale for atomic integer operations
const NUM_LEVELS: u32 = 6u;      // Number of search radius levels
const MAX_MULTIPLIER: f32 = 3.0; // Maximum radius multiplier

// Returns radius multiplier for each level
fn getRadiusMultiplier(level: u32) -> f32 {
    switch(level) {
        case 0u: { return 1.0; }
        case 1u: { return 1.2; }
        case 2u: { return 1.4; }
        case 3u: { return 1.75; }
        case 4u: { return 2.25; }
        default: { return 3.0; }
    }
}

// Pass 1: Accumulate particles into appropriate radius levels
@compute @workgroup_size(256)
fn accumulateParticles(@builtin(global_invocation_id) globalId: vec3u) {
    let tid = globalId.x;
    if (tid >= trackerState.numParticles) { return; }

    let baseRadius = trackerState.minRadius;
    let dt = trackerState.deltaTime;

    // Predict reference position based on current velocity
    let speed = sqrt(trackerState.vx * trackerState.vx + trackerState.vy * trackerState.vy);
    let predictionFactor = min(1.0 + speed * 0.002, 1.5);
    let refX = trackerState.x + trackerState.vx * dt * predictionFactor;
    let refY = trackerState.y + trackerState.vy * dt * predictionFactor;

    let particle = particles[tid];
    let dx = particle.x - refX;
    let dy = particle.y - refY;
    let distSq = dx * dx + dy * dy;

    // Early exit if particle is outside max search radius
    let maxRadiusSq = (baseRadius * MAX_MULTIPLIER) * (baseRadius * MAX_MULTIPLIER);
    if (distSq > maxRadiusSq) { return; }

    // Find smallest level containing this particle
    var minLevel: u32 = 5u;
    for (var lvl: u32 = 0u; lvl < NUM_LEVELS; lvl++) {
        let mult = getRadiusMultiplier(lvl);
        let radiusSq = (baseRadius * mult) * (baseRadius * mult);
        if (distSq <= radiusSq) {
            minLevel = lvl;
            break;
        }
    }

    let dist = sqrt(distSq);

    // Directional bonus: favor particles in movement direction (0.7x to 1.3x)
    var dirBonus: f32 = 1.0;
    if (speed > 0.1) {
        let velDirX = trackerState.vx / speed;
        let velDirY = trackerState.vy / speed;
        let distInv = 1.0 / max(dist, 0.001);
        let toDirX = dx * distInv;
        let toDirY = dy * distInv;
        let alignment = velDirX * toDirX + velDirY * toDirY;
        dirBonus = 1.0 + alignment * 0.3;
    }

    // Add particle to all levels >= minLevel (inclusive hierarchy)
    for (var lvl: u32 = minLevel; lvl < NUM_LEVELS; lvl++) {
        let lvlRadius = baseRadius * getRadiusMultiplier(lvl);
        let lvlNormalizedDist = dist / lvlRadius;
        let gaussWeight = exp(-lvlNormalizedDist * lvlNormalizedDist * 2.0);
        let lvlWeight = gaussWeight * dirBonus;

        atomicAdd(&levels[lvl].sumDx, i32(dx * lvlWeight * SCALE));
        atomicAdd(&levels[lvl].sumDy, i32(dy * lvlWeight * SCALE));
        atomicAdd(&levels[lvl].sumVx, i32(particle.vx * lvlWeight * SCALE));
        atomicAdd(&levels[lvl].sumVy, i32(particle.vy * lvlWeight * SCALE));
        atomicAdd(&levels[lvl].totalWeight, i32(lvlWeight * SCALE));
        atomicAdd(&levels[lvl].count, 1u);
    }
}

// Pass 2: Finalize tracker position using the most precise valid level
@compute @workgroup_size(1)
fn finalizeTracker() {
    let minParticles = trackerState.minParticles;
    let baseRadius = trackerState.minRadius;
    let dt = trackerState.deltaTime;
    let expectedCount = trackerState.expectedCount;

    // Dynamic threshold: 15% of expectedCount, minimum minParticles
    let dynamicMinParticles = max(minParticles, u32(f32(expectedCount) * 0.15));

    // Find first level (most precise) with enough particles
    var bestLevel: i32 = -1;
    for (var lvl: u32 = 0u; lvl < NUM_LEVELS; lvl++) {
        let count = atomicLoad(&levels[lvl].count);
        if (count >= dynamicMinParticles) {
            bestLevel = i32(lvl);
            break;
        }
    }

    if (bestLevel >= 0) {
        let lvl = u32(bestLevel);
        let totalWeight = f32(atomicLoad(&levels[lvl].totalWeight)) / SCALE;
        let currentCount = atomicLoad(&levels[lvl].count);

        if (totalWeight > 0.0) {
            // Compute weighted center of mass offset
            let offsetX = f32(atomicLoad(&levels[lvl].sumDx)) / SCALE / totalWeight;
            let offsetY = f32(atomicLoad(&levels[lvl].sumDy)) / SCALE / totalWeight;
            let newVx = f32(atomicLoad(&levels[lvl].sumVx)) / SCALE / totalWeight;
            let newVy = f32(atomicLoad(&levels[lvl].sumVy)) / SCALE / totalWeight;

            // Apply offset to predicted position (same prediction as accumulateParticles)
            let speed = sqrt(trackerState.vx * trackerState.vx + trackerState.vy * trackerState.vy);
            let predictionFactor = min(1.0 + speed * 0.002, 1.5);
            let predX = trackerState.x + trackerState.vx * dt * predictionFactor;
            let predY = trackerState.y + trackerState.vy * dt * predictionFactor;

            trackerState.x = predX + offsetX;
            trackerState.y = predY + offsetY;
            trackerState.vx = newVx;
            trackerState.vy = newVy;
            trackerState.searchRadius = baseRadius * getRadiusMultiplier(lvl);

            // Smooth expectedCount update (97% old + 3% new)
            let newExpected = u32(f32(expectedCount) * 0.97 + f32(currentCount) * 0.03);
            trackerState.expectedCount = max(newExpected, minParticles);
        }
    } else {
        // No valid level found: predict position using velocity only
        let speed = sqrt(trackerState.vx * trackerState.vx + trackerState.vy * trackerState.vy);
        let predictionFactor = min(1.0 + speed * 0.001, 2.0);
        trackerState.x = trackerState.x + trackerState.vx * dt * predictionFactor;
        trackerState.y = trackerState.y + trackerState.vy * dt * predictionFactor;

        trackerState.searchRadius = baseRadius * MAX_MULTIPLIER;

        // Decay expectedCount to allow re-initialization
        let newExpected = u32(f32(expectedCount) * 0.95);
        trackerState.expectedCount = max(newExpected, minParticles);
    }

    // Ensure expectedCount never drops below minParticles
    trackerState.expectedCount = max(trackerState.expectedCount, minParticles);

    // Reset all levels for next frame
    for (var lvl: u32 = 0u; lvl < NUM_LEVELS; lvl++) {
        atomicStore(&levels[lvl].sumDx, 0);
        atomicStore(&levels[lvl].sumDy, 0);
        atomicStore(&levels[lvl].sumVx, 0);
        atomicStore(&levels[lvl].sumVy, 0);
        atomicStore(&levels[lvl].totalWeight, 0);
        atomicStore(&levels[lvl].count, 0u);
    }
}