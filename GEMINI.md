# Sinos da Aurora — Guia do Desenvolvedor (GEMINI.md)

Este documento serve como referência técnica e guia de desenvolvimento para agentes e desenvolvedores trabalhando no repositório **Sinos da Aurora** (`rpg-terror`).

---

## 1. Visão Geral do Projeto

**Sinos da Aurora** é um RPG retrô de fantasia medieval e horror por turnos, inspirado na era clássica de 16-bit (como *Final Fantasy V*, *Chrono Trigger* e clássicos do *RPG Maker*).

### Destaques e Pilares Técnicos:
- **Zero Assets Externos Binários**: 100% dos recursos visuais (sprites de personagens, monstros, tiles, retratos, janelas, fontes) e sonoros (músicas e SFX chiptune) são **gerados proceduralmente via código** em tempo de execução através da Canvas API e Web Audio API. Não adicione arquivos `.png`, `.jpg`, `.mp3` ou `.wav`.
- **Arquitetura Híbrida (Desktop & Web/Mobile)**:
  - Execução Desktop nativa via **Electron** com persistência em arquivos JSON no `%APPDATA%`.
  - Execução Web direta através de qualquer servidor estático (e GitHub Pages), com persistência em `localStorage` e layout responsivo com D-Pad virtual para mobile.
- **Pure JavaScript (ES Modules)**: Sem necessidade de ferramentas de bundling ou transpilação (como Webpack ou Vite). O Phaser 3 está embutido em `vendor/phaser.min.js`.
- **Sistemas Avançados de Gameplay**:
  - **Sistema de Sanidade & Horror**: Degradação em ambientes escuros, efeitos de pulso de horror e batimentos cardíacos sintéticos via Web Audio.
  - **Combate com Linha do Tempo e Dual Techs**: Visualização de ordem de turnos, habilidades em dupla (ex: *Aurora Purificadora*, *Flecha Solar*) e sistema de *Stagger* (interrupção de golpes).
  - **Bestiário Progressivo**: Enciclopédia de criaturas com contagem de abates, fraquezas descobertas e drops.
  - **Auto-save Suave & Velocidade de Combate**: Configurações de agilidade de batalha e salvamento automático entre transições de mapas.

---

## 2. Estrutura do Repositório

```
rpg-terror/
├── electron/              # Configurações do processo principal do Electron e IPC
│   ├── main.js            # Ciclo de vida da janela, tratamento de saves e flags (--debug, --smoke)
│   └── preload.js         # Context bridge segura para o processo de renderização (window.desktop)
├── src/
│   ├── art/               # Geradores procedurais de pixel art (Canvas 2D)
│   │   ├── characters.js  # Sprites e retratos de heróis e NPCs
│   │   ├── misc.js        # Efeitos de batalha, animações e ícones
│   │   ├── monsters.js    # Arte procedural dos inimigos e chefes
│   │   ├── objects.js     # Objetos de cenário (baús, velas, portas)
│   │   └── tiles.js       # Conjunto de tiles do terreno e paredes
│   ├── core/              # Lógica e sistemas fundamentais
│   │   ├── Audio.js       # Sintetizador chiptune com Web Audio API
│   │   ├── Controls.js    # Mapeamento de teclado e Gamepad
│   │   ├── Font.js        # Fonte bitmap gerada por código
│   │   ├── Formulas.js    # Fórmulas de dano, agilidade, acerto, esquiva e EXP
│   │   ├── GameState.js   # Estado global: grupo, inventário, flags, posição
│   │   ├── Pixel.js       # Primitivas gráficas para desenho em canvas
│   │   ├── SaveSystem.js  # Interface abstrata de save/load (Electron ou LocalStorage)
│   │   ├── Settings.js    # Preferências do usuário (volume, velocidade)
│   │   └── TouchPad.js    # Controles por toque em tela (D-pad e botões virtuais)
│   ├── data/              # Dados e balanceamento do jogo
│   │   ├── maps/          # Matrizes ASCII e eventos dos mapas
│   │   ├── enemies.js     # Estatísticas, IAs e drops dos monstros
│   │   ├── heroes.js      # Status base, crescimento e sprites dos protagonistas
│   │   ├── items.js       # Consumíveis, armas, armaduras e acessórios
│   │   ├── music.js       # Partituras e padrões de notas para o sintetizador
│   │   ├── shops.js       # Estoque das lojas
│   │   ├── skills.js      # Magias, ataques e habilidades especiais
│   │   └── story.js       # Diálogos introdutórios e textos do enredo
│   ├── scenes/            # Cenas do Phaser 3
│   │   ├── BootScene.js   # Geração e registro de todas as texturas em cache
│   │   ├── TitleScene.js  # Tela de título e seleção (Novo Jogo, Continuar)
│   │   ├── MapScene.js    # Exploração, colisão em grade, NPCs e eventos
│   │   ├── BattleScene.js # Sistema de combate por turnos, status e animações
│   │   ├── HudScene.js    # Interface de HUD sobreposta ao mapa
│   │   ├── MenuScene.js   # Menu principal (Itens, Habilidades, Equipamento, etc.)
│   │   ├── ShopScene.js   # Interface de compra e venda em lojas
│   │   ├── SaveLoadScene.js # Tela de gerenciamento de slots de save
│   │   └── StoryScenes.js # Cenas de introdução, game over e conclusão
│   ├── ui/                # Componentes e janelas estilizadas
│   │   ├── MessageBox.js  # Caixa de diálogo e escolhas
│   │   └── UI.js          # Criação de caixas e menus estilo 16-bit
│   ├── config.js          # Resoluções (1104x624), escalas (3x), paletas e direções
│   └── main.js            # Ponto de entrada do jogo no navegador/Electron
├── tools/
│   ├── check-data.mjs     # Linter e validador estático de consistência de dados
│   └── serve.mjs          # Servidor estático leve para testes web
├── vendor/                # Bibliotecas de terceiros (phaser.min.js)
├── index.html             # Estrutura HTML e layout com suporte a mobile
└── package.json           # Dependências e scripts npm
```

---

## 3. Scripts e Comandos de Desenvolvimento

| Comando | Descrição |
|---|---|
| `npm install` | Instala as dependências de desenvolvimento (`electron`, etc.). |
| `npm start` | Inicia o jogo no Electron em resolução 1104x624. |
| `npm run debug` | Inicia o Electron com DevTools aberto e atalhos de depuração ativados. |
| `npm run check` | **Essencial**: Valida a integridade de mapas, eventos, itens, habilidades e IDs. |
| `npm run smoke` | Executa o jogo de forma autônoma, valida erros de console e fecha. |
| `npm run serve` | Inicia o servidor local estático em `http://localhost:5173`. |

---

## 4. Diretrizes de Desenvolvimento e Convenções

Ao fazer modificações ou adições no projeto, siga rigorosamente as seguintes diretrizes:

### 4.1. Arte e Gráficos
- **Nunca adicione imagens externas**: Toda a arte deve ser criada programaticamente em `src/art/` usando as funções utilitárias de `src/core/Pixel.js` (`px`, `rect`, `disc`, `ellipse`, etc.).
- Os sprites base são projetados na escala de 16x16 ou múltiplos (ex: monstros maiores) e amplificados por `UI_SCALE = 3` (tiles de 48px na tela).
- Ao criar novos personagens, garanta que todos os quadros de animação e direções requeridos por `validateCharacters()` em `src/art/characters.js` estejam implementados.

### 4.2. Músicas e Efeitos Sonoros
- Não use arquivos de áudio externos (`.mp3`, `.ogg`, `.wav`).
- Todas as composições são declaradas em `src/data/music.js` em formato de tracks de texto (notação simplificada de notas e durações) e executadas pelos osciladores em `src/core/Audio.js`.

### 4.3. Criação e Edição de Mapas
- Mapas são matrizes de caracteres ASCII definidas em `src/data/maps/`.
- Cada caractere corresponde a um elemento na legenda `src/data/maps/legend.js`.
- Eventos (`npc`, `warp`, `chest`, `save`, `light`, etc.) usam a API assíncrona do mapa (`a.say`, `a.ask`, `a.battle`, `a.give`, `a.join`, `a.warp`, etc.).
- **Sempre execute `npm run check` após alterar ou adicionar qualquer mapa.**

### 4.4. Integridade de Dados
- Toda referência a IDs de inimigos, itens, magias, músicas ou mapas deve existir estritamente em seus respectivos dicionários em `src/data/`.
- O script `tools/check-data.mjs` checa links quebrados, sobreposições em tiles sólidos e IDs inexistentes. Sempre garanta que `npm run check` execute com sucesso sem erros.

### 4.5. Atalhos de Depuração (Modo Debug)
Quando executado com `?debug=1` ou `npm run debug`:
- **F1**: Cura total da equipe e adiciona 1.000 moedas.
- **F2**: Alterna encontros aleatórios (liga/desliga).
- **F3**: Concede 1.000 de EXP ao grupo.
- **F4**: Teleporta para qualquer mapa registrado.
- **F5**: Força o início imediato de uma batalha.
