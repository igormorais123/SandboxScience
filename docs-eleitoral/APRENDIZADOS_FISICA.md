# Aprendizados — Fisica de Particle Life

> Documento de referencia para retomar o conhecimento adquirido.
> Atualizado: 2026-03-19

---

## 1. MODELOS DE FORCA TESTADOS

### Modelo Hunar (g/d)
- `F = g / distancia`
- **Problema**: diverge em d=0, particulas colapsam em pontos
- **Vantagem**: simples, compativel com presets do programa C++
- **Resultado**: clusters pontuais, sem estrutura interna

### Modelo Sandbox-Science (triangulo linear)
- Zona 1 (0 a minR): repulsao universal linear
- Zona 2 (minR a maxR): forca triangular que pica no valor `rule` no ponto medio
- **Problema**: incompativel com presets Hunar (escala diferente)
- **Vantagem**: estavel, nao diverge, cria equilibrio natural
- **Resultado**: bom com presets proprios, ruim com presets Hunar

### Modelo Hibrido (ATUAL — melhor resultado)
- Distancia < 10: repulsao linear universal `F = (d/10 - 1) * 0.5`
- Distancia >= 10: Hunar `F = g / (d)` com direcao normalizada
- **Chave**: a repulsao curta cria distancia de equilibrio que impede colapso
- **Resultado**: celulas com aneis, membranas, nucleos — melhor de todos

---

## 2. PARAMETROS E SEUS EFEITOS

### Viscosidade (0.3 a 0.95)
- **0.3-0.4**: particulas retêm 60-70% do momentum. Movimento fluido, clusters instáveis, mais "vivos" mas caóticos
- **0.5-0.6**: equilibrio entre movimento e estabilidade
- **0.7 (Hunar default)**: particulas retêm 30%. Bom para formação celular estável
- **0.85-0.95**: particulas quase param instantaneamente. Formações MUITO estáveis e definidas. Melhor para anéis e membranas. Pouco movimento após estabilização

**Conclusão**: viscosidade ALTA (0.8-0.9) = melhores formações celulares. BAIXA (0.3-0.5) = ecosistemas dinâmicos.

### Forca x (multiplicador, 0.5 a 3.0)
- **0.5**: forcas fracas, particulas dispersas, poucos clusters
- **1.0 (default)**: equilibrio
- **1.5-2.0**: clusters maiores e mais densos, alguns alongados (organismo-like)
- **2.5+**: risco de instabilidade, particulas oscilam

**Conclusão**: 1.0-1.5 = melhor faixa. Acima de 2.0 pode causar tremor.

### Raio x (escala dos raios de interação, 0.2 a 1.2)
- **0.25**: raios muito pequenos, micro-clusters isolados, pouca interação entre clusters
- **0.40**: clusters medianos, alguma conexão
- **0.50 (default)**: bom equilibrio local/global
- **0.80**: **MELHOR para celulas** — anéis e membranas claramente visíveis, clusters grandes o suficiente para ter estrutura interna
- **1.0+**: raios muito grandes, tudo interage com tudo, formação de mingau uniforme

**Conclusão**: 0.6-0.8 = sweet spot para formação celular. 0.3-0.5 = ecosistemas com muitos clusters pequenos.

### Borda/Wall Repel (0 a 100)
- **0**: sem borda, particulas refletem nas paredes
- **20-40**: repulsao suave nas bordas, particulas ficam longe das paredes
- **60+**: forca repulsao forte, concentra tudo no centro

**Conclusão**: 40 = bom default. 0 = melhor para ver wrapping.

---

## 3. CATEGORIAS DE PRESETS E MELHORES CONFIGURAÇÕES

### Para CELULAS (anéis, membranas):
- Presets: eco1, eco4 (Predador-Presa)
- Viscosidade: 0.85-0.90
- Raio x: 0.70-0.80
- Forca x: 1.0

### Para ECOSSISTEMAS (dinâmica, perseguição):
- Presets: eco1-eco4, esp4
- Viscosidade: 0.50-0.65
- Raio x: 0.40-0.60
- Forca x: 1.0-1.5

### Para COLONIAS (grandes aglomerados):
- Presets: col1-col6, esp1, esp3
- Viscosidade: 0.70
- Raio x: 0.50
- Forca x: 1.0
- Mais particulas (COUNT_MULT 3+)

### Para ORGANISMOS MOVEIS:
- Presets: org1-org4
- Viscosidade: 0.40-0.55 (precisa de mais momentum)
- Raio x: 0.50-0.70
- Forca x: 1.0-1.5

---

## 4. PROBLEMAS RESOLVIDOS

### Colapso pontual
- **Causa**: F = g/d diverge em d=0
- **Solução**: repulsão linear em d < 10 (modelo híbrido)

### Tremor/oscillação
- **Causa**: viscosidade muito baixa OU força muito alta
- **Solução**: viscosidade >= 0.7, forca <= 1.5

### Formações muito dispersas
- **Causa**: raio muito pequeno ou poucas partículas
- **Solução**: aumentar Raio x (0.6-0.8) e/ou COUNT_MULT

### Mingau uniforme (sem estrutura)
- **Causa**: raio muito grande, todas partículas interagem com todas
- **Solução**: reduzir Raio x (0.3-0.5), usar RADIUS_SCALE e MAX_RADIUS cap

### Bolas perfeitas (sem organicidade)
- **Causa**: core repulsion muito forte (modelo sandbox com valor alto)
- **Solução**: remover ou reduzir; modelo híbrido com repulsão suave (0.5 max)

---

## 5. INSIGHTS DE DESIGN

### Sobre o modelo de força
- A chave para formação de vida artificial é ter uma **distância de equilíbrio**: repulsão curta + atração longa
- Sem repulsão curta: colapso. Sem atração longa: dispersão
- O modelo sandbox (triângulo) é mais estável mas menos compatível com presets existentes
- O modelo híbrido (repulsão + Hunar g/d) é o melhor compromisso

### Sobre escala
- O programa C++ original usa ~1000 partículas por tipo em canvas ~1200px
- Meu sistema: ~600 por tipo em 800px (densidade ~60% do original)
- Para igualar sandbox-science (64000 partículas) precisaria de WebGL
- Spatial hashing permite ~5000 partículas a 60+ FPS em JS puro

### Sobre presets
- Os valores dos presets C++ foram calibrados para o modelo g/d (Hunar)
- Dividir por 100 converte para escala [-1, 1]
- Raios precisam de RADIUS_SCALE ~0.5 para canvas 800px (C++ usava ~1200-1600px)
- Presets com forças MUITO assimétricas (eco1, eco4) geram as melhores formações

### Sobre a relação força-raio
- Forças fracas + raios grandes = movimento suave, estruturas grandes
- Forças fortes + raios pequenos = clusters densos, pontuais
- Forças fortes + raios grandes = instabilidade
- Forças fracas + raios pequenos = dispersão, sem estrutura
- **Sweet spot**: forças moderadas (g/100 ≈ 0.3-0.7) + raios médios (50-120px efetivos)

---

## 6. CONFIGURAÇÃO ÓTIMA ENCONTRADA

```
Viscosidade: 0.85
Forca x: 1.0
Raio x: 0.80
Borda: 40
COUNT_MULT: 2.0
Preset: eco1 (Ecossistema Assimetrico) ou eco4 (Predador-Presa)
Modelo: Hibrido (repulsao d<10 + Hunar g/d)
```

Produz: anéis celulares, membranas, núcleos diferenciados, estrutura interna visível.

---

## 7. RESULTADOS POR PRESET (config ótima vis=0.85 rad=0.80 forca=1.0)

| Preset | Resultado | Qualidade |
|---|---|---|
| Ecossistema Assimetrico (eco1) | Anéis, membranas, células com núcleo | ★★★★★ |
| Predador-Presa (eco4) | Anéis celulares, blue disperso como presa | ★★★★★ |
| Celula Membrana Rosa (cel2) | Dezenas de micro-celulas multicoloridas | ★★★★ |
| Blue Dominante (esp3) | Mini-clusters multi-coloridos | ★★★★ |
| Colonia Bicolor (col2) | Clusters grandes com estrutura interna complexa | ★★★★ |
| Cluster Denso (clu1) | White excluido, clusters R-B-G | ★★★★ |
| Organismo Movel (org1) | Clusters com algum movimento | ★★★ |
| Colonia Massiva (col1) | Campo denso, muitos mini-clusters | ★★★ |
| Celula Limpa (cel1) | Clusters estáveis mas pequenos | ★★★ |

### Ranking de presets para formação celular:
1. eco1 (Ecossistema Assimetrico) — melhor anéis
2. eco4 (Predador-Presa) — melhor separação presa/predador
3. col2 (Colonia Bicolor) — melhor estrutura complexa
4. cel2 (Celula Membrana Rosa) — mais diversidade

---

## 8. PRÓXIMOS PASSOS
- [ ] Adicionar gerador de regras aleatórias (estilo sandbox-science)
- [ ] Implementar Web Workers para mais partículas
- [ ] Adicionar 7 cores (como sandbox-science) em vez de 4
- [ ] Adicionar glow seletivo (apenas partículas densas)
- [ ] Implementar camada de interpretação social
- [ ] Adicionar zoom e pan com mouse

---

## 9. INTEGRAÇÃO COM SISTEMA ELEITORAL (vida_artificial.html)

### Problema original
- FORCE_MATRIX já em [-0.35, 0.30] (NÃO em escala C++ [-100, +100])
- Com 1000 partículas e FORCE_MULT=1.0, forças acumuladas eram enormes → colapso
- Viscosidade tipo Hunar (v+f)*0.5 não amortecia o suficiente

### Solução aplicada
- **FORCE_MULT = 0.15** (redução 85% para compensar muitos vizinhos)
- **CORE_R = 25** (zona de repulsão maior para 1000 partículas vs 300 no lab)
- **CORE_STRENGTH = 1.0** (repulsão mais forte)
- **VISCOSITY = 0.85** (mesmo do lab)
- Modelo híbrido: repulsão d<25 + Hunar g/d
- Acumulação em 2 passes (forces → velocity update)

### Resultado
- 1000 partículas formam clusters por afinidade política
- Direita Urbana (647) domina centro — correto para Boa Vista
- Rural Conservador forma sub-clusters separados — interior
- Minorias (Esquerda Indígena) ficam isoladas
- Sistema estabiliza em ~20 ticks
- Performance: 60+ FPS com spatial hash

### Lição chave
Quando FORCE_MATRIX usa valores pequenos (-0.35 a +0.30) com muitas partículas (1000+):
- FORCE_MULT precisa ser LOW (0.1-0.2) para compensar acumulação de N vizinhos
- CORE_R precisa ser MAIOR (20-30) para manter espaçamento com alta densidade
- A regra: FORCE_MULT ≈ 1 / sqrt(avg_neighbors)
