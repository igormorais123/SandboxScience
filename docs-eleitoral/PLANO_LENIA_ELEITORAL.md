# PLANO DE CORRECAO E CONTINUIDADE — LENIA ELEITORAL INTEIA

**Projeto**: Lenia Eleitoral — Simulacao de 1000 Eleitores de Roraima
**Pesquisador**: Igor Morais Vasconcelos | INTEIA
**Data**: 2026-03-19
**Arquivo principal**: `C:\Users\IgorPC\projetos\projetos-claude\lenia-eleitoral\vida_artificial.html`
**Servidor local**: `http://localhost:8766/vida_artificial.html`

---

## 1. PROBLEMA CRITICO: FISICA DAS PARTICULAS (NOTA 3/10)

### Descricao do problema
A simulacao de particulas nao esta formando clusters visiveis e estaveis. Em vez disso:
- Particulas **colapsam num nucleo homogeneo** (bolas densas sem estrutura interna)
- OU **dispersam completamente** (espermatozoides voando)
- Nao conseguimos o comportamento desejado: clusters com camadas visiveis, multiplos aglomerados distintos interagindo

### Tentativas ja feitas (todas falharam)
1. **Formula `F = g/d; fx += F*dx`** (original retro) — funciona para 200 particulas mas com 1000 colapsa por acumulo
2. **Bell curve / triangulo** (inspirado sandbox-science) — sinal invertido, depois corrigido mas instavel
3. **Forcas fracas + wrap toroidal** — dispersao total
4. **Volta ao g/d com speed cap** — bolas colapsadas se movendo

### O que precisa ser feito
A instancia especialista em fisica precisa:

1. **Implementar a funcao de forca CORRETA do particle-life** com calibracao adequada:
   - Repulsao a curta distancia (previne colapso)
   - Atracao/repulsao a media distancia (cria camadas)
   - Zero a longa distancia (limita alcance)
   - Funcao LIMITADA (nunca diverge) — NAO usar `1/d`

2. **Calibrar parametros** para que com 1000 particulas e 6 tipos (clusters):
   - Clusters de mesma cor se atraiam e formem aglomerados VISIVEIS mas NAO colapsados
   - Clusters diferentes interajam (atracao ou repulsao conforme matriz)
   - Particulas formem estruturas semelhantes as imagens de referencia (ver abaixo)

3. **Parametros atuais a calibrar**:
   - `FRICTION` — amortecimento (atual: 0.5)
   - `FORCE_MULT` — multiplicador global de forcas (atual: 1.0)
   - `MAX_SPEED` — velocidade maxima (atual: 4.0)
   - `RADIUS_MATRIX[6][6]` — raios de interacao por par de clusters
   - `FORCE_MATRIX[6][6]` — forcas de atracao/repulsao por par de clusters
   - Funcao de forca em si (atualmente `F = g/d; fx += F*dx`)

4. **Tamanho do mundo**: `W = 900` com canvas usando toda a area disponivel

5. **Bordas**: bounce (particulas batem e voltam, NAO wrap)

### Imagens de referencia (objetivo visual)
- Site: https://particle-life.com
- Site: https://sandbox-science.com/particle-life
- Objetivo: clusters com camadas concentricas, multiplos aglomerados espalhados, movimento organico lento

### Codigo atual da funcao de simulacao
```javascript
function stepSim() {
    const sh = buildHash(); // spatial hash
    const { h, cols, rows } = sh;
    const cr = 3; // neighbor cell range

    for (let i = 0; i < particles.length; i++) {
        let fx = 0, fy = 0;
        const a = particles[i];
        const cx0 = a.x / CELL | 0, cy0 = a.y / CELL | 0;

        for (let dy = -cr; dy <= cr; dy++) for (let dx = -cr; dx <= cr; dx++) {
            const nx = (cx0 + dx + cols) % cols, ny = (cy0 + dy + rows) % rows;
            const arr = h.get(ny * cols + nx);
            if (!arr) continue;
            for (const j of arr) {
                if (i === j) continue;
                const b = particles[j];
                const ddx = a.x - b.x, ddy = a.y - b.y;
                const d = Math.sqrt(ddx * ddx + ddy * ddy);
                const r = RADIUS_MATRIX[a.cluster][b.cluster];
                if (d <= 0 || d >= r) continue;

                // ESTE E O PROBLEMA — F = g/d causa colapso com muitas particulas
                const g = FORCE_MATRIX[a.cluster][b.cluster] * FORCE_MULT;
                const F = g / d;
                fx += F * ddx;
                fy += F * ddy;
            }
        }

        a.vx = (a.vx + fx) * FRICTION;
        a.vy = (a.vy + fy) * FRICTION;
        const spd = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
        if (spd > MAX_SPEED) { a.vx *= MAX_SPEED / spd; a.vy *= MAX_SPEED / spd; }
        a.x += a.vx;
        a.y += a.vy;
        if (a.x <= 0 || a.x >= W) { a.vx *= -1; }
        if (a.y <= 0 || a.y >= W) { a.vy *= -1; }
        a.x = clamp(a.x, 1, W - 1);
        a.y = clamp(a.y, 1, W - 1);
    }
    tick++;
}
```

### Estrutura de particula
Cada particula tem:
```javascript
{
    x, y,           // posicao
    vx, vy,         // velocidade
    cluster,        // 0-5 (tipo/cor)
    orient,         // 0-1 orientacao politica
    engaj,          // 0-1 engajamento
    toler,          // 0-1 tolerancia
    proGar,         // 0-1 pro-garimpo
    proDem,         // 0-1 pro-demarcacao
    antiImig,       // 0-1 anti-imigracao
    social,         // 0-1 dependencia prog sociais
    desinfo,        // 0-1 exposicao desinformacao
    mun,            // nome do municipio
    munIdx,         // indice do municipio
}
```

### Spatial hash
```javascript
const CELL = 40; // tamanho da celula do hash
function buildHash() {
    const h = new Map(), cols = Math.ceil(W / CELL);
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const k = (p.y / CELL | 0) * cols + (p.x / CELL | 0);
        let arr = h.get(k); if (!arr) { arr = []; h.set(k, arr); } arr.push(i);
    }
    return { h, cols, rows: Math.ceil(W / CELL) };
}
```

---

## 2. DADOS ELEITORAIS (NOTA 7.5/10 — META: 10/10)

### Problemas restantes

#### 2.1 Programas sociais subestimados
Os valores de `recebe_programa_social_share` parecem baixos para Roraima (um dos estados mais pobres do Brasil). Pesquisa de validacao foi iniciada mas nao concluida. Precisa:
- Buscar dados reais de CadUnico/Bolsa Familia por municipio em RR
- Corrigir os shares na variavel `RR_DATA`

#### 2.2 Clusters derivados estatisticamente (K-MEANS EXECUTADO)

K-means foi rodado com k=3,4,5 nos dados dos 1000 eleitores. **k=4 e o otimo** — produz clusters claros e interpretiveis:

##### CLUSTERS REAIS IDENTIFICADOS (k=4):

| ID | Nome sugerido | n | orient | proGar | proDem | antiImig | social | desinfo | Municipios |
|---|---|---|---|---|---|---|---|---|---|
| 0 | **Direita Urbana** | 671 | 0.720 | 0.512 | 0.265 | 0.608 | 0.288 | 0.449 | Boa Vista (650), Canta (20) |
| 1 | **Interior Moderado** | 158 | 0.642 | 0.472 | 0.380 | 0.444 | 0.277 | 0.548 | Rorainopolis(55), Caracarai(39), Mucajai(35), Canta(15), S.Luiz(10) |
| 2 | **Rural Radical** | 43 | 0.862 | 0.362 | 0.272 | 0.419 | 0.286 | 0.512 | Caroebe(17), Iracema(15), S.J.Baliza(10) |
| 3 | **Indigena-Fronteira** | 128 | 0.411 | 0.159 | 0.687 | 0.521 | 0.302 | 0.534 | Alto Alegre(35), Pacaraima(30), Bonfim(20), Normandia(17), Amajari(16), Uiramuta(10) |

##### Interpretacao eleitoral dos clusters:

**Cluster 0 — Direita Urbana (67%)**: Maioria esmagadora. Concentrado em Boa Vista. Pro-Bolsonaro (72%), pro-garimpo (51%), anti-imigracao (61%), baixa demarcacao (26%). Esse e o eleitorado que decide eleicao em RR. Sao os mais anti-imigracao e os que mais apoiam garimpo.

**Cluster 1 — Interior Moderado (16%)**: Sul e centro do estado. Bolsonarista mas menos radical (64%). Mais aberto a demarcacao (38%) que a capital. Alta exposicao a desinformacao (55%). Agro mas nao garimpeiro. Sao os SWING VOTERS — podem ser puxados por campanha focada em economia/emprego.

**Cluster 2 — Rural Radical (4%)**: O mais bolsonarista do estado (86%!). Pequenos municipios do sul. Paradoxalmente MENOS pro-garimpo (36%) e MENOS anti-imigracao (42%) que Boa Vista — sao conservadores por valores, nao por pautas territoriais. Voto duro, impenetravel a campanhas de esquerda.

**Cluster 3 — Indigena-Fronteira (13%)**: UNICO cluster com maioria anti-Bolsonaro (41%). Fortemente pro-demarcacao (69%), contra garimpo (16%). Inclui a fronteira (Pacaraima) apesar de ser mais bolsonarista — sao puxados pela questao indigena. Voto organizado, igrejas e liderancas comunitarias.

##### DECISAO: MANTER 6 CLUSTERS MANUAIS (descartado k-means puro)
O k-means com k=4 gerou clusters estatisticamente validos mas eleitoralmente fracos:
- Cluster de 4% (Rural Radical) e irrelevante para analise
- Boa Vista com 67% e um bloco monolitico sem nuance interna
- Nao captura dinamicas como Periferia Digital, Fronteira Vulneravel, Centro Pragmatico

Os 6 clusters manuais capturam melhor as DINAMICAS ELEITORAIS reais de RR:
- Periferia Digital (jovens em redes) existe dentro de BV mas k-means nao separa
- Fronteira Vulneravel (imigracao) e diferente de Indigena mesmo com orient similar
- Centro Pragmatico e o swing voter que decide eleicao

**O que fazer**: refinar as REGRAS de classificacao dos 6 clusters e validar proporcoes, nao substituir por k-means.

#### 2.3 Dados de municipios a validar
Helena auditou os `bolsonaro_apoio_share` e corrigiu os maiores erros. Restam:
- `garimpo_favor_share` em Alto Alegre (corrigido de 0.11 para 0.37 mas pode precisar mais ajuste)
- `desinformacao_media` tem variancia muito baixa (2.25-2.86 numa escala 1-5) — pouca capacidade discriminatoria
- Avaliacoes de saude/educacao/seguranca nao foram auditadas contra dados reais

### Dados atuais (pos-auditoria Helena)
```javascript
const RR_DATA = [
  // nome, n, bol(TSE), gar, dem, imig, soc, desinfo, saude, educ, seg
  {nome:"Alto Alegre",n:35,bol:.59,gar:.37,dem:.80,imig:.51,soc:.37,...},
  {nome:"Amajari",n:16,bol:.60,gar:.32,dem:.69,imig:.63,soc:.38,...},
  {nome:"Boa Vista",n:650,bol:.79,gar:.51,dem:.26,imig:.61,soc:.29,...},
  {nome:"Bonfim",n:20,bol:.56,gar:.15,dem:.65,imig:.55,soc:.15,...},
  {nome:"Cantá",n:35,bol:.67,gar:.40,dem:.37,imig:.63,soc:.20,...},
  {nome:"Caracaraí",n:40,bol:.66,gar:.47,dem:.35,imig:.38,soc:.25,...},
  {nome:"Caroebe",n:17,bol:.80,gar:.41,dem:.41,imig:.53,soc:.29,...},
  {nome:"Iracema",n:15,bol:.65,gar:.37,dem:.20,imig:.33,soc:.27,...},
  {nome:"Mucajaí",n:35,bol:.73,gar:.51,dem:.40,imig:.43,soc:.14,...},
  {nome:"Normandia",n:17,bol:.56,gar:.12,dem:.65,imig:.24,soc:.35,...},
  {nome:"Pacaraima",n:30,bol:.62,gar:.32,dem:.60,imig:.70,soc:.30,...},
  {nome:"Rorainópolis",n:55,bol:.67,gar:.45,dem:.38,imig:.47,soc:.38,...},
  {nome:"São João da Baliza",n:15,bol:.67,gar:.47,dem:.13,imig:.40,soc:.33,...},
  {nome:"São Luiz",n:10,bol:.72,gar:.50,dem:.50,imig:.40,soc:.30,...},
  {nome:"Uiramutã",n:10,bol:.32,gar:.00,dem:.70,imig:.30,soc:.20,...}
];
```

### Fonte de dados brutos
`C:\Users\IgorPC\projetos\projetos-claude\lenia-eleitoral\public\lenia-eleitoral\data\rr_voter_aggregates.json`
(1000 eleitores com campos completos por municipio)

---

## 3. CANDIDATOS (8 DEPUTADOS ESTADUAIS REAIS)

### Implementado
- 8 candidatos com perfis pesquisados (ALE-RR, Folha BV, TSE)
- Seletor individual (ativar/desativar cada um)
- Migracao automatica para zona de afinidade
- Contagem de eleitores proximos

### Candidatos incluidos
| Nome | Partido | Orientacao | Destaque |
|---|---|---|---|
| Jorge Everton | UNIAO | 0.60 | Delegado, seguranca, vice-pres ALE |
| Soldado Sampaio | REPUBLICANOS | 0.70 | Presidente ALE, mais votado |
| Cel. Chagas | PRTB | 0.75 | Lider governo, anti-imigracao |
| Eder Lourinho | PSD | 0.65 | Ruralista, PRO-GARIMPO forte |
| Joilma Teodora | PODEMOS | 0.35 | Centro-esq, direitos mulher |
| Catarina Guerra | UNIAO | 0.55 | Educacao, inovacao |
| Armando Neto | PL | 0.75 | Indigena Wapichana no PL |
| Aurelina Medeiros | PODEMOS | 0.50 | Veterana 7o mandato |

### Pendente
- Perfis podem ser refinados com mais pesquisa
- Adicionar mais candidatos se necessario
- Verificar votos de 2022 de cada um vs simulacao

---

## 4. INTERFACE E UX

### Implementado
- Visual INTEIA (dourado, fonte Inter, fundo escuro)
- Header com marca INTEIA + "Inteligencia nivel militar" + nome pesquisador
- 6 modos de cor (cluster, orientacao, municipio, desinfo, social)
- Legenda dinamica que muda por modo de cor
- Guia de leitura visual com 12 topicos
- Interpretacao automatica (polarizacao, tolerancia, engajamento, velocidade, mistura)
- Painel de municipios com metricas tempo real
- Painel de fisica com sliders
- Matriz de interacao editavel 6x6
- 5 botoes de eventos
- Tooltip no hover de particulas
- Log de eventos

### Pendente
- Zoom/pan no canvas
- Presets (salvar/carregar configuracoes boas)
- Screenshot/export
- Deploy em inteia.com.br

---

## 5. PLANO DE ACAO PRIORIZADO

### Fase 1: FISICA (Bloqueador critico)
**Responsavel**: Instancia especialista em fisica de particulas
**Entrada**: Este documento + codigo em vida_artificial.html
**Saida**: Funcao stepSim() calibrada que forme clusters visiveis sem colapso

Tarefas:
- [ ] Estudar implementacoes de referencia (particle-life.com, sandbox-science.com)
- [ ] Implementar funcao de forca limitada (triangulo ou smooth step)
- [ ] Calibrar FRICTION, FORCE_MULT, MAX_SPEED, CORE_R
- [ ] Testar com 1000 particulas e 6 tipos
- [ ] Validar que clusters se formam, nao colapsam, nao dispersam
- [ ] Entregar funcao stepSim() funcional

### Fase 2: CLUSTERS ESTATISTICOS
**Responsavel**: Helena / Analise de dados
**Entrada**: rr_voter_aggregates.json (1000 eleitores)
**Saida**: Definicao de 4-5 clusters com caracteristicas-chave

Tarefas:
- [ ] Rodar k-means (k=3,4,5,6) nas variaveis: orient, proGar, proDem, antiImig, social, desinfo
- [ ] Escolher k otimo (silhouette score)
- [ ] Descrever cada cluster (centroide, tamanho, municipios dominantes)
- [ ] Nomear clusters com base no perfil real
- [ ] Gerar nova FORCE_MATRIX baseada em distancia entre centroides
- [ ] Gerar nova RADIUS_MATRIX
- [ ] Atualizar funcao classifyVoter()
- [ ] Atualizar cores e legendas

### Fase 3: DADOS PARA 10/10
**Responsavel**: Helena / Pesquisa
**Entrada**: Dados atuais + fontes publicas

Tarefas:
- [ ] Validar recebe_programa_social_share contra CadUnico real
- [ ] Validar avaliacoes saude/educacao/seguranca contra IBGE/DataSUS
- [ ] Reduzir variancia artificial em desinformacao_media
- [ ] Documentar TODAS as fontes de dados usadas
- [ ] Criar tabela de confianca por variavel por municipio

### Fase 4: ENGENHARIA SOCIAL E DINAMICA ELEITORAL
**Responsavel**: ONIR / Helena
**Objetivo**: Tornar a simulacao uma ferramenta de analise eleitoral real

Tarefas:
- [ ] Mapear VULNERABILIDADES de cada cluster a cada tipo de evento:
  - Direita Urbana: sensivel a imigracao, garimpo, seguranca
  - Interior Moderado: sensivel a economia, emprego, programas sociais (SWING)
  - Rural Radical: sensivel a valores conservadores, religiao, costumes
  - Indigena-Fronteira: sensivel a demarcacao, saude, educacao
- [ ] Modelar CASCATA DE INFLUENCIA: como um evento em um cluster se propaga para outros
- [ ] Adicionar FONTES DE INFORMACAO por cluster (WhatsApp, TikTok, TV, radio, boca-a-boca)
  - Cada fonte tem velocidade e alcance diferentes
  - Fake news se propaga mais rapido em clusters com alta desinfo
- [ ] Modelar LIDERANCAS: eleitores-chave que influenciam seus vizinhos (pastores, caciques, sindicalistas)
- [ ] Adicionar CENARIOS ELEITORAIS pre-configurados:
  - "Campanha de direita focada em seguranca" — como afeta cada cluster?
  - "Programa social do governo" — quem muda de voto?
  - "Crise do garimpo" — rachaduras na base?
  - "Alianca indigena com centro" — viavel?
- [ ] Modelar CALENDARIO ELEITORAL: eventos em sequencia simulando uma campanha
- [ ] Calcular PROJECAO DE VOTOS: dado o estado atual dos clusters, quantos votos cada candidato teria
- [ ] Identificar PONTOS DE VIRADA: qual evento minimo mudaria o resultado da eleicao?

### Fase 5: REFINAMENTOS
- [ ] Adicionar zoom/pan no canvas
- [ ] Sistema de presets (salvar/carregar configuracoes)
- [ ] Tooltip no hover de candidatos
- [ ] Screenshot/export PNG
- [ ] Performance: WebGL ou OffscreenCanvas se necessario
- [ ] Deploy em inteia.com.br/lenia-eleitoral

---

## 6. ARQUIVOS DO PROJETO

| Arquivo | Descricao |
|---|---|
| `vida_artificial.html` | Sistema principal (simulacao + UI) |
| `public/lenia-eleitoral/data/rr_voter_aggregates.json` | Base de 1000 eleitores |
| `public/lenia-eleitoral/data/rr_campaign_profiles.json` | Perfis de campanha por municipio |
| `public/lenia-eleitoral/js/network-engine.js` | Engine do sistema territorial (referencia) |
| `PLANO_LENIA_ELEITORAL.md` | Este documento |

---

## 7. CONTEXTO TECNICO

- **Linguagem**: HTML/CSS/JavaScript vanilla (arquivo unico)
- **Renderizacao**: Canvas 2D
- **Otimizacao**: Spatial hashing para O(n) em vez de O(n^2)
- **Particulas**: 1000 (30-35 por municipio pequeno, 650 Boa Vista)
- **Mundo**: 900x900 pixels de simulacao
- **Browser**: Chrome (testado com Claude in Chrome)
- **PC**: Ryzen 9 7900, 64GB RAM, RTX 3060 Ti

---

---

## 8. RESULTADOS DA ANALISE K-MEANS (EXECUTADA 2026-03-19)

### Codigo de reproducao
```javascript
// Rodar no Node.js a partir do diretorio do projeto:
// node -e "<codigo abaixo>"
const data = require('./public/lenia-eleitoral/data/rr_voter_aggregates.json');
// [ver codigo completo no historico da sessao ONIR 2026-03-19]
```

### Variaveis usadas na clusterizacao
| Variavel | Descricao | Range |
|---|---|---|
| orient | Apoio Bolsonaro (TSE 2022 auditado) | 0-1 |
| proGar | Favoravel ao garimpo | 0-1 |
| proDem | Favoravel a demarcacao indigena | 0-1 |
| antiImig | Visao negativa da imigracao | 0-1 |
| social | Recebe programa social | 0-1 |
| desinfo | Exposicao a desinformacao (media/5) | 0-1 |

### Silhouette scores (aproximados)
- k=3: 0.38 (clusters muito grandes, perde nuances)
- k=4: **0.42** (melhor — grupos distintos e interpretiveis)
- k=5: 0.39 (split desnecessario de Boa Vista em 2)

### FORCE_MATRIX sugerida para 4 clusters
Baseada na distancia euclidiana entre centroides:
```
// Negativo = atracao, Positivo = repulsao
//              DirUrb  IntMod  RurRad  IndFro
// DirUrb       -0.30   -0.10   -0.15    0.25
// IntMod       -0.10   -0.25   -0.08   -0.05
// RurRad       -0.15   -0.08   -0.35    0.30
// IndFro        0.25   -0.05    0.30   -0.30
```
Logica:
- Direita Urbana se auto-atrai moderadamente, atrai Interior Moderado (aliados naturais), REPELE Indigena-Fronteira (garimpo vs demarcacao)
- Interior Moderado e o mais neutro — atrai levemente todos (swing)
- Rural Radical se auto-atrai fortemente (bolha), repele Indigena-Fronteira
- Indigena-Fronteira se auto-atrai fortemente (voto organizado), repele Direita e Rural

---

## 9. INSTRUCOES PARA A INSTANCIA DE FISICA

Ao integrar os sistemas (vida_artificial_lenia.html + vida_artificial.html):

1. A funcao `stepSim()` deve vir do Particle Life Lab (ja testada e calibrada)
2. Os 4 tipos de particula correspondem aos 4 clusters eleitorais
3. A FORCE_MATRIX 4x4 e a da secao 8
4. As cores devem ser: azul (Direita Urbana), amarelo (Interior Moderado), azul escuro (Rural Radical), vermelho (Indigena-Fronteira)
5. Manter TODOS os paineis laterais (candidatos, guia, interpretacao, municipios, eventos)
6. Manter a marca INTEIA e nome do pesquisador

---

*INTEIA — Inteligencia Artificial Estrategica*
*Igor Morais Vasconcelos — Pesquisador Responsavel*
*Documento gerado em 2026-03-19, atualizado com resultados k-means*
