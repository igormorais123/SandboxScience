# ESTRUTURA DAS PARTICULAS — PROJETO DEFINITIVO
## INTEIA | Lenia Eleitoral Roraima
### Cada particula = 1 eleitor de Roraima

---

## ANATOMIA DE UMA PARTICULA

Cada ponto na tela nao e apenas uma bolinha colorida. E um eleitor completo com 12 atributos que afetam VISUAL e COMPORTAMENTO.

### ATRIBUTOS E COMO APARECEM NA TELA

| Atributo | Range | Visual | Significado eleitoral |
|----------|-------|--------|----------------------|
| **cluster** | 0-9 | COR da particula | Segmento eleitoral ao qual pertence |
| **orientacao** | 0-1 | Disponivel como modo de cor (vermelho→azul) | 0=esquerda, 1=direita. Determina FORCA de atracao/repulsao com outros |
| **engajamento** | 0-1 | TAMANHO do ponto (maior=mais engajado) | Quem acompanha politica, compartilha, vai a evento. Multiplicador de influencia |
| **fidelidade** | 0-1 | OPACIDADE (mais opaco=mais fiel) | Resistencia a compra de voto e a trocar de candidato |
| **vulnerabilidade** | 0-1 | Disponivel como modo de cor | Suscetibilidade a compra de voto, manipulacao, coercao |
| **desinformacao** | 0-1 | Disponivel como modo de cor | Exposicao a fake news. Alta = aceita narrativas sem checar |
| **proGarimpo** | 0-1 | Afeta forca com cluster Indigena | Posicao sobre garimpo (divide estado) |
| **proDemarcacao** | 0-1 | Afeta forca com cluster C.Media | Posicao sobre terras indigenas |
| **antiImigracao** | 0-1 | Afeta forca com cluster Fronteira | Hostilidade a venezuelanos |
| **dependenciaEstado** | 0-1 | Disponivel como modo de cor | Quanto depende do setor publico (emprego, programa, cesta) |
| **tolerancia** | 0-1 | BORDA da particula (verde=tolerante, vermelha=intolerante) | Capacidade de conviver com quem pensa diferente |
| **municipio** | string | Disponivel como modo de cor | Origem geografica |

### COMO CADA ATRIBUTO AFETA A NARRATIVA

**TAMANHO = ENGAJAMENTO**: Um ponto grande e um eleitor que VAI ao comicio, COMPARTILHA no WhatsApp, CONVENCE vizinhos. Um ponto minusculo e o eleitor fantasma — vota por obrigacao, ninguem sabe em quem. Na vida real: o ponto grande vale 5 pontos pequenos em influencia.

**OPACIDADE = FIDELIDADE**: Um ponto solido e voto garantido — mesmo que ofereçam R$1.000, vota no candidato dele. Um ponto translucido e voto a venda — vai para quem pagar mais. Na simulacao: particulas translucidas mudam de posicao facilmente quando um candidato se aproxima; solidas ficam ancoradas.

**COR = SEGMENTO**: A cor diz a qual tribo eleitoral pertence. Mas o que importa na vida real nao e a cor — e a DISTANCIA entre as cores. Cores proximas (ex: Funcionalismo e Fronteira) sao aliados naturais. Cores distantes (ex: Indigena e Classe Media) sao adversarios.

**BORDA = TOLERANCIA**: Verde = aceita conviver com quem pensa diferente. Vermelha = rejeita. Na simulacao: particulas com borda verde se misturam facilmente; com borda vermelha formam bolhas impenetraveis. Na vida real: tolerancia baixa = polarizacao alta = risco de violencia.

---

## OS 10 SEGMENTOS — PERFIL COMPLETO DE CADA PARTICULA

### Segmento 0: FUNCIONALISMO ESTATAL
**Particulas**: 108 de 1000 | **Cor**: Azul petroleo (#1a6b7a)

| Atributo | Valor medio | Variacao |
|----------|-------------|----------|
| orientacao | 0.60 | ±0.15 (segue o governo) |
| engajamento | 0.65 | ±0.15 (alto — acompanham politica por emprego) |
| fidelidade | 0.55 | ±0.20 (media — fiel enquanto o chefe vencer) |
| vulnerabilidade | 0.30 | ±0.15 (baixa — tem salario fixo) |
| desinformacao | 0.35 | ±0.15 (escolaridade media-alta) |
| proGarimpo | 0.35 | ±0.20 (dividido) |
| proDemarcacao | 0.30 | ±0.15 |
| antiImigracao | 0.50 | ±0.20 (dividido) |
| dependenciaEstado | 0.85 | ±0.10 (ALTISSIMA) |
| tolerancia | 0.50 | ±0.15 |

**Narrativa**: O servidor publico em RR nao e classe media confortavel — e refem. Com 44% do PIB estatal, perder emprego publico e catastrofe. Vota em quem garante recomposicao e nao mexe no plano de carreira. Quando 12 sindicatos pedem 16% de reajuste, cada candidato que apoiar ou bloquear essa pauta ganha ou perde este segmento inteiro.

**Forca dominante**: DEPENDENCIA — atraido por quem controla a maquina estatal.

---

### Segmento 1: COMISSIONADOS DA MAQUINA
**Particulas**: 38 de 1000 | **Cor**: Cinza escuro (#3a3a4a)

| Atributo | Valor medio | Variacao |
|----------|-------------|----------|
| orientacao | 0.55 | ±0.25 (do chefe, multi-partido) |
| engajamento | 0.80 | ±0.10 (MUITO alto — trabalham na campanha) |
| fidelidade | 0.95 | ±0.05 (MAXIMA — perdem emprego se trair) |
| vulnerabilidade | 0.70 | ±0.15 (alta — dependem 100% do cargo) |
| desinformacao | 0.40 | ±0.20 |
| dependenciaEstado | 0.95 | ±0.05 (MAXIMA) |
| tolerancia | 0.35 | ±0.15 (baixa — sao soldados do chefe) |

**Narrativa**: Os 4.334 comissionados da ALE sao o exercito invisivel. Cada um e ponto grande (engajamento alto) e 100% opaco (fidelidade maxima). Nao mudam. Nao negociam. Sao extensao do deputado. Na simulacao, esses pontos NAO se movem — ficam colados no candidato que os nomeou. Sao os primeiros a aparecer e os ultimos a sair.

**Forca dominante**: SOBREVIVENCIA — colado no chefe por necessidade absoluta.

---

### Segmento 2: EVANGELICOS ENGAJADOS
**Particulas**: 141 de 1000 | **Cor**: Amarelo (#d4a030)

| Atributo | Valor medio | Variacao |
|----------|-------------|----------|
| orientacao | 0.72 | ±0.12 (direita por valores) |
| engajamento | 0.70 | ±0.15 (alto — comunidade ativa) |
| fidelidade | 0.65 | ±0.20 (media-alta — fiel ao pastor, nao ao partido) |
| vulnerabilidade | 0.35 | ±0.20 (variada — tem ricos e pobres) |
| desinformacao | 0.50 | ±0.15 (WhatsApp de igreja = vetor de fake news) |
| proGarimpo | 0.45 | ±0.20 |
| proDemarcacao | 0.20 | ±0.15 (missao evangelica vs autonomia indigena) |
| antiImigracao | 0.55 | ±0.20 |
| dependenciaEstado | 0.40 | ±0.25 |
| tolerancia | 0.35 | ±0.15 (baixa em pautas morais) |

**Narrativa**: O evangelico de RR nao e monolitico — tem o pastor de periferia que depende de cesta e o empresario da Assembleia de Deus que doa dizimo. O que os une e a COMUNIDADE. O pastor indica, a comunidade segue. Fidelidade nao e ao candidato — e ao pastor. Se o pastor muda de candidato, o rebanho muda junto. Na simulacao: estas particulas se movem EM BLOCO quando o lider (pastor) e ativado.

**Forca dominante**: COMUNIDADE DE FE — atraido por quem o pastor indica.

---

### Segmento 3: JOVENS URBANOS (16-34)
**Particulas**: 251 de 1000 | **Cor**: Roxo (#8855cc)

| Atributo | Valor medio | Variacao |
|----------|-------------|----------|
| orientacao | 0.55 | ±0.25 (MUITO variavel — split) |
| engajamento | 0.35 | ±0.25 (BAIXO em media, mas pode explodir) |
| fidelidade | 0.20 | ±0.15 (MUITO BAIXA — sem vinculo) |
| vulnerabilidade | 0.55 | ±0.25 (variada) |
| desinformacao | 0.60 | ±0.15 (ALTA — TikTok como fonte) |
| proGarimpo | 0.40 | ±0.20 (nao e pauta central) |
| proDemarcacao | 0.30 | ±0.20 |
| antiImigracao | 0.50 | ±0.25 (vivem com venezuelanos) |
| dependenciaEstado | 0.30 | ±0.25 (muitos informais) |
| tolerancia | 0.55 | ±0.20 (mais tolerantes que media) |

**Narrativa**: O MAIOR segmento (25%) e o mais VOLATIL. Pontos PEQUENOS (baixo engajamento) e TRANSLUCIDOS (baixa fidelidade). Na simulacao, sao uma NUVEM dispersa que se move rapido e muda de direcao com qualquer evento. Sao a "materia escura" da eleicao — ninguem sabe onde vao parar. Mas se um candidato ACERTAR a comunicacao (meme, TikTok, pauta que toca: emprego, habilitacao, moradia), essa nuvem inteira migra de uma vez. E a UNICA forma de ganhar votos em massa sem pagar R$800 cada.

**Forca dominante**: IMPULSO DIGITAL — atraido por viral, meme, indignacao momentanea.

---

### Segmento 4: MERCADO DO VOTO
**Particulas**: 128 de 1000 | **Cor**: Laranja (#cc7020)

| Atributo | Valor medio | Variacao |
|----------|-------------|----------|
| orientacao | 0.50 | ±0.25 (FLUTUANTE — vai com dinheiro) |
| engajamento | 0.60 | ±0.20 (medio-alto — participam ativamente do mercado) |
| fidelidade | 0.10 | ±0.10 (MINIMA — o core do problema) |
| vulnerabilidade | 0.85 | ±0.10 (MAXIMA) |
| desinformacao | 0.55 | ±0.20 |
| dependenciaEstado | 0.60 | ±0.25 (muitos em programas sociais) |
| tolerancia | 0.40 | ±0.15 |

**Narrativa**: Pontos de TAMANHO medio (engajados no mercado), quase TRANSPARENTES (fidelidade minima). Na simulacao, essas particulas sao as que mais se MOVEM — atraidas por qualquer candidato que ative o evento "compra de voto". Sao o LEILAO da eleicao. O comportamento visual e: quando um candidato aparece perto, essas particulas correm na direcao dele; quando outro aparece do outro lado, metade muda de direcao. Visualmente caotico — reflete a realidade.

**Subtipos**:
- Profissional (30%): pega de todos, vota no ultimo
- Necessitado (25%): venderia mas prefere nao precisar
- Lider de celula (15%): controla 10-30 votos alheios
- Descrente (20%): vende por cinismo
- Coagido (10%): nao tem escolha

**Forca dominante**: DINHEIRO — atraido pelo recurso, nao pela ideia.

---

### Segmento 5: INDIGENA ORGANIZADO
**Particulas**: 90 de 1000 | **Cor**: Vermelho (#cc2020)

| Atributo | Valor medio | Variacao |
|----------|-------------|----------|
| orientacao | 0.35 | ±0.15 (anti-Bolsonaro no geral) |
| engajamento | 0.70 | ±0.15 (alto — CIR organiza) |
| fidelidade | 0.75 | ±0.15 (ALTA — fiel a comunidade) |
| vulnerabilidade | 0.40 | ±0.20 (coletivo protege) |
| desinformacao | 0.30 | ±0.15 (BAIXA — radio + boca-a-boca) |
| proGarimpo | 0.10 | ±0.10 (CONTRA) |
| proDemarcacao | 0.80 | ±0.10 (FORTISSIMO) |
| antiImigracao | 0.35 | ±0.20 |
| dependenciaEstado | 0.45 | ±0.20 |
| tolerancia | 0.55 | ±0.15 |

**Narrativa**: Pontos GRANDES (alto engajamento) e BEM OPACOS (alta fidelidade). Na simulacao, formam o cluster mais COESO — uma bola vermelha densa que nao se dispersa. Quando outros clusters empurram (garimpo, imigracao), o cluster indigena se move junto mas NAO se fragmenta. 50 anos de CIR = cola social que nenhum dinheiro dissolve. A negociacao e COLETIVA — o tuxaua negocia pela comunidade, nao por individuo.

**Forca dominante**: ORGANIZACAO COLETIVA — se move em bloco, decide em bloco.

---

### Segmento 6: CLASSE MEDIA CONSERVADORA
**Particulas**: 90 de 1000 | **Cor**: Azul (#2266cc)

| Atributo | Valor medio | Variacao |
|----------|-------------|----------|
| orientacao | 0.82 | ±0.10 (MUITO direita) |
| engajamento | 0.75 | ±0.15 (alto — vao a manifestacao) |
| fidelidade | 0.70 | ±0.15 (alta — voto por identidade) |
| vulnerabilidade | 0.10 | ±0.10 (MINIMA — nao vendem voto) |
| desinformacao | 0.55 | ±0.15 (WhatsApp familiar = fake news por convicção) |
| proGarimpo | 0.60 | ±0.15 (pro — "gera emprego") |
| proDemarcacao | 0.15 | ±0.10 (contra) |
| antiImigracao | 0.65 | ±0.15 (alto) |
| dependenciaEstado | 0.25 | ±0.20 (autonomos, empresarios) |
| tolerancia | 0.30 | ±0.15 (BAIXA — anti-PT visceral) |

**Narrativa**: Pontos GRANDES (engajados) e OPACOS (fieis) com BORDA VERMELHA (baixa tolerancia). Formam cluster denso e IMUTAVEL. Na simulacao, e uma bola azul que nao se move — e os outros que orbitam ao redor. Sao o "nucleo gravitacional" da direita em RR. Nao precisam ser conquistados — precisam ser MANTIDOS. O risco e perderem para candidato mais radical (PL puro).

**Forca dominante**: IDENTIDADE — nao e racional, e tribal.

---

### Segmento 7: INTERIOR AGROPECUARIO
**Particulas**: 77 de 1000 | **Cor**: Verde (#33aa55)

| Atributo | Valor medio | Variacao |
|----------|-------------|----------|
| orientacao | 0.70 | ±0.12 (conservador por cultura sul/sudeste) |
| engajamento | 0.55 | ±0.20 (medio — isolados geograficamente) |
| fidelidade | 0.50 | ±0.20 (media — votam em quem "traz obra") |
| vulnerabilidade | 0.35 | ±0.20 (tem terra, nao e miseravel) |
| desinformacao | 0.50 | ±0.15 (radio + WhatsApp) |
| proGarimpo | 0.55 | ±0.20 (dividido — agro vs garimpo nem sempre combinam) |
| proDemarcacao | 0.25 | ±0.15 (contra — terra e produtiva) |
| antiImigracao | 0.40 | ±0.15 (menos impactado que BV) |
| dependenciaEstado | 0.45 | ±0.20 (credito rural, estradas) |
| tolerancia | 0.45 | ±0.15 |

**Narrativa**: Pontos MEDIOS dispersos em area separada. Na simulacao, ficam LONGE do centro (BV) — em cima ou embaixo. Sao atraidos por quem promete ESTRADA, ENERGIA, CREDITO. O Linhao de Tucurui (2025) mudou a vida deles. Eder Lourinho domina aqui — Jorge Everton precisa de pauta especifica (seguranca rural, roubo de gado) para entrar.

**Forca dominante**: INFRAESTRUTURA — atraido por quem resolve problema concreto do campo.

---

### Segmento 8: MULHERES PERIFERIA
**Particulas**: 52 de 1000 | **Cor**: Rosa (#cc4488)

| Atributo | Valor medio | Variacao |
|----------|-------------|----------|
| orientacao | 0.50 | ±0.20 (centro — pragmaticas) |
| engajamento | 0.45 | ±0.20 (medio — sobrecarregadas, pouco tempo) |
| fidelidade | 0.35 | ±0.20 (baixa-media — aberta a quem resolver) |
| vulnerabilidade | 0.75 | ±0.15 (ALTA — mae solo, violencia, pobreza) |
| desinformacao | 0.50 | ±0.20 |
| proGarimpo | 0.30 | ±0.20 (nao e pauta central) |
| proDemarcacao | 0.30 | ±0.20 |
| antiImigracao | 0.55 | ±0.20 (competem com venezuelanas por emprego) |
| dependenciaEstado | 0.70 | ±0.15 (Bolsa Familia, creche, saude) |
| tolerancia | 0.50 | ±0.15 |

**Narrativa**: RR lidera feminicidios (10,4/100mil). Mortalidade materna 3x a media. 28% sofreram violencia domestica. Esses pontos ROSA sao MEDIOS em tamanho mas com alta vulnerabilidade. Na simulacao, sao atraidas por quem oferece PROTECAO — nao dinheiro, nao ideologia. "O delegado que protege mulher" e a frase que move esse segmento. Joilma Teodora ja captura parte com "Elas na Politica". Jorge Everton pode disputar com pauta de SEGURANCA FEMININA.

**Forca dominante**: PROTECAO — atraida por quem faz sentir segura.

---

### Segmento 9: FRONTEIRA/SEGURANCA
**Particulas**: 25 de 1000 | **Cor**: Verde escuro (#1a5530)

| Atributo | Valor medio | Variacao |
|----------|-------------|----------|
| orientacao | 0.78 | ±0.10 (direita por formacao) |
| engajamento | 0.70 | ±0.15 (alto — corporativistas) |
| fidelidade | 0.65 | ±0.15 (alta — votam na categoria) |
| vulnerabilidade | 0.15 | ±0.10 (MINIMA — salario fixo, estabilidade) |
| desinformacao | 0.35 | ±0.15 (formacao + hierarquia) |
| proGarimpo | 0.40 | ±0.20 |
| proDemarcacao | 0.20 | ±0.15 |
| antiImigracao | 0.75 | ±0.10 (MUITO ALTO — vivem a fronteira) |
| dependenciaEstado | 0.80 | ±0.10 (ALTA — sao o Estado) |
| tolerancia | 0.45 | ±0.15 |

**Narrativa**: Pontos GRANDES, OPACOS, com posicao fixa. Berco eleitoral de Jorge Everton. Na simulacao, e um cluster pequeno mas DENSO e IMUTAVEL — como um forte militar. Soldado Sampaio (PM, 8.746 votos) e o "general" deste segmento. Cel. Chagas pega oficiais. Jorge Everton pega PC. A disputa e INTERNA — quem unifica as forcas de seguranca ganha.

**Forca dominante**: CORPORATIVISMO — vota no "candidato da farda".

---

## TABELA DE FORCAS ENTRE SEGMENTOS

A logica: NAO e ideologica. E de INTERESSE, MERCADO e IDENTIDADE.

```
FORCE_MATRIX [10x10] — Negativo = atracao, Positivo = repulsao

         Func  Comis Evang Jovem Merc  Indig CMed  Agro  MulPe Front
Func     -0.30 -0.35 -0.05 -0.05 -0.10  0.05 -0.15 -0.05 -0.10 -0.25
Comis    -0.35 -0.45  0.00 -0.05 -0.20  0.05 -0.05  0.00 -0.10 -0.10
Evang    -0.05  0.00 -0.40 -0.10  0.05  0.15 -0.25 -0.15 -0.15 -0.10
Jovem    -0.05 -0.05 -0.10 -0.15 -0.15  0.00 -0.05  0.00 -0.10 -0.05
Merc     -0.10 -0.20  0.05 -0.15 -0.08 -0.05 -0.05 -0.10 -0.25  0.00
Indig     0.05  0.05  0.15  0.00 -0.05 -0.45  0.25 -0.05  0.00  0.10
CMed     -0.15 -0.05 -0.25 -0.05 -0.05  0.25 -0.35 -0.15 -0.05 -0.20
Agro     -0.05  0.00 -0.15  0.00 -0.10 -0.05 -0.15 -0.30 -0.05 -0.10
MulPe    -0.10 -0.10 -0.15 -0.10 -0.25  0.00 -0.05 -0.05 -0.20  0.00
Front    -0.25 -0.10 -0.10 -0.05  0.00  0.10 -0.20 -0.10  0.00 -0.35
```

### As 10 forcas mais importantes (por intensidade):

1. **Comissionados auto-atraem (-0.45)**: Os mais coesos — perdem tudo se separar
2. **Indigena auto-atrai (-0.45)**: CIR + tuxauas = 50 anos de cola
3. **Evangelicos auto-atraem (-0.40)**: Comunidade de fe
4. **Funcionalismo-Comissionados (-0.35)**: Servico publico se une
5. **Classe Media auto-atrai (-0.35)**: Bolha identitaria
6. **Fronteira auto-atrai (-0.35)**: Corporativismo militar
7. **Agro auto-atrai (-0.30)**: Isolamento geografico une
8. **Classe Media repele Indigena (+0.25)**: Garimpo vs demarcacao
9. **Funcionalismo-Fronteira (-0.25)**: Servico publico + seguranca
10. **Mercado-Mulheres Periferia (-0.25)**: Vizinhas na vulnerabilidade

---

## MODOS DE VISUALIZACAO

O usuario pode trocar a COR das particulas para ver diferentes dimensoes:

| Modo | O que mostra | Gradiente |
|------|-------------|-----------|
| **Segmento** | Cluster politico | 10 cores fixas |
| **Orientacao** | Esquerda-Direita | Vermelho → Amarelo → Azul |
| **Fidelidade** | Quem trai vs quem e fiel | Transparente → Solido |
| **Vulnerabilidade** | Quem pode ser comprado | Verde (seguro) → Vermelho (vulneravel) |
| **Dependencia** | Quem depende do Estado | Azul (autonomo) → Laranja (dependente) |
| **Desinformacao** | Quem acredita em fake news | Verde (critico) → Vermelho (suscetivel) |
| **Municipio** | Origem geografica | 15 cores por municipio |
| **Engajamento** | Quem participa | Pequeno/escuro → Grande/brilhante |

---

## EVENTOS E COMO AFETAM CADA ATRIBUTO

| Evento | orient | engaj | fidel | vulner | desinfo | toler |
|--------|--------|-------|-------|--------|---------|-------|
| FAKE NEWS | +0.06 | +0.15 | -0.05 | +0.05 | +0.08 | -0.15 |
| CRISE SAUDE | -0.03 | +0.08 | +0.05 | +0.10 | 0 | -0.08 |
| PAUTA GARIMPO | +0.05 | +0.10 | 0 | 0 | 0 | -0.12 |
| CHOQUE MIGRAT | +0.04 | +0.08 | 0 | +0.05 | 0 | -0.15 |
| PROG SOCIAL | -0.06 | +0.05 | +0.08 | -0.10 | 0 | +0.10 |
| COMPRA VOTO | 0 | +0.10 | -0.15 | 0 | 0 | -0.05 |
| SERVICO JE | 0 | +0.05 | +0.15 | -0.05 | 0 | +0.03 |
| ESCANDALO | +0.08 | +0.20 | -0.10 | +0.05 | +0.10 | -0.20 |

**Nota**: Cada evento tem BIAS por segmento. Ex: FAKE NEWS afeta Jovens (desinfo alta) 2x mais que Classe Media. COMPRA VOTO afeta Mercado 3x mais que Indigena.

---

## CANDIDATOS COMO PARTICULAS ESPECIAIS

Cada candidato e uma particula GRANDE com atracao propria baseada em:
- Compatibilidade de orientacao com eleitores proximos
- Forca de campanha (dinheiro, estrutura, midia)
- Fidelidade dos eleitores no raio de influencia

Na simulacao:
- Candidato **atrai** eleitores compativeis (orientacao similar)
- Candidato **atrai mais forte** eleitores com baixa fidelidade (compra de voto)
- Candidato **nao move** eleitores com fidelidade > 0.7 de outro candidato
- Evento "SERVICO JE" aumenta fidelidade de eleitores proximos ao Jorge

---

*INTEIA — Inteligencia nivel militar*
*Igor Morais Vasconcelos — Pesquisador Responsavel*
*Documento tecnico para implementacao no Lenia Eleitoral — 2026-03-20*
