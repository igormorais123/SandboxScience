<div align="center">

# ⚛️ INTEIA Simulador — Sistemas Complexos Interativos

### Eleições, galáxias, ecossistemas — sistemas complexos emergem de regras simples

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.20-00DC82?style=flat-square&logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org)
[![WebGPU](https://img.shields.io/badge/WebGPU-Shaders-8B5CF6?style=flat-square)](https://www.w3.org/TR/webgpu/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=flat-square&logo=vercel)](https://inteia-simulador.vercel.app)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-d69e2e?style=flat-square)](LICENSE)

*Simulador universal de partículas com modos Eleitoral, Planetário e Vida Microscópica.*

**[Demo ao vivo](https://inteia-simulador.vercel.app)** · [Simulador Eleitoral](https://inteia-simulador.vercel.app/particle-life) · [Jogo da Vida](https://inteia-simulador.vercel.app/game-of-life) · [Hash Life](https://inteia-simulador.vercel.app/hash-life)

</div>

---

## O que é

O **INTEIA Simulador** é uma plataforma interativa de simulação de sistemas complexos. O motor de partículas permite explorar como **regras simples de interação** produzem **comportamentos emergentes** — de dinâmicas eleitorais a galáxias.

Fork do [Sandbox Science](https://github.com/DicSo92/SandboxScience) de Charly Luzzi, adaptado pela INTEIA para simulação político-eleitoral e análise estratégica.

## Simulações

### Particle Life — 3 Modos

| Modo | Descrição |
|------|-----------|
| **Eleitoral/Social** | Segmentos eleitorais como partículas — aliados se atraem, adversários se repelem. Cenários reais calibrados (Roraima 2026, DF 2026). |
| **Planetário** | Gravidade, órbitas e sistemas solares emergentes. Física newtoniana simplificada. |
| **Vida Microscópica** | Bactérias, predadores e ecossistemas. Dinâmica predador-presa com partículas. |

**Características:**
- **WebGPU** (27 shaders WGSL) para milhares de partículas em tempo real
- **CPU fallback** compatível com todos os dispositivos
- **27+ presets** pré-calibrados
- **Helena IA** — a cientista-chefe da INTEIA configura simulações via linguagem natural (OmniRoute, custo zero)
- **Legenda interativa** com tooltip em hover nas partículas
- **Gravação GIF** nativa

### Game of Life

Autômato celular clássico de John Conway com controles interativos.

### Hash Life

Implementação otimizada do algoritmo HashLife para simulações de larga escala.

## Arquitetura

```
inteia-simulador/
├── pages/                        # Páginas Nuxt
│   ├── index.vue                 # Landing page INTEIA
│   ├── particle-life.vue         # Simulador de partículas
│   ├── game-of-life.vue          # Jogo da Vida
│   ├── hash-life.vue             # Hash Life
│   └── about.vue                 # Sobre
│
├── components/                   # 48 componentes Vue
│   ├── particle-life/            # 19 componentes do simulador
│   │   ├── ParticleLifeCpu.vue   # Renderizador CPU
│   │   ├── ParticleLifeGpu.vue   # Renderizador WebGPU
│   │   ├── PresetPanel.vue       # Painel de presets
│   │   └── ...
│   └── game-of-life/             # Componentes do GoL
│
├── stores/                       # Estado (Pinia)
│   ├── particleLifeStore.ts      # Física CPU
│   ├── particleLifeGPUStore.ts   # Física GPU
│   ├── gameStore.ts              # Game of Life
│   └── quadStore.ts              # Quadtree
│
├── assets/particle-life-gpu/     # Shaders WebGPU
│   └── shaders/
│       ├── compute/              # Física (forças, sort, compact)
│       ├── compose/              # HDR, compositor infinito
│       └── render/               # Glow, partículas
│
├── constants/                    # Cenários e configurações
│   ├── electoralScenarios.ts     # Cenários eleitorais calibrados
│   └── index.ts                  # Presets padrão
│
├── helpers/utils/                # Geradores
│   ├── colorsGenerator.ts        # Paletas de cores
│   ├── positionsGenerator.ts     # Distribuição inicial
│   ├── rulesGenerator.ts         # Matrizes de interação
│   └── themes.ts                 # Temas visuais
│
├── server/api/                   # API backend (Nitro)
│   ├── helena.post.ts            # Helena IA (OmniRoute)
│   └── pageView.ts              # Analytics
│
├── docs-eleitoral/               # Documentação de design
├── nuxt.config.ts                # Configuração Nuxt
└── uno.config.ts                 # UnoCSS (Tailwind-like)
```

## Como Rodar

### Requisitos

- Node.js 18+
- npm

### Instalação

```bash
git clone https://github.com/igormorais123/SandboxScience.git
cd SandboxScience
npm install
npm run dev
```

Acesse `http://localhost:3000`.

### Build para produção

```bash
npm run build     # SSR
npm run generate  # Estático (SSG)
```

### Variáveis de ambiente (opcionais)

```env
# Helena IA (análise via linguagem natural)
OMNIROUTE_API_KEY=sua_chave          # OmniRoute (custo zero)
OMNIROUTE_URL=http://localhost:20128 # URL do gateway

# Fallback
ANTHROPIC_API_KEY=sua_chave          # Caso OmniRoute indisponível

# Analytics
NUXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX
```

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Nuxt 3 + Vue 3 |
| Linguagem | TypeScript |
| Gráficos | WebGPU (WGSL shaders) + Canvas 2D (fallback) |
| Estado | Pinia |
| CSS | UnoCSS (Tailwind-compatible) |
| IA | Helena via OmniRoute / Anthropic |
| Deploy | Vercel (SSR + edge) |
| Licença | AGPL-3.0 |

## Helena IA

A cientista-chefe da INTEIA pode configurar simulações via linguagem natural:

> *"Simule a eleição de Roraima 2026 com 7 segmentos: base do governador, oposição, evangélicos..."*

Helena retorna uma configuração completa (segmentos, forças, raios) que o motor aplica instantaneamente. Funciona via OmniRoute (custo zero) com fallback para Anthropic.

## Projetos Relacionados

- **[Vila INTEIA](https://github.com/igormorais123/vila-inteia)** — Campus 3D com 144 consultores lendários simulados
- **[MiroFish INTEIA](https://github.com/igormorais123/MiroFish)** — Motor de simulação social multiagente

## Créditos

Fork de [Sandbox Science](https://github.com/DicSo92/SandboxScience) por [Charly Luzzi (DicSo92)](https://github.com/DicSo92), licenciado sob AGPL-3.0.

---

<div align="center">

**Fork mantido por [Igor Morais Vasconcelos](https://github.com/igormorais123)**

*[INTEIA](https://inteia.com.br) — Inteligência Artificial Estratégica*

</div>
