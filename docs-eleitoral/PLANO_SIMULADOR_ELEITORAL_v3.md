# PLANO DO SIMULADOR ELEITORAL — VERSAO DEFINITIVA
## INTEIA | Igor Morais Vasconcelos | 2026-03-21
### Inspiracao tecnica: SandboxScience/particle-life | Objetivo: inteligencia eleitoral

---

## PRINCIPIO CENTRAL

Nao e um simulador de vida artificial com rotulo eleitoral.
E um **simulador de dinamica social** que usa fisica de particulas como metafora visual.

Cada elemento tecnico tem um **significado social**:

| Termo tecnico (Lenia) | Significado social (simulador) |
|------------------------|-------------------------------|
| Particula | Eleitor |
| Especie/Tipo | Segmento eleitoral |
| Forca de atracao | Afinidade entre grupos (compartilham valores, interesses, vizinhanca) |
| Forca de repulsao | Rejeicao entre grupos (conflito de interesses, ideologia oposta) |
| Raio de interacao | Alcance de influencia (ate onde um grupo influencia outro) |
| Raio minimo (repulsao core) | Espaco pessoal — individuos nao se fundem, mantem identidade |
| Friccao/Viscosidade | Inercia social — resistencia a mudanca (sociedade nao muda rapido) |
| Velocidade | Volatilidade — eleitor em transicao rapida vs enraizado |
| Tamanho do ponto | Engajamento — quem participa mais, influencia mais |
| Opacidade | Fidelidade — solido = voto garantido, transparente = voto a venda |
| Evento | Acontecimento que perturba o equilibrio (fake news, campanha, crise) |
| Stakeholder | Particula grande com gravidade propria (candidato, governador, pastor) |
| Cluster formado | Coalicao emergente — quem se juntou naturalmente |
| Cluster que se desfaz | Coalicao instavel — base fragil ou ataque eficaz |
| Particula solta entre clusters | Swing voter — o voto que decide eleicao |
| Brush/Ima | Forca externa do usuario — simula intervencao (campanha, dinheiro, crise) |

---

## ARQUITETURA DO SIMULADOR

### Layout (inspirado SandboxScience)

```
+---------------------------+----------------------------------------+
|  PAINEL ESQUERDO (320px)  |                                        |
|  scrollavel               |           CANVAS (resto)               |
|                           |                                        |
|  [Cenario]                |     Particulas vivas, organicas        |
|  [Configuracoes Mundo]    |     Stakeholders identificados         |
|  [Segmentos]              |     Dinamica de atracoes               |
|  [Matriz de Forcas]       |                                        |
|  [Stakeholders]           |                                        |
|  [Eventos]                |                                        |
|  [Ferramentas]            |                                        |
|  [Metricas]               |                                        |
|                           |                                        |
+---------------------------+----------------------------------------+
|  BARRA INFERIOR: Timeline da campanha + metricas em tempo real     |
+--------------------------------------------------------------------+
```

---

## PAINEL ESQUERDO — SECOES COLAPSAVEIS

### 1. CENARIO (preset)

Dropdown com cenarios pre-configurados:

| Cenario | Descricao | Clusters | Particulas |
|---------|-----------|----------|------------|
| Roraima 2026 (base) | Estado atual sem intervencao | 4 | 1000 |
| Campanha JE — CNH Gratis | JE lanca campanha digital para jovens | 4 | 1000 |
| Cassacao Denarium | TSE cassa governador, maquina colapsa | 4 | 1000 |
| Guerra de compra de voto | Todos candidatos comprando simultaneamente | 4 | 1000 |
| Alianca pastoral ativada | Diniz ativa rede evangelica para JE | 4 | 1000 |
| Cenario pessimista | Tudo da errado para JE | 4 | 1000 |
| Cenario otimista | Tudo da certo para JE | 4 | 1000 |
| Sandbox livre | Nenhum preset, usuario configura tudo | 1-8 | 100-5000 |

Botoes: [REINICIAR] [ALEATORIO] [IMPORTAR] [EXPORTAR]

---

### 2. CONFIGURACOES DO MUNDO

Sliders com nomes SOCIAIS, nao tecnicos:

| Controle | Significado | Range | Default |
|----------|------------|-------|---------|
| **Eleitores** | Quantidade total de particulas | 200-5000 | 1000 |
| **Segmentos** | Quantidade de clusters | 2-8 | 4 |
| **Tamanho do territorio** | Largura x Altura do mundo | 400-2000 | 900x700 |
| **Inercia social** | Viscosidade — quanto a sociedade resiste a mudanca | 0.5-0.95 | 0.85 |
| **Espaco pessoal** | Raio minimo entre eleitores (previne colapso) | 5-30 | 12 |
| **Intensidade das relacoes** | Multiplicador global de forcas | 0.2-3.0 | 1.0 |
| **Fronteira** | Tipo de borda: Parede / Reflexo / Infinito | enum | Reflexo |
| **Rastro visual** | Quanto o rastro persiste (0=limpo, 1=permanente) | 0-1 | 0.15 |
| **Velocidade** | Ticks por frame | 1-5 | 2 |

---

### 3. SEGMENTOS ELEITORAIS

Cardapio de segmentos disponiveis. Usuario marca/desmarca quais quer na simulacao:

```
[x] Base Fiel          180  ████████   [cor] [editar]
[x] Campo de Disputa   420  ████████   [cor] [editar]
[x] Mercado            250  ████████   [cor] [editar]
[x] Territorio Alheio  150  ████████   [cor] [editar]
[ ] Funcionalismo      108  ████████   [cor] [editar]
[ ] Comissionados       38  ████████   [cor] [editar]
[ ] Evangelicos        141  ████████   [cor] [editar]
[ ] Jovens Urbanos     251  ████████   [cor] [editar]
[ ] Mercado do Voto    128  ████████   [cor] [editar]
[ ] Indigena Organizado 90  ████████   [cor] [editar]
[ ] Classe Media        90  ████████   [cor] [editar]
[ ] Interior Agro       77  ████████   [cor] [editar]
[ ] Mulheres Periferia  52  ████████   [cor] [editar]
[ ] Fronteira/Seguranca 25  ████████   [cor] [editar]
[ ] + Criar novo segmento...
```

Cada segmento tem botao [editar] que abre:
- Nome, cor, quantidade
- Perfil: engajamento, fidelidade, vulnerabilidade, orientacao (sliders)
- Descricao (tooltip)

Presets de agrupamento:
- [4 clusters estrategicos] — Base, Campo, Mercado, Alheio
- [10 segmentos reais] — os 10 pesquisados
- [Simples esq-dir] — 3 grupos: esquerda, centro, direita
- [Personalizado] — usuario define

---

### 4. MATRIZ DE FORCAS (editavel visual)

Inspirada no SandboxScience mas com nomes sociais:

```
AFINIDADE ENTRE SEGMENTOS
(Clique para ajustar | Verde=afinidade | Vermelho=rejeicao)

         Base    Campo   Mercado  Alheio
Base     [===]   [===]   [===]    [===]
Campo    [===]   [===]   [===]    [===]
Mercado  [===]   [===]   [===]    [===]
Alheio   [===]   [===]   [===]    [===]

Cada celula: slider visual -50 a +50
Verde saturado = forte afinidade
Vermelho saturado = forte rejeicao
Preto = neutro
```

Abas: [Afinidades] [Alcance] — alterna entre FORCE_MATRIX e RADIUS_MATRIX

Botoes: [RESET] [ALEATORIO] [SIMETRICO on/off]

Tooltip em cada celula: "Base Fiel → Campo de Disputa: afinidade moderada (-15). Significa: policiais e servidores de JE influenciam jovens e mulheres nas vizinhancas."

---

### 5. STAKEHOLDERS (cardapio completo)

Lista de participantes que o usuario pode ADICIONAR ou REMOVER da simulacao:

#### Candidatos (deputados estaduais)
```
[ ] Jorge Everton (Uniao) — Delegado, vice-pres ALE, 6.627 votos
[ ] Soldado Sampaio (Republicanos) — Pres ALE, mais votado, 8.746
[ ] Cel. Chagas (PRTB) — Lider governo, seguranca
[ ] Eder Lourinho (PSD) — Ruralista, pro-garimpo
[ ] Joilma Teodora (Podemos) — Mulheres, inclusao, 7.649
[ ] Catarina Guerra (Uniao) — Educacao, BV+sul, 6.939
[ ] Armando Neto (PL) — Indigena Wapichana no PL
[ ] Aurelina Medeiros (Podemos) — Veterana 7o mandato
[ ] Neto Loureiro (PL) — Jovens, saude, 7.053
[ ] Chico Mozart (PP) — BV, animais, 6.661
```

#### Figuras de poder (nao candidatos a dep estadual)
```
[ ] Denarium (PP) — Governador, maquina de cestas, risco cassacao
[ ] Edilson Damiao (Uniao) — Vice-gov, candidato a governador
[ ] Teresa Surita (MDB) — Ex-prefeita BV, lidera Senado
[ ] Arthur Henrique (MDB) — Prefeito BV reeleito, cogitado gov
[ ] Romero Juca (MDB) — Ex-senador, controla midia
[ ] Mecias de Jesus (Rep) — Conselheiro TCE, ex-senador
[ ] Joenia Wapichana — Ex-FUNAI, candidata 2026
[ ] Pastor Diniz (Uniao) — Dep federal, rede evangelica
```

#### Forcas sociais (nao sao pessoas, sao entidades)
```
[ ] CIR (Conselho Indigena) — Gravidade propria sobre indigenas
[ ] Maquina Estadual — Atrai mercado do voto
[ ] Igreja Evangelica — Atrai evangelicos
[ ] WhatsApp/TikTok — Atrai jovens (forca de desinformacao)
```

Cada stakeholder tem:
- Nome visivel sobre a particula (tamanho ajustavel)
- Cor propria
- Perfil de afinidade com cada segmento (quem ele atrai/repele)
- Tamanho: 2-3x maior que particula normal (identificavel sem poluir)
- Raio de influencia visivel (circulo translucido ao redor)
- Toggle: [ativo/inativo]

---

### 6. EVENTOS (botoes + timeline)

#### Eventos disponiveis (botoes no painel)

**Campanhas**:
- [CNH Gratis — TikTok] — afeta Campo, engajamento sobe
- [Delegado Protege — WhatsApp] — afeta Campo mulheres
- [Alianca Pastoral] — afeta Campo evangelicos
- [Gabinete Itinerante] — afeta Campo + Mercado proximos

**Crises**:
- [Cassacao Denarium] — Mercado perde ancora, caos
- [Fake News viral] — todos engajam, tolerancia cai
- [Crise de Saude] — mulheres e indigenas engajam
- [Escandalo de Corrupcao] — fidelidade cai geral

**Competicao**:
- [Concorrente compra votos] — Mercado migra, Campo arrastado
- [Sampaio faz evento grande] — Base parcialmente atraida
- [Joilma lanca programa mulher] — Campo feminino disputa

**Estruturais**:
- [Greve servidores] — Funcionalismo engaja, tolerancia cai
- [Operacao PF — compra de voto] — Mercado dispersa (medo)
- [Linhao de energia ativado] — Interior agro satisfeito

#### Timeline de campanha (barra inferior)

```
MAR -------- ABR -------- MAI -------- JUN -------- JUL -------- AGO -------- SET -------- OUT
 |             |             |            |             |            |            |            |
 Inteligencia  Simulacao    Copy TikTok   Juridico     Gabinete    Aliancas    Digital     D-15
                            piloto CNH                  itinerante  pastorais   full        VOTO
```

Usuario pode:
- Arrastar eventos para posicoes na timeline
- Play: roda a campanha inteira em sequencia (1 tick = 1 dia, 240 ticks = 8 meses)
- Pausar em qualquer ponto e analisar estado
- Comparar dois cenarios lado a lado

---

### 7. FERRAMENTAS DE INTERACAO (mouse no canvas)

#### Super-ima (brush)

Tres modos de brush (ciclavel por tecla B ou botao):

| Modo | Visual | O que faz | Significado |
|------|--------|-----------|-------------|
| **Atrair** | Circulo verde | Puxa particulas para o cursor | Simula campanha focada numa regiao |
| **Repelir** | Circulo vermelho | Empurra particulas do cursor | Simula crise/escandalo que dispersa |
| **Mover** | Circulo azul | Arrasta grupo inteiro para nova posicao | Simula deslocamento de base eleitoral |

Slider de raio do brush: 30-200px
Slider de intensidade: 1-100

#### Selecao

- Click numa particula: mostra tooltip com todos atributos
- Arrastar retangulo: seleciona grupo → mostra estatisticas agregadas (% cada segmento, media fidelidade, etc)
- Shift+click num stakeholder: "segue" ele — camera acompanha

#### Zoom e Pan

- Scroll: zoom in/out
- Click direito + arrastar: pan
- Duplo click: centralizar
- Tecla F: fullscreen

---

### 8. METRICAS EM TEMPO REAL (painel inferior ou lateral)

#### Metricas principais (sempre visiveis)

```
JORGE EVERTON
Votos estimados: 7.240 / meta 10.000  [=========>        ] 72%
Base Fiel: 2.100 (captura 95%)
Campo conquistado: 3.400 (captura 35%)
Mercado comprado: 1.500 (captura 28%)
Territorio alheio: 240 (captura 6%)

POLARIZACAO: 0.42 (moderada)
VOLATILIDADE: 0.35 (estabilizando)
FIDELIDADE MEDIA: 0.38
```

#### Grafico de evolucao (mini chart)

Linha temporal mostrando como a captura de cada cluster muda ao longo dos ticks/eventos.

#### Comparador de cenarios

Botao [SNAPSHOT] salva estado atual. Pode comparar 2 snapshots:
"Antes do TikTok CNH: 6.800 votos. Depois: 8.200. Delta: +1.400"

---

## FISICA — BASEADA NO SANDBOXSCIENCE

### Funcao de forca (triangulo, comprovada)

```javascript
function getForce(rule, minR, maxR, d) {
    if (d < minR) {
        // Repulsao universal (espaco pessoal)
        // Previne colapso, cria camadas como celulas
        return (REPEL / minR) * d - REPEL;
    } else if (d > maxR) {
        return 0; // fora do alcance
    } else {
        // Zona de afinidade/rejeicao (triangulo)
        const mid = (minR + maxR) / 2;
        const slope = rule / (mid - minR);
        return -(slope * Math.abs(d - mid)) + rule;
    }
}
```

Isso garante:
- Particulas NUNCA colapsam (repulsao core)
- Formam CAMADAS concentricas (como os exemplos SandboxScience)
- Movimento ORGANICO — nao parado, nao caotico
- Grupos distintos com fronteiras visiveis

### Parametros de performance

| Particulas | Alvo FPS | Metodo |
|-----------|----------|--------|
| 1000 | 60fps | Spatial hash, fillRect |
| 2000 | 45fps | Spatial hash, fillRect |
| 5000 | 30fps | Spatial hash, fillRect, reduzir cr |

### Integracao de velocidade (Hunar style)

```javascript
// Velocidade com inercia social
a.vx = a.vx * (1 - viscosity) + forceX;
a.vy = a.vy * (1 - viscosity) + forceY;

// Integrar posicao
a.x += a.vx;
a.y += a.vy;

// Reflexao nas bordas
if (a.x < 0 || a.x > W) a.vx *= -1;
if (a.y < 0 || a.y > H) a.vy *= -1;
```

---

## VISUAL

### Particulas

- Tamanho base: 2px (ajustavel 1-8)
- Engajamento: +0 a +1.5px (total 2-3.5px)
- Forma: quadrado (fillRect, mais rapido que circulo)
- Modo cluster: cor fixa por segmento
- Modos alternativos: fidelidade, vulnerabilidade, orientacao, municipio

### Stakeholders

- Tamanho: 6-8px (2-3x particula)
- Forma: circulo com borda branca
- Nome: texto 7px acima da particula, cor do stakeholder
- Partido: texto 6px abaixo, cinza
- Raio de influencia: circulo translucido (10% opacidade) ao redor
- Quando hover: mostra tooltip com perfil completo

### Fundo

- Preto (#050508) com trail configuraveis
- Sem grade, sem borda visivel (clean)
- Vinheta sutil nas bordas (gradiente radial transparente)

### Marca INTEIA

- Header minimo: logo INTE**IA** + titulo + pesquisador
- Cores douradas (#c89520) para titulos e destaques
- Fonte Inter (sans-serif)
- Barra inferior com metricas em tempo real

---

## ATALHOS DE TECLADO

| Tecla | Acao |
|-------|------|
| Espaco | Pausar/retomar |
| R | Reset (reiniciar com mesma config) |
| B | Ciclar modo brush (atrair/repelir/mover/off) |
| T | Toggle trails on/off |
| S | Screenshot (baixar PNG) |
| F | Fullscreen |
| 1-4 | Selecionar segmento (highlight) |
| + / - | Zoom |
| Tab | Ciclar modo de cor |

---

## TESTES DE HIPOTESE PRE-PROGRAMADOS

Botao [TESTAR HIPOTESE] abre menu:

| Hipotese | O que faz | O que medir |
|----------|-----------|-------------|
| "TikTok CNH converte jovens?" | Ativa evento CNH no tick 100, mede Campo antes/depois | % Campo capturado por JE |
| "Alianca pastoral vale mais que parece?" | Ativa evento pastoral, mede arrasto de vizinhos | % nao-evangelicos arrastados |
| "Cassacao Denarium: quem captura?" | Remove ancora do Mercado no tick 100, mede fragmentacao | % Mercado que migra para cada cluster |
| "Compra de voto arrasta Campo?" | Concorrente ativa compra no Mercado, mede efeito no Campo | Velocidade de arrasto Campo→Mercado |
| "Servico do mandato ancora?" | JE presta servico antes de evento adversario | Fidelidade media dos "tocados" vs nao-tocados |

Cada teste:
1. Roda automaticamente ate tick 200
2. Injeta evento no tick 100
3. Mede delta antes/depois
4. Exibe resultado em popup: "Hipotese CONFIRMADA/REFUTADA: delta = X%"

---

## PERFORMANCE — A RESTRICAO REAL

### O problema
SandboxScience roda 64.000 particulas com WebGPU (GPU). Nos rodamos em Canvas 2D (CPU). Ryzen 9 7900 e forte mas single-thread JS tem limite. Medido no Playwright: 1000 particulas = 14ms/frame = 60fps OK. Mas cada feature nova (brush, stakeholders, metricas, opacidade) come margem.

### Orcamento de tempo por frame (meta 60fps = 16.6ms)

| Componente | Budget | Tecnica |
|-----------|--------|---------|
| Spatial hash | 1ms | Map com chave inteira |
| Fisica (forcas) | 6ms | Loop otimizado, sem sqrt quando possivel |
| Integracao + bounce | 1ms | Inline, sem funcao |
| Render particulas | 3ms | fillRect batch por cor, SEM globalAlpha |
| Render stakeholders | 0.5ms | Max 10, circulo + texto |
| Brush force | 0.5ms | So quando mouseDown |
| Metricas UI | 1ms a cada 30 ticks (amortizado: 0.03ms/frame) | innerHTML batch |
| **TOTAL** | **~12ms** | Margem 4.6ms para picos |

### Limites por quantidade de particulas

| Particulas | FPS esperado | Viavel? |
|-----------|-------------|---------|
| 500 | 60+ | Sim, fluido |
| 1000 | 55-60 | Sim, alvo principal |
| 2000 | 35-45 | Sim com otimizacoes |
| 3000 | 25-35 | Limite, pode travar em picos |
| 5000 | 15-20 | Precisa WebGL ou Worker |

### Estrategias de performance (ja incluidas no plano)

1. **fillRect em vez de arc**: 3x mais rapido, ja implementado
2. **Batch por cor**: trocar fillStyle poucas vezes (1 por cluster, nao 1 por particula)
3. **SEM globalAlpha por particula**: caro demais. Opacidade so no modo "fidelidade"
4. **Metricas amortizadas**: updateMetrics a cada 30 ticks, updateInterpretation a cada 60
5. **Spatial hash com Map**: O(1) lookup, evita O(n^2) brute force
6. **cr=3 fixo**: vizinhanca 7x7 celulas max, nao escala com raio
7. **Stakeholders como particulas normais**: mesma fisica, so render diferente
8. **Brush so aplica forca quando mouseDown**: zero custo quando inativo
9. **Timeline roda stepSim em batch**: nao renderiza todos os frames intermediarios
10. **Slider de particulas com WARNING**: acima de 2000, avisa "pode ficar lento"

### Otimizacoes avancadas (se necessario)

Se 1000 particulas travar em maquinas mais fracas:
- **OffscreenCanvas + Worker**: move fisica para thread separada
- **WebGL render**: troca Canvas 2D por WebGL para render (pontos como sprites)
- **Reduzir cr dinamicamente**: se FPS < 30, reduz vizinhanca de 3 para 2
- **LOD (Level of Detail)**: particulas distantes do zoom viram 1px sem calculo de forca

### Medida de seguranca no codigo

```javascript
// Auto-throttle: se FPS cai abaixo de 25, pula frames de render
let lastFrameTime = 0;
function mainLoop(now) {
    const dt = now - lastFrameTime;
    lastFrameTime = now;

    // Sempre calcula fisica
    stepSim();

    // So renderiza se nao estiver atrasado
    if (dt < 50) { // 50ms = 20fps minimo
        render();
        renderStakeholders();
    }

    // Metricas amortizadas
    if (tick % 30 === 0) updateMetrics();

    anim = requestAnimationFrame(mainLoop);
}
```

---

## IMPLEMENTACAO — PRIORIDADES

### Fase 1: Core (funciona, bonito, rapido)
- [ ] Layout painel esquerda + canvas direita (SandboxScience style)
- [ ] Fisica triangulo (getForce exata do SandboxScience)
- [ ] 4 clusters com proporcoes corretas
- [ ] Stakeholders como particulas grandes com nome
- [ ] Sliders de mundo com nomes sociais
- [ ] Matriz de forcas editavel visual (cores)
- [ ] 60fps com 1000 particulas
- [ ] Marca INTEIA

### Fase 2: Interacao (usuario manipula)
- [ ] Brush super-ima (atrair/repelir/mover)
- [ ] Zoom e pan
- [ ] Click tooltip em particula
- [ ] Cardapio de stakeholders (adicionar/remover)
- [ ] Presets de cenario (dropdown)
- [ ] Atalhos de teclado

### Fase 3: Inteligencia (simulacao util)
- [ ] Eventos com efeito nos atributos
- [ ] Timeline de campanha
- [ ] Metricas de captura JE em tempo real
- [ ] Teste de hipoteses pre-programado
- [ ] Snapshot e comparacao de cenarios
- [ ] Cardapio de segmentos (10 + custom)

### Fase 4: Polish
- [ ] Exportar/importar configuracao JSON
- [ ] Screenshot PNG
- [ ] Fullscreen
- [ ] Grafico de evolucao temporal
- [ ] Modo apresentacao (esconde painel, tela cheia)
- [ ] Deploy em inteia.com.br

---

## FUNCIONALIDADES DO SANDBOXSCIENCE QUE VAMOS INCORPORAR

### Do SandboxScience (confirmado viaveis em CPU):

| Feature | Como funciona la | Nossa adaptacao | Custo CPU |
|---------|-----------------|-----------------|-----------|
| **Brush atrair** | Click+drag puxa particulas | Igual — forca radial no cursor | Baixo (so mouseDown) |
| **Brush repelir** | Shift+click empurra | Igual | Baixo |
| **Adicionar particulas** | Click cria particulas no ponto | Botao por segmento + click no canvas | Zero (so no click) |
| **Remover particulas** | Brush de remocao | Click+drag com modo "apagar" | Zero |
| **Presets** | Dropdown com configuracoes salvas | 7 cenarios eleitorais | Zero |
| **Matriz visual** | Grid colorido clicavel | Grid com cores verde/vermelho + tooltip social | Zero (so no click) |
| **Sliders de fisica** | Repel, Force, Friction | Espaco pessoal, Intensidade, Inercia | Zero (so muda variavel) |
| **Pause/Resume** | Espaco | Igual | Zero |
| **Screenshot** | Botao exporta PNG | Igual | So no click |
| **Trails on/off** | Toggle | Igual | Zero |
| **Particle size** | Slider | Slider "Tamanho dos eleitores" | Zero |
| **Particle count** | Slider | Slider "Quantidade de eleitores" + WARNING >2000 | Reset |
| **Species count** | Slider | Slider "Segmentos ativos" | Reset |
| **World size** | Input x,y | Sliders largura/altura | Reset |

### Do SandboxScience que NAO vamos incorporar (custo alto, beneficio baixo):

| Feature | Por que nao |
|---------|------------|
| WebGPU render | Requer GPU, nem todo browser suporta |
| 64.000 particulas | Nosso alvo e 1000, interpretavel |
| Glow/bloom shader | Efeito visual bonito mas caro |
| 3D depth | Complexidade sem beneficio eleitoral |
| Camera cinematic mode | Overkill para analise |
| Heatmap overlay | Pode adicionar depois se necessario |

### Implementacao do brush (pseudo-codigo leve)

```javascript
// Custo: ~0.3ms quando ativo, 0ms quando inativo
canvas.addEventListener('mousemove', e => {
    mouseX = (e.clientX - rect.left) * (W / rect.width);
    mouseY = (e.clientY - rect.top) * (H / rect.height);
});

// No stepSim, DEPOIS das forcas normais:
if (mouseDown && brushMode !== 0) {
    const strength = brushMode === 1 ? brushForce : -brushForce; // atrair/repelir
    for (const p of particles) {
        const dx = p.x - mouseX, dy = p.y - mouseY;
        const d2 = dx*dx + dy*dy;
        if (d2 < brushRadius * brushRadius && d2 > 1) {
            const d = Math.sqrt(d2);
            const F = strength / d;
            p.vx += F * dx / d;
            p.vy += F * dy / d;
        }
    }
}
```

### Adicionar/remover particulas

```javascript
// Modo "adicionar": click no canvas cria particula do segmento selecionado
canvas.addEventListener('click', e => {
    if (addMode) {
        particles.push({
            x: mouseX, y: mouseY, vx: 0, vy: 0,
            cluster: selectedSegment,
            ...generateAttributes(selectedSegment)
        });
    }
    if (removeMode) {
        // Remove particula mais proxima do click
        let closest = -1, minD = 20;
        for (let i = 0; i < particles.length; i++) {
            const d = Math.hypot(particles[i].x - mouseX, particles[i].y - mouseY);
            if (d < minD) { minD = d; closest = i; }
        }
        if (closest >= 0) particles.splice(closest, 1);
    }
});
```

---

## DIFERENCIAL vs SANDBOXSCIENCE

| SandboxScience | Nosso simulador |
|----------------|-----------------|
| Tipos genericos (cores) | Segmentos eleitorais com significado |
| Forcas abstratas | Afinidades sociais explicadas |
| Sem stakeholders | Candidatos e figuras de poder como particulas especiais |
| Sem eventos | Eventos de campanha que perturbam dinamica |
| Sem metricas sociais | Captura de votos, fidelidade, volatilidade |
| Objetivo: beleza visual | Objetivo: decisao estrategica |
| Sem timeline | Campanha simulada em 8 meses |
| Sem hipoteses | Testes de what-if pre-programados |

O core fisico e o MESMO (funcao triangulo, spatial hash, viscosidade).
O que muda e a CAMADA DE INTERPRETACAO em cima.

---

*INTEIA — Igor Morais Vasconcelos — 2026-03-21*
*"A simulacao nao preve o futuro. Ela mostra qual futuro voce esta construindo."*
