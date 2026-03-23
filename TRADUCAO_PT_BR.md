# TRADUCAO COMPLETA — INGLES → PORTUGUES BR
## SandboxScience Fork INTEIA
### ~200 strings mapeadas | 2026-03-21

---

## INSTRUCOES PARA APLICAR

1. Abrir cada arquivo listado abaixo
2. Buscar a string em ingles (Ctrl+F)
3. Substituir pela traducao PT-BR
4. Testar no browser apos cada arquivo

**Regra**: NENHUMA string em ingles visivel ao usuario final.
Comentarios no codigo podem ficar em ingles.
Nomes proprios (SandboxScience, WebGPU, JSON) ficam como estao.

---

## ARQUIVO: pages/particle-life.vue

| Ingles | Portugues BR |
|--------|-------------|
| Loading simulation... | Carregando simulacao... |
| Particle Life | Vida de Particulas |
| is a particle simulator where simple interaction rules produce complex, emergent behaviors | e um simulador onde regras simples de interacao produzem comportamentos complexos e emergentes |
| Tweak forces and starting conditions | Ajuste forcas e condicoes iniciais |
| stable clusters, flowing patterns, and chaotic transitions in real time | aglomerados estaveis, padroes fluidos e transicoes caoticas em tempo real |
| WebGPU provides higher FPS | WebGPU oferece FPS mais alto |
| CPU renderer stays compatible on every device | renderizador CPU permanece compativel em todos dispositivos |
| WebGPU is available | WebGPU esta disponivel |
| This device supports WebGPU | Este dispositivo suporta WebGPU |
| CPU mode — Fully compatible | Modo CPU — Totalmente compativel |
| Runs on every device | Funciona em todos os dispositivos |
| Switch to WebGPU (Recommended) | Mudar para WebGPU (Recomendado) |
| Keep CPU for now | Manter CPU por enquanto |
| Start Simulation | Iniciar Simulacao |
| Switch to CPU | Mudar para CPU |
| WebGPU is not available | WebGPU nao esta disponivel |
| Performance warning | Aviso de desempenho |
| Helpfull reminders | Lembretes uteis |
| Keep your browser and GPU drivers up to date | Mantenha navegador e drivers da GPU atualizados |
| Plug in laptops and avoid power-saving modes | Conecte notebooks na tomada e evite economia de energia |
| Close heavy tabs/apps if you notice stutter | Feche abas pesadas se notar travamentos |

## ARQUIVO: components/particle-life/ParticleLifeCpu.vue

| Ingles | Portugues BR |
|--------|-------------|
| Particle Life | Vida de Particulas |
| Presets | Predefinicoes |
| Choose predefined configurations to quickly set up your simulation | Escolha configuracoes predefinidas para configurar rapidamente sua simulacao |
| Matrix Settings | Config. de Matriz |
| Modify matrix values by clicking on cells in the grid | Modifique valores da matriz clicando nas celulas da grade |
| Use Ctrl + Click to select multiple cells | Use Ctrl + Clique para selecionar multiplas celulas |
| World Settings | Config. do Mundo |
| Particle Number | Numero de Particulas |
| Adjust the total number of particles | Ajuste o numero total de particulas |
| Color Number | Numero de Cores |
| Specify the number of particle colors | Especifique o numero de cores das particulas |
| Depth Limit | Limite de Profundidade |
| Walls Settings | Config. de Paredes |
| Rectangle | Retangulo |
| Circle | Circulo |
| Screen | Tela |
| Rectangle Size | Tamanho do Retangulo |
| Circle Size | Tamanho do Circulo |
| Diameter | Diametro |
| Physics Settings | Config. de Fisica |
| Repel Force | Forca de Repulsao |
| Force Multiplier | Multiplicador de Forca |
| Friction | Friccao |
| Randomizer Settings | Config. de Aleatorizacao |
| Min. Radius | Raio Min. |
| Max. Radius | Raio Max. |
| Graphics Settings | Config. Graficas |
| General Settings | Config. Gerais |
| Circle Shape | Forma Circular |
| Particle Size | Tamanho da Particula |
| 3D Settings | Config. 3D |
| Depth Size | Tamanho por Profundidade |
| Depth Opacity | Opacidade por Profundidade |
| Min. Opacity | Opacidade Min. |
| Max. Opacity | Opacidade Max. |
| Debug Tools | Ferramentas de Depuracao |
| Show Cells | Mostrar Celulas |
| Follow | Seguir |
| Cell Group Size | Tamanho do Grupo |
| Cell Size Factor | Fator de Tamanho |
| Save and Share | Salvar e Compartilhar |
| Screenshot | Captura de Tela |
| Debugger | Depurador |
| Grid | Grade |
| Randomize | Aleatorizar |
| Toggle 3D | Alternar 3D |
| Zoom Out | Diminuir Zoom |
| Zoom In | Aumentar Zoom |
| Play/Pause | Reproduzir/Pausar |
| Step | Passo |
| Toggle Fullscreen | Tela Cheia |
| Donate | Doar |

## ARQUIVO: components/particle-life/MatrixSettings.vue

| Ingles | Portugues BR |
|--------|-------------|
| Forces | Forcas |
| Min. Radius | Raio Min. |
| Max. Radius | Raio Max. |
| All Types | Todos os Tipos |
| Selection | Selecao |

## ARQUIVO: components/particle-life/BrushSettings.vue

| Ingles | Portugues BR |
|--------|-------------|
| Brush | Pincel |
| Eraser | Borracha |
| Attractor | Atrator |
| Repeller | Repulsor |
| Brush Settings | Config. do Pincel |
| Radius | Raio |
| Intensity | Intensidade |
| Attract | Atrair |
| Repulse | Repelir |
| Velocity | Velocidade |
| Show Brush Circle | Mostrar Circulo do Pincel |
| All Colors | Todas as Cores |

## ARQUIVO: components/particle-life/PresetPanel.vue

| Ingles | Portugues BR |
|--------|-------------|
| Official Presets | Predefinicoes Oficiais |
| My Presets | Minhas Predefinicoes |
| Color Scheme | Esquema de Cores |
| Interaction Matrix | Matriz de Interacao |
| Particle Distribution | Distribuicao de Particulas |
| Reload palette | Recarregar paleta |
| Random palette | Paleta aleatoria |

## ARQUIVO: components/particle-life/MyPresets.vue

| Ingles | Portugues BR |
|--------|-------------|
| New Preset | Nova Predefinicao |
| Keep | Manter |
| Align | Alinhar |
| Filters: | Filtros: |
| Forces | Forcas |
| Radii | Raios |
| Colors | Cores |
| Settings | Configuracoes |
| No presets saved | Nenhuma predefinicao salva |
| No presets match your filters | Nenhuma predefinicao corresponde aos filtros |
| species | especies |
| Copy JSON | Copiar JSON |
| Download JSON | Baixar JSON |
| Delete | Excluir |

## ARQUIVO: components/particle-life/SaveModal.vue

| Ingles | Portugues BR |
|--------|-------------|
| Preset Manager | Gerenciador de Predefinicoes |
| Save New Preset | Salvar Nova Predefinicao |
| Preset Name | Nome da Predefinicao |
| Enter a name for this preset... | Digite um nome para esta predefinicao... |
| Description (Optional) | Descricao (Opcional) |
| Describe what this preset does... | Descreva o que esta predefinicao faz... |
| Components to include | Componentes a incluir |
| Copy | Copiar |
| Download | Baixar |
| Save Preset | Salvar Predefinicao |
| Load From JSON | Carregar de JSON |
| Upload JSON File | Enviar Arquivo JSON |
| Ready to load | Pronto para carregar |
| Load Preset | Carregar Predefinicao |
| Untitled Preset | Predefinicao Sem Titulo |

## ARQUIVO: components/particle-life/WallStateSelection.vue

| Ingles | Portugues BR |
|--------|-------------|
| None | Nenhum |
| Repel | Repelir |
| Wrap | Contornar |

## ARQUIVO: components/particle-life/WrapModeSelection.vue

| Ingles | Portugues BR |
|--------|-------------|
| Edges | Bordas |
| Infinite | Infinito |

## ARQUIVO: components/particle-life/ShareOptions.vue

| Ingles | Portugues BR |
|--------|-------------|
| Choose Capture Mode | Escolher Modo de Captura |
| Delete Capture | Excluir Captura |
| Screenshot | Captura de Tela |
| GIF Capture | Captura de GIF |
| GIF Options | Opcoes de GIF |
| Time (s) | Tempo (s) |

## ARQUIVO: components/particle-life/TrackerToggle.vue

| Ingles | Portugues BR |
|--------|-------------|
| Track a creature | Rastrear uma criatura |
| Particle Tracker | Rastreador de Particulas |
| Camera Follow | Camera Seguidora |
| Show Indicator | Mostrar Indicador |

## ARQUIVO: components/NavBar.vue

| Ingles | Portugues BR |
|--------|-------------|
| Simulations | Simulacoes |
| Game Of Life | Jogo da Vida |
| Particle Life | Vida de Particulas |
| Documentation | Documentacao |
| About | Sobre |

## ARQUIVO: components/SidebarLeft.vue

| Ingles | Portugues BR |
|--------|-------------|
| Home | Inicio |
| Settings | Configuracoes |

## ARQUIVO: composables/usePresetManager.ts

| Ingles | Portugues BR |
|--------|-------------|
| Preset copied to clipboard | Predefinicao copiada |
| Error copying preset | Erro ao copiar predefinicao |
| Preset downloaded | Predefinicao baixada |
| Preset saved | Predefinicao salva |
| Preset not found | Predefinicao nao encontrada |
| Preset deleted | Predefinicao excluida |

---

## STRINGS QUE NAO TRADUZIR (nomes proprios/tecnicos)

SandboxScience, WebGPU, CPU, GPU, FPS, JSON, Chrome, Edge, Safari,
Firefox, NVIDIA, AMD, Intel, Patreon, Buy Me a Coffee, Hash Life,
BruteForce, SpatialHash, Canvas, WGSL, Vulkan

---

*INTEIA | Mapeamento de traducao — 2026-03-21*
*~200 strings | 25+ arquivos*
