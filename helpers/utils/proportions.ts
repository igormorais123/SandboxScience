/**
 * Distribuicao proporcional de tipos de particulas.
 *
 * Os cenarios eleitorais definem `proportion` por segmento (ex.: Jovens 25.1%,
 * Comissionados 3.8%). Antes, os motores sorteavam tipos uniformemente e a
 * populacao simulada nao correspondia a legenda. Estas funcoes garantem
 * contagens exatas por tipo (metodo dos maiores restos) e ordem aleatoria
 * (Fisher-Yates), para que a simulacao seja representativa.
 */

/** Normaliza um vetor de proporcoes para somar 1. Retorna null se invalido. */
export function normalizeProportions(proportions: number[] | undefined, numTypes: number): number[] | null {
    if (!proportions || proportions.length !== numTypes) return null
    let sum = 0
    for (const p of proportions) {
        if (!(p >= 0) || !isFinite(p)) return null
        sum += p
    }
    if (sum <= 0) return null
    return proportions.map(p => p / sum)
}

/**
 * Gera um array de `n` tipos respeitando as proporcoes com contagem exata
 * (maiores restos) e embaralhado (Fisher-Yates).
 * Sem proporcoes validas, cai no uniforme exato (n/numTypes por tipo).
 */
export function buildProportionalTypes(n: number, numTypes: number, proportions?: number[]): Int32Array {
    const result = new Int32Array(n)
    if (n <= 0 || numTypes <= 0) return result

    const norm = normalizeProportions(proportions, numTypes)
    const counts = new Int32Array(numTypes)

    if (norm) {
        // Maiores restos: floor + distribui o residuo para os maiores restos
        let assigned = 0
        const remainders: { t: number, r: number }[] = []
        for (let t = 0; t < numTypes; t++) {
            const exact = norm[t] * n
            const fl = Math.floor(exact)
            counts[t] = fl
            assigned += fl
            remainders.push({ t, r: exact - fl })
        }
        remainders.sort((a, b) => b.r - a.r)
        for (let k = 0; assigned < n; k = (k + 1) % numTypes) {
            counts[remainders[k].t]++
            assigned++
        }
    } else {
        const base = Math.floor(n / numTypes)
        let rem = n % numTypes
        for (let t = 0; t < numTypes; t++) counts[t] = base + (rem-- > 0 ? 1 : 0)
    }

    let i = 0
    for (let t = 0; t < numTypes; t++) {
        for (let c = 0; c < counts[t]; c++) result[i++] = t
    }
    // Fisher-Yates
    for (let j = n - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1))
        const tmp = result[j]; result[j] = result[k]; result[k] = tmp
    }
    return result
}

/** Sorteia UM tipo pela distribuicao acumulada (para adicoes incrementais). */
export function sampleTypeByProportion(numTypes: number, proportions?: number[]): number {
    const norm = normalizeProportions(proportions, numTypes)
    if (!norm) return Math.floor(Math.random() * numTypes)
    let r = Math.random()
    for (let t = 0; t < numTypes; t++) {
        r -= norm[t]
        if (r <= 0) return t
    }
    return numTypes - 1
}
