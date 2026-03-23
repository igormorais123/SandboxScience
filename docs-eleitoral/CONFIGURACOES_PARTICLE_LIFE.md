# Catalogo de Padroes — Particle Life

> 27 configuracoes catalogadas do programa C++ de Hunar4321.
> Sistema: `vida_artificial_lenia.html`

---

## TAXONOMIA DE PADROES

### 1. CELULAR (cel1-cel5, esp2)
**O que e**: Formacao concentrica com nucleo, citoplasma, membrana e meio externo.

**Receita**:
- Camada interna: auto-atracao FORTE, raio CURTO (20-60)
- Camada media: atrai interna, auto-atracao moderada
- Camada externa: auto-REPULSAO, atrai media
- Meio: repele tudo, comprime

**Mecanismo**: Cadeia de repulsao A→B→C onde cada camada empurra a seguinte para fora, mas a seguinte puxa a anterior para dentro. O equilibrio dessas forcas define o raio da celula.

**Variaveis criticas**:
- Raio do nucleo (quanto menor, mais denso)
- Forca de auto-repulsao da membrana (quanto maior, mais uniforme)
- Forca de compressao externa (quanto maior, mais redonda)

---

### 2. ECOSSISTEMA (eco1-eco4, esp4)
**O que e**: Multiplas populacoes com dinamica predador-presa ou competicao.

**Receita**:
- Assimetria: A atrai B, mas B repele A (ou atrai menos)
- Recurso: um tipo que todos querem
- Regulador: predador do predador (checks and balances)

**Mecanismo**: Assimetria de forcas gera perseguicao perpetua. Nenhum estado de equilibrio estavel — o sistema oscila permanentemente.

**Variaveis criticas**:
- Grau de assimetria (quanto maior, mais rapida a perseguicao)
- Numero de tipos (2=simples, 3+=complexo)
- Raios de interacao (curto=local, longo=global)

---

### 3. COLONIA (col1-col6, esp1, esp3)
**O que e**: Grandes aglomerados com muitas particulas que formam estruturas estendidas.

**Receita**:
- Um tipo "gravitacional" que atrai quase todos (Blue nos exemplos)
- Alto numero de particulas (600+ por tipo)
- Forcas moderadas com raios grandes

**Mecanismo**: Massa critica — quando ha particulas suficientes, a atracao coletiva supera a dispersao individual. Formacoes emergentes que nao existem com poucas particulas.

**Variaveis criticas**:
- Numero de particulas (abaixo de ~200, nao ha massa critica)
- Forca do tipo gravitacional (quanto mais forte, mais centralizado)
- Raio do tipo gravitacional (curto=multiplas colonias, longo=monocentro)

---

### 4. ORGANISMO (org1-org4, esp2)
**O que e**: Formacoes que se MOVEM como unidade — vermes, criaturas, entidades moveis.

**Receita**:
- Atracao MUITO forte de um tipo a outro (-50 a -80)
- Assimetria onde "cabeca" atrai e "cauda" foge
- Auto-repulsao na cauda cria elongacao

**Mecanismo**: Quando A atrai B fortemente mas B repele A, A persegue B. Se B tambem atrai C, forma-se uma cadeia movel. A forma do organismo depende dos raios e forcas relativas.

**Variaveis criticas**:
- Forca de perseguicao (quanto maior, mais rapido o organismo)
- Diferenca entre auto-atracao/repulsao dos tipos (define forma)
- Raios (curtos=compacto, longos=alongado)

---

### 5. MINIMAL (min1-min3)
**O que e**: Poucas regras ativas (maioria zerada) que geram ordem.

**Receita**:
- Zerar quase todas as interacoes
- Manter apenas 4-6 forcas criticas
- Raios uniformes grandes

**Mecanismo**: Complexidade minima necessaria. Demonstra que pouquissimas regras bem posicionadas organizam o sistema inteiro. O excesso de regras nao necessariamente gera mais ordem.

**Variaveis criticas**:
- QUAIS forcas estao ativas (posicao na matriz importa mais que valor)
- Raios uniformes vs diferenciados

---

### 6. CLUSTER (clu1-clu2)
**O que e**: Aglomerados densos com exclusao de tipos.

**Receita**:
- Dois tipos que se atraem mutuamente (alianca)
- Um tipo com forte auto-repulsao (excluido/atomizado)
- Raios grandes para os aliados, curtos para os excluidos

**Mecanismo**: Atracao mutua entre aliados cria massa que exclui os nao-aliados. Auto-repulsao do excluido impede que ele se organize em contra-bloco.

---

## PRINCIPIOS UNIVERSAIS

### 1. Assimetria gera movimento
Se A→B = B→A, o sistema estabiliza (cristal).
Se A→B ≠ B→A, o sistema se move perpetuamente.

### 2. Auto-atracao forte + raio curto = nucleo denso
O "tamanho" do nucleo e proporcional ao raio de auto-atracao.

### 3. Auto-repulsao = distribuicao uniforme (gas/membrana)
Particulas que se repelem se espacam uniformemente — formam cascas.

### 4. Compressao externa torna redondo
Sem pressao de fora, celulas sao amorfas. Com pressao, ficam redondas.

### 5. Massa critica existe
Abaixo de ~150 particulas por tipo, estruturas nao se formam estavelmente.
Acima de ~500, novas propriedades emergem (metamorfose, divisao).

### 6. Sensibilidade a condicoes iniciais
Mudar UMA forca de -50 para +35 inverte COMPLETAMENTE o comportamento (ver org3 vs org4).

### 7. Raio define localidade vs globalidade
- Raio < 50: interacao local, multiplos clusters independentes
- Raio 50-150: interacao regional, poucos clusters grandes
- Raio > 200: interacao global, sistema monocentrico

### 8. Poucas regras bastam
5-6 forcas bem posicionadas geram tanta complexidade quanto 16 (ver min1).
