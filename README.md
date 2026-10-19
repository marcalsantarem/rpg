# Sinos da Aurora

RPG de fantasia medieval por turnos, no estilo dos clássicos 16-bit (Final Fantasy V / RPG Maker).
Desktop via **Electron + Phaser 3**, também jogável no navegador (inclusive no celular, com controles de toque).
Os gráficos (tilesets, personagens, battlers, inimigos, rostos, fundos de batalha, janela e fonte) vêm do
**RPG Maker MZ** e ficam em `assets/mz/`; a música chiptune é gerada em código.

> **Aviso de licença:** os arquivos de `assets/mz/` pertencem ao RPG Maker MZ e só podem ser usados por quem
> tem a licença. Este projeto é de uso pessoal/teste: mantenha o repositório **privado** e o site com
> **senha** (Netlify → Site configuration → Access & security → Password protection).

## Como rodar

```bash
npm install
npm start
```

| Comando | O que faz |
|---|---|
| `npm start` | Abre o jogo (janela 1104x624, 16:9, tiles de 48px) |
| `npm run debug` | Abre com DevTools e atalhos de depuração |
| `npm run check` | Valida mapas, eventos e referências de dados |
| `npm run smoke` | Abre o Electron, registra erros do console e fecha sozinho |
| `npm run import-mz -- "<pasta do MZ>"` | Recopia de uma instalação do RPG Maker MZ os arquivos usados para `assets/mz/` |
| `npm run serve` | Serve a pasta em `http://localhost:5173` para testar como site estático |

## Versão web

A pasta do projeto já é um site estático: basta publicar a raiz do repositório (o Phaser fica em
`vendor/`, sem depender de `node_modules`). No GitHub Pages: **Settings → Pages → Deploy from a branch →
`main` / `(root)`**. No navegador os saves ficam no armazenamento local.

## Controles

| Tecla | Ação |
|---|---|
| Setas / WASD | Andar, navegar menus |
| Z / Enter / Espaço | Confirmar, falar, examinar |
| X / Esc | Cancelar, abrir o menu |
| Shift (segurar) | Correr |
| F11 | Tela cheia |

No celular aparecem um direcional (arrastar longe do centro corre) e os botões **A** (confirmar) e
**B** (cancelar/menu), além de um botão de tela cheia. Em retrato o jogo ocupa a largura toda com os
controles embaixo; em paisagem os controles ficam sobrepostos nas laterais.

Atalhos de depuração (`npm run debug` ou `?debug=1` no navegador): F1 cura o grupo e dá 1000 moedas,
F2 liga/desliga encontros, F3 dá 1000 de EXP, F4 teleporta para qualquer mapa, F5 força uma batalha.
No navegador também dá para começar direto num mapa: `?debug=1&map=bosque&party=selene,kael&flags=boss1`.

## História (Capítulo I — O Sino Silencioso)

Há trezentos anos, a Rainha Liora selou **Morvath, o Rei das Sombras**, com quatro **Sinos de Cristal**
que tocam a cada alvorada. Agora o sino do templo de **Aldenor** silenciou, criaturas sombrias rondam os
bosques e a pequena Lia desapareceu seguindo luzes no bosque. **Aren**, escudeiro da guarda com uma misteriosa
Marca do Sol na mão, parte para encontrá-la.

- **Selene** (Sacerdotisa): entra no Templo de Santa Liora.
- **Kael** (Patrulheiro): preso num casulo na Gruta de Cristal.
- **Mirela** (Maga): guardiã da Floresta Ancestral.
- **Lumi**: fada da aurora que guia o grupo.

Roteiro: Vila → Ancião → Templo (Selene + lanterna) → Bosque de Verdemar → Gruta de Cristal
(Kael, chefe **Medusa**) → Floresta Ancestral (Mirela, chefe **Raizmor Corrompido**) → fim do capítulo.

## Sistemas

- Exploração em grade com NPCs, baús, placas, sustos roteirizados, escuridão com lanterna e névoa.
- Combate por turnos ordenado por agilidade: Atacar, Habilidade, Item, Defender, Fugir. Elementos
  (Fogo, Luz, Trevas, Aurora), criaturas sombrias (cura causa dano), status (Veneno, Cegueira, Medo, Sono), roubo.
- Níveis, EXP, habilidades aprendidas por nível, equipamentos (arma, armadura, acessório).
- Menu: Itens, Habilidades, Equipar, Status, Ordem do grupo, Salvar, Configurações.
- Loja (compra/venda), pousada, altares de velas (restauram o grupo e permitem salvar).
- 3 slots de save (JSON em `%APPDATA%/sinos-da-aurora/saves`; no navegador, localStorage).

## Estrutura

```
electron/        processo principal (janela, IPC de saves) e preload
src/main.js      configuração do Phaser e registro das cenas
src/core/        estado do jogo, saves, controles, áudio, fórmulas, fonte, utilitários de pixel
src/art/         montagem dos mapas com autotiles do MZ (mzTiles.js) e geradores procedurais antigos
src/data/mzAssets.js  quais arquivos do MZ são usados (sprites, battlers, rostos, inimigos, fundos)
assets/mz/       arquivos copiados do RPG Maker MZ (ver aviso de licença)
src/ui/          janelas com a skin do MZ, listas com cursor, caixa de diálogo
src/data/        heróis, habilidades, itens, inimigos, lojas, música, história e mapas
src/scenes/      Boot, Título, Prólogo, Mapa, Batalha, Menu, Loja, Save/Load, Game Over, Fim de capítulo
tools/           validador de dados, importador do MZ e servidor estático
```

### Adicionar um mapa

Crie um objeto em `src/data/maps/` com `rows` (caracteres da legenda em `legend.js`, com o tile do MZ
de cada caractere definido em `src/art/mzTiles.js`) e `events`
(`warp`, `npc`, `obj`, `chest`, `save`, `touch`, `read`, `auto`, `light`), registre-o em
`src/data/maps/index.js` e rode `npm run check`. Scripts de evento são funções `async (a) => {}` que
usam a API do mapa (`a.say`, `a.ask`, `a.battle`, `a.give`, `a.join`, `a.move`, `a.warp`, …),
definida em `MapScene.makeApi()`.
