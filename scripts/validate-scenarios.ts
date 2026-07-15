/**
 * Validacao de representatividade dos cenarios eleitorais.
 * Roda com: npx tsx scripts/validate-scenarios.ts
 *
 * Checa, para cada cenario:
 *  - proporcoes dos segmentos somam 1.0 (tolerancia 1%)
 *  - matrizes NxN consistentes com species/segments/types/colors
 *  - forcas normalizadas em [-1, 1]
 *  - minRadius < maxRadius em cada par (senao nao ha zona de interacao)
 *  - settings sensatos (frictionFactor em (0,1), forceFactor > 0)
 * E tambem o helper de proporcoes (contagem exata por maiores restos).
 */
import { ELECTORAL_SCENARIOS } from '../constants/electoralScenarios'
import { buildProportionalTypes } from '../helpers/utils/proportions'

let failures = 0
function check(cond: boolean, msg: string) {
    if (!cond) {
        failures++
        console.error(`  FALHA: ${msg}`)
    }
}

for (const sc of ELECTORAL_SCENARIOS) {
    const n = sc.settings.species
    console.log(`\n=== ${sc.meta.name} (${n} segmentos) ===`)

    check(sc.segments.length === n, `segments.length=${sc.segments.length} != species=${n}`)
    check(sc.colors.length === n, `colors.length=${sc.colors.length} != species=${n}`)

    const sum = sc.segments.reduce((a, s) => a + s.proportion, 0)
    check(Math.abs(sum - 1) < 0.01, `proporcoes somam ${sum.toFixed(4)} (deveria ser 1.0)`)

    for (const [name, m] of Object.entries(sc.matrices)) {
        check(m.length === n && m.every(row => row.length === n), `matriz ${name} nao e ${n}x${n}`)
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const f = sc.matrices.forces[i]?.[j]
            check(typeof f === 'number' && f >= -1 && f <= 1, `forces[${i}][${j}]=${f} fora de [-1,1]`)
            const minR = sc.matrices.minRadius[i]?.[j]
            const maxR = sc.matrices.maxRadius[i]?.[j]
            check(typeof minR === 'number' && minR > 0, `minRadius[${i}][${j}]=${minR} invalido`)
            check(typeof maxR === 'number' && maxR > minR, `maxRadius[${i}][${j}]=${maxR} <= minRadius=${minR}`)
        }
    }
    check(sc.settings.frictionFactor > 0 && sc.settings.frictionFactor < 1, `frictionFactor=${sc.settings.frictionFactor} fora de (0,1)`)
    check(sc.settings.forceFactor > 0, `forceFactor=${sc.settings.forceFactor} <= 0`)
    check(sc.settings.numParticles >= 100, `numParticles=${sc.settings.numParticles} < 100`)

    // Representatividade: contagens exatas do helper vs proporcoes declaradas
    const N = sc.settings.numParticles
    const types = buildProportionalTypes(N, n, sc.segments.map(s => s.proportion))
    const counts = new Array(n).fill(0)
    for (const t of types) counts[t]++
    for (let t = 0; t < n; t++) {
        const expected = (sc.segments[t].proportion / sum) * N
        const diff = Math.abs(counts[t] - expected)
        check(diff <= 1, `segmento "${sc.segments[t].shortName}": contagem ${counts[t]} difere de ${expected.toFixed(1)} por ${diff.toFixed(1)} (>1)`)
    }
    if (failures === 0) console.log('  OK')
}

console.log(`\n${ELECTORAL_SCENARIOS.length} cenarios validados, ${failures} falha(s).`)
process.exit(failures > 0 ? 1 : 0)
