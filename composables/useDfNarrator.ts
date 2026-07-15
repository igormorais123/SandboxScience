/**
 * Narrador automatico do Particle Life DF v2.
 * Traduz metricas e eventos em frases de leitura politica (regra 2.4/2.5 do plano:
 * a forma vira palavra — sem isso, leigo nao interpreta a cena).
 */

import type { DfMetrics } from '~/composables/useDfEngine'
import type { DfScenario } from '~/constants/dfScenarios'

export interface NarrationMessage {
  id: number
  frame: number
  text: string
  kind: 'evento' | 'placar' | 'forma' | 'clima'
}

export class DfNarrator {
  private msgId = 0
  private prev: DfMetrics | null = null
  private lastLeader = -2
  private lastTerritoryLeaders: number[] = []
  private lastPolarizationBand = -1
  private cooldown = new Map<string, number>()
  messages: NarrationMessage[] = []

  reset() {
    this.msgId = 0
    this.prev = null
    this.lastLeader = -2
    this.lastTerritoryLeaders = []
    this.lastPolarizationBand = -1
    this.cooldown.clear()
    this.messages = []
  }

  say(frame: number, text: string, kind: NarrationMessage['kind'], cooldownKey?: string, cooldownFrames = 900) {
    if (cooldownKey) {
      const until = this.cooldown.get(cooldownKey) ?? -1
      if (frame < until) return
      this.cooldown.set(cooldownKey, frame + cooldownFrames)
    }
    this.messages.push({ id: this.msgId++, frame, text, kind })
    if (this.messages.length > 40) this.messages.shift()
  }

  onEvent(frame: number, narration: string) {
    this.say(frame, narration, 'evento')
  }

  observe(m: DfMetrics, scenario: DfScenario) {
    const f = m.frame

    // fase inicial: apresenta a cena
    if (!this.prev) {
      this.say(f, scenario.meta.description, 'forma')
      this.prev = m
      this.lastTerritoryLeaders = [...m.territoryLeaders]
      return
    }

    // lideranca do placar mudou
    if (m.scores.length > 0) {
      const leader = m.scores[0]
      if (leader.candidateId !== this.lastLeader && leader.share > 0.08) {
        if (this.lastLeader >= -1) {
          this.say(f, `${leader.name} assume a lideranca do placar emergente com ${(leader.share * 100).toFixed(0)}% dos capturados.`, 'placar', 'leader', 600)
        }
        this.lastLeader = leader.candidateId
      }
      // disputa apertada
      if (m.scores.length >= 2 && Math.abs(m.scores[0].share - m.scores[1].share) < 0.02 && m.scores[0].share > 0.12) {
        this.say(f, `Empate tecnico na fisica: ${m.scores[0].name} e ${m.scores[1].name} disputam particula a particula.`, 'placar', 'empate', 1800)
      }
    }

    // migracao relevante (mare)
    for (const s of m.scores) {
      const prevS = this.prev.scores.find(p => p.candidateId === s.candidateId)
      if (prevS && s.share - prevS.share > 0.035) {
        this.say(f, `Mare de migracao: ${s.name} ganhou ${((s.share - prevS.share) * 100).toFixed(1)} pontos em poucos segundos.`, 'placar', `mare-${s.candidateId}`, 1200)
      }
      if (prevS && prevS.share - s.share > 0.035) {
        this.say(f, `${s.name} sangra apoio: ${((prevS.share - s.share) * 100).toFixed(1)} pontos perdidos — observe para onde o voto escorre.`, 'placar', `sangria-${s.candidateId}`, 1200)
      }
    }

    // territorio virou de mao (Ceilandia decide)
    m.territoryLeaders.forEach((cid, tIdx) => {
      const prevCid = this.lastTerritoryLeaders[tIdx] ?? -1
      if (cid >= 0 && cid !== prevCid && prevCid >= 0) {
        const terr = scenario.territories[tIdx]
        const cand = scenario.candidates.find(c => c.id === cid)
        if (terr && cand) {
          this.say(f, `${terr.name} virou de mao: agora e territorio de ${cand.name}.`, 'placar', `terr-${tIdx}`, 1500)
        }
      }
    })
    this.lastTerritoryLeaders = [...m.territoryLeaders]

    // polarizacao (membrana)
    const band = m.polarization > 0.66 ? 2 : m.polarization > 0.33 ? 1 : 0
    if (band !== this.lastPolarizationBand && this.lastPolarizationBand >= 0) {
      const texts = [
        'A polarizacao afrouxa: as opinioes voltam a se misturar no centro.',
        'Polarizacao moderada: dois campos se formam, mas ainda ha ponte entre eles.',
        'Polarizacao maxima: membrana nitida entre dois blocos — a cidade virou duas cidades.',
      ]
      this.say(f, texts[band], 'forma', 'polar', 1200)
    }
    this.lastPolarizationBand = band

    // segregacao alta = bolhas
    if (m.segregation > 0.55 && (this.prev.segregation ?? 0) <= 0.55) {
      this.say(f, 'Bolhas consolidadas: cada grupo fala so com os seus. Indice de segregacao em alta.', 'forma', 'segr', 2400)
    }

    // temperatura
    if (m.temperature > 0.7 && this.prev.temperature <= 0.7) {
      this.say(f, 'Campanha fervendo: a temperatura politica disparou e o eleitorado circula.', 'clima', 'temp-hi', 1800)
    }
    if (m.temperature < 0.15 && this.prev.temperature >= 0.15 && f > 900) {
      this.say(f, 'A cena esfriou: posicoes cristalizadas, pouca movimentacao.', 'clima', 'temp-lo', 2400)
    }

    // indecisos em queda
    if (this.prev.undecided - m.undecided > 0.06) {
      this.say(f, `Os indecisos estao escolhendo lado: ${(m.undecided * 100).toFixed(0)}% ainda sem candidato.`, 'placar', 'indec', 1800)
    }

    this.prev = m
  }
}

export function useDfNarrator() {
  return new DfNarrator()
}
