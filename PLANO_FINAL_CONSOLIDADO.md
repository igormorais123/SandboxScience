# PLANO FINAL CONSOLIDADO — INTEIA SIMULADOR UNIVERSAL
## Fusao: SandboxScience + Particle Life Lab + Lenia Eleitoral + Mirofish
## INTEIA | Igor Morais Vasconcelos | ONIR | 2026-03-21

---

## VISAO

Um motor visual de dinamica social onde:
1. O usuario descreve um caso em linguagem natural (ou anexa documento)
2. A IA extrai grupos, relacoes, stakeholders e eventos
3. O motor de particulas simula a dinamica em tempo real
4. A IA interpreta o que acontece e recomenda acoes
5. O usuario compara cenarios, testa hipoteses e exporta relatorios

**Tres camadas de inteligencia**:
- **Motor** (SandboxScience) — fisica de particulas, GPU/CPU, visual
- **Contexto** (Mirofish) — grafo de conhecimento, agentes sinteticos, narrativa
- **Interpretacao** (Claude API) — gera config, interpreta, compara, recomenda

---

## O QUE CADA PROJETO CONTRIBUI

| Projeto | Contribuicao | Status |
|---|---|---|
| **SandboxScience** | Motor de particulas GPU/CPU, matriz editavel, presets, brush, camera | Fork pronto |
| **Particle Life Lab** | Skill de calibracao, 27 presets, otimizacoes Canvas2D, aprendizados de performance | Skill criada |
| **Lenia Eleitoral** | 10 segmentos RR, FORCE_MATRIX calibrada, eventos, candidatos, dados TSE | Online inteia.com.br |
| **Mirofish** | Grafo de conhecimento, agentes sinteticos, simulacao narrativa, export para Lenia | Em desenvolvimento |

---

## ARQUITETURA FINAL

```
                    USUARIO
                       |
            [Descreve caso / anexa doc]
                       |
              +--------+--------+
              |                 |
         [Modo Rapido]    [Modo Profundo]
              |                 |
       Claude API          Mirofish
       (10 seg)            (10 min)
              |                 |
     Gera JSON config    Grafo + Agentes
              |            + Simulacao OASIS
              |                 |
              +--------+--------+
                       |
              CaseConfiguration
              (grupos, forcas, raios,
               stakeholders, eventos,
               interpretacao)
                       |
            +---------+---------+
            |                   |
     Pre-teste headless    Validacao
     (100 ticks)           (limites empiricos)
            |                   |
            +---------+---------+
                       |
              MOTOR SANDBOXSCIENCE
              (GPU: 64K | CPU: 10K)
                       |
         +-------------+-------------+
         |             |             |
    Simulacao     Interpretacao   Comparador
    em tempo      automatica     lado a lado
    real          (a cada 60s)   (2 cenarios)
         |             |             |
         +-------------+-------------+
                       |
              EXPORT (PDF/JSON/Link)
```

### Modo Rapido vs Modo Profundo

| Aspecto | Modo Rapido | Modo Profundo |
|---|---|---|
| Input | Texto livre (500-2000 chars) | Documentos completos + briefing |
| Engine | Claude API direto | Mirofish (grafo + OASIS) |
| Tempo | ~10 segundos | ~10 minutos |
| Output | CaseConfiguration JSON | Grafo + agentes + narrativa + CaseConfiguration |
| Profundidade | Grupos e forcas estimados | Relacoes temporais, perfis psicologicos, simulacao narrativa |
| Custo | ~$0.03 | ~$0.50 (mais chamadas LLM) |
| Quando usar | Exploracao rapida, brainstorm | Analise estrategica seria, apresentacao |

---

## FLUXO COMPLETO DO USUARIO

### 1. Entrada
```
Usuario abre inteia.com.br/simulador
   |
   +-- [Explorar Roraima 2026] → Caso showcase, pronto para rodar
   +-- [Criar Caso Rapido] → Textarea + "Gerar" (Claude API, 10s)
   +-- [Criar Caso Profundo] → Upload docs + briefing (Mirofish, 10min)
   +-- [Importar JSON] → Cola ou sobe CaseConfiguration
   +-- [Meus Cenarios] → Salvos no navegador
```

### 2. Geracao
```
IA (Claude ou Mirofish) analisa e gera:
   |
   +-- Grupos (2-8) com nomes, cores, proporcoes, descricoes
   +-- FORCE_MATRIX NxN com explicacao de cada forca
   +-- RADIUS_MATRIX NxN
   +-- Stakeholders com afinidades por grupo
   +-- Eventos sugeridos com deltas de forca
   +-- Interpretacao inicial ("O que observar")
   |
Pre-teste automatico (100 ticks headless):
   +-- Se colapsar → reduz forcas 30%, roda de novo
   +-- Se dispersar → aumenta forcas 50%, roda de novo
   +-- Se instavel → aumenta friccao
   +-- Maximo 3 tentativas
   |
Preview para o usuario:
   +-- Miniatura animada (200x200)
   +-- "4 grupos, 6 stakeholders, 8 eventos"
   +-- Confianca: 78%
   +-- [Aplicar] [Editar] [Descartar]
```

### 3. Simulacao
```
Motor SandboxScience roda:
   |
   +-- GPU (64K particulas, 60 FPS) se WebGPU disponivel
   +-- CPU (10K particulas, 30+ FPS) fallback
   |
Controles:
   +-- Matriz editavel (nomes de grupos nos headers)
   +-- Sliders de dinamica (inercia, intensidade, alcance)
   +-- Brush (campanha = atrair, crise = dispersar)
   +-- Camera (zoom, pan, tracking, drift cinematico)
   +-- Eventos (botoes com fade-out temporal)
   +-- Stakeholders (toggle, arrastar, raio de influencia)
```

### 4. Interpretacao
```
A cada 60 segundos, IA captura snapshot e interpreta:
   |
   +-- "A Base se manteve coesa (-0.03 de variacao)"
   +-- "O Campo fragmentou: 35% migrou para Mercado"
   +-- "Risco: se volatilidade subir >0.6, Campo cristaliza longe"
   +-- "Oportunidade: ativar alianca pastoral AGORA"
   |
Usuario pode perguntar:
   +-- "E se eu disparar fake news?"
   +-- IA gera evento, aplica, observa, interpreta
```

### 5. Comparacao
```
Dois canvas lado a lado, mesma seed:
   |
   +-- Cenario A: "Sem alianca pastoral"
   +-- Cenario B: "Com alianca pastoral"
   |
Metricas comparativas:
   +-- Captura Base: 18% vs 28% (▲ +10%)
   +-- Volatilidade: 0.45 vs 0.31 (▼ -0.14)
   |
IA conclui:
   +-- "Alianca pastoral aumenta captura em 55% e estabiliza Campo"
```

### 6. Modo Historia
```
Timeline de campanha (12 semanas):
   |
   +-- Semana 1: Lancamento
   +-- Semana 3: Alianca pastoral
   +-- Semana 5: Fake news adversario
   +-- Semana 7: CNH gratis viraliza
   +-- Semana 10: Comicio final
   |
Simulador roda automaticamente, eventos ativam na sequencia
Grafico temporal mostra evolucao de captura, volatilidade, coesao
IA narra cada fase
```

### 7. Export
```
PDF profissional com marca INTEIA:
   +-- Capa: titulo do caso + data
   +-- Configuracao: grupos, matrizes, stakeholders
   +-- Timeline: screenshots semanais
   +-- Metricas: graficos de evolucao
   +-- Interpretacao: insights da IA
   +-- Recomendacoes: acoes prioritarias
   +-- Metodologia: como a simulacao funciona
```

---

## INTEGRACAO MIROFISH → MOTOR DE PARTICULAS

### Ponte de dados

```
Mirofish                           Motor de Particulas
   |                                      |
Grafo (entidades, relacoes)  →   Grupos (tipos de particula)
Agentes OASIS (perfis)       →   Stakeholders (particulas especiais)
Simulacao narrativa (acoes)  →   Eventos (perturbacoes temporarias)
Sinais (complexity, pressure) →  Calibracao (forcas, raios, friccao)
Relatorio Helena             →   Interpretacao inicial
```

### Mapeamento automatico

```typescript
function mirofishToParticleConfig(leniaExport: MirofishExport): CaseConfiguration {
  // Sinais → parametros de fisica
  const frictionFactor = 0.3 + (leniaExport.signals.complexity_score / 100) * 0.2
  // Complexidade alta → mais friccao → mais lento → mais estavel

  const forceMult = 0.8 + (leniaExport.signals.narrative_pressure / 100) * 0.4
  // Pressao narrativa alta → forcas mais intensas

  // Entidades do grafo → grupos de particulas
  const groups = leniaExport.segmentos.map((seg, i) => ({
    id: i,
    name: seg,
    proportion: 1 / leniaExport.segmentos.length, // uniforme ou calibrado
    cohesion: 0.5 - (leniaExport.signals.mobilization_score / 200),
  }))

  // Atores → stakeholders
  const stakeholders = leniaExport.atores.map(ator => ({
    name: ator,
    role: "Ator politico",
    influence: leniaExport.signals.territorial_sensitivity / 100,
  }))

  // Hipoteses → eventos
  const events = leniaExport.hipoteses.map(h => ({
    name: h,
    description: `Hipotese: ${h}`,
    type: "perturbacao",
    duration: 200,
  }))

  return { groups, stakeholders, events, ... }
}
```

### Metricas cruzadas (Mirofish + Particulas)

| Metrica Mirofish | Metrica Particulas | Correlacao |
|---|---|---|
| complexity_score | Numero de clusters estaveis | Mais complexo → mais clusters |
| narrative_pressure | Velocidade media das particulas | Mais pressao → mais movimento |
| mobilization_score | Captura de stakeholder principal | Mais mobilizacao → mais captura |
| territorial_sensitivity | Distancia entre clusters | Mais sensivel → mais separacao |

---

## MODELO DE NEGOCIO FINAL

| Tier | O que inclui | Preco | Target |
|---|---|---|---|
| **Free** | Motor de particulas + 3 casos rapidos/mes + Roraima showcase | Gratis | Curiosos, academicos |
| **Pro** | Casos ilimitados + comparador + timeline + interpretacao IA + PDF | R$49/mes | Consultores, pesquisadores |
| **Enterprise** | Modo profundo (Mirofish) + dados privados + API + on-premise | R$199/mes | Campanhas, empresas |
| **Consultoria** | Analise humana + simulacao customizada + relatorio estrategico | Projeto | Clientes INTEIA |

**Receita projetada (ano 1)**:
- 1000 usuarios free → 100 Pro (10%) → R$4.900/mes
- 10 Enterprise → R$1.990/mes
- 4 consultorias/mes → R$20.000/mes
- **Total: ~R$26.890/mes = R$322K/ano**

---

## CRONOGRAMA CONSOLIDADO

### V1 — Demo eleitoral funcional (4h)
```
Fase 0+1: Boot + cenarios Roraima (1h45min)
Fase 2: PT-BR + rebranding INTEIA (1h30min)
Fase 3: Nomes + legenda + metricas lite (1h)
GATE V1 ✓
```

### V1.1 — Inteligencia acionavel (3h)
```
Fase 4: Eventos temporarios + stakeholders basicos
GATE V1.1 ✓
```

### V2 — Motor universal com IA (8h)
```
IA-1: Schema CaseConfiguration
IA-2: useAIConfig + chamada Claude
IA-3: AIConfigPanel UI
IA-4: Validacao + pre-teste automatico
IA-5: 5 casos de teste
GATE V2 ✓
```

### V2.1 — Interpretacao e comparacao (6h)
```
Interpretacao automatica a cada 60s
Comparador lado a lado
Modo historia com timeline
GATE V2.1 ✓
```

### V3 — Produto completo (10h)
```
PDF export
10 clusters
Integracao Mirofish (modo profundo)
Auth + assinatura
API publica
Dashboard de uso
GATE V3 ✓
```

**Total: ~31h do zero ao produto completo**

---

## DECISOES ARQUITETURAIS FIRMES

1. **SandboxScience e o motor**. Nao reescrever fisica.
2. **CPU e o default**. GPU e bonus.
3. **4 clusters na V1**. 10 na V3.
4. **Roraima e o showcase, nao o produto**. O produto e o motor universal.
5. **Claude API para modo rapido**. Mirofish para modo profundo.
6. **Interpretacao automatica e o diferencial**. Sem ela, e so mais um particle life.
7. **Pre-teste automatico obrigatorio**. IA pode gerar config ruim.
8. **Dados sensiveis nunca no bundle**. Server-side ou modo privado.
9. **Cada feature nova testada no navegador antes de declarar pronta**.
10. **Batch render + cached DOM + flat matrices**. Performance first.

---

## DIFERENCIAL UNICO NO MUNDO

**INTEIA Simulador** e o PRIMEIRO e UNICO sistema que combina:

1. Motor de particulas GPU (64K particulas, 60 FPS)
2. IA generativa que configura automaticamente a partir de texto
3. Interpretacao automatica em tempo real do que a simulacao significa
4. Comparador visual de cenarios lado a lado
5. Timeline de campanha com eventos sequenciais
6. Export PDF profissional com analise da IA
7. Modo profundo com grafo de conhecimento (Mirofish)
8. Motor universal — funciona para eleicoes, corporativo, geopolitica, juridico

Ninguem tem isso. Nem em ingles. Nem em pesquisa academica.

---

## PROXIMA ACAO

```bash
cd C:\Users\IgorPC\projetos\projetos-claude\SandboxScience
npm install
npm run dev
# Abrir http://localhost:3000/particle-life
# Se funcionar: iniciar Fase 0+1
```

---

*INTEIA — Igor Morais Vasconcelos — ONIR — 2026-03-21*
*"Tres motores. Uma visao. Qualquer caso."*
*SandboxScience + Mirofish + Claude = Motor Universal de Dinamica Social*
