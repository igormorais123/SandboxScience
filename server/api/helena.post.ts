import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { prompt, currentState } = body

  // OmniRouter (VPS INTEIA, custo zero) com fallback para API Anthropic
  const omniKey = process.env.OMNIROUTE_API_KEY || ""
  const omniUrl = process.env.OMNIROUTE_URL || "https://omniroute.srv1354997.hstgr.cloud"
  const apiKey = process.env.ANTHROPIC_API_KEY || ""

  if (!omniKey && !apiKey) {
    return { error: "Configure OMNIROUTE_API_KEY ou ANTHROPIC_API_KEY no ambiente para usar Helena." }
  }

  const useOmni = !!omniKey

  const systemPrompt = `Voce e Helena, cientista-chefe da INTEIA. Voce configura simulacoes de dinamica social com particulas.

Cada particula = uma pessoa/eleitor. Grupos = segmentos sociais. Forcas negativas = atracao (grupos se aproximam). Forcas positivas = rejeicao (grupos se afastam).

REGRAS DE CALIBRACAO:
- Auto-coesao (diagonal): -8 (disperso) a -55 (muito coeso)
- Atracao entre aliados: -3 (fraca) a -30 (forte)
- Rejeicao entre adversarios: +3 (fraca) a +45 (forte)
- Indiferenca: -3 a +3
- ASSIMETRIA e obrigatoria: se A atrai B com -20, B NAO deve atrair A com -20
- Valores na matriz sao normalizados para [-1, 1] (divida por 60)

FORMATO DE RESPOSTA (JSON puro, sem markdown):
{
  "meta": { "name": "nome do cenario", "description": "descricao" },
  "segments": [
    { "id": 0, "name": "Nome Completo", "shortName": "Abrev", "color": "#hex", "proportion": 0.25, "description": "quem sao" }
  ],
  "settings": { "species": 4, "numParticles": 1000, "frictionFactor": 0.15, "forceFactor": 1.0 },
  "matrices": {
    "forces": [[...]],
    "minRadius": [[...]],
    "maxRadius": [[...]]
  },
  "interpretation": {
    "whatToWatch": ["o que observar 1", "o que observar 2"],
    "hypotheses": ["hipotese 1"],
    "keyDynamics": ["dinamica chave 1"]
  }
}

Estado atual da simulacao: ${JSON.stringify(currentState || {})}

Responda APENAS com o JSON. Sem explicacao, sem markdown. JSON puro.`

  try {
    const baseUrl = useOmni ? `${omniUrl}/v1/messages` : "https://api.anthropic.com/v1/messages"
    const headers: Record<string, string> = { "Content-Type": "application/json" }

    if (useOmni) {
      headers["Authorization"] = `Bearer ${omniKey}`
    } else {
      headers["x-api-key"] = apiKey
      headers["anthropic-version"] = "2023-06-01"
    }

    const response = await fetch(baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      return { error: `Claude API erro ${response.status}: ${errText}` }
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ""

    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { error: "Helena nao retornou JSON valido.", raw: text }
    }

    const config = JSON.parse(jsonMatch[0])
    return { success: true, config, interpretation: config.interpretation }
  } catch (err: any) {
    return { error: `Erro ao chamar Helena: ${err.message}` }
  }
})
