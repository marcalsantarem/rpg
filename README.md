# Sinos da Aurora

RPG de fantasia medieval por turnos, no estilo dos clássicos 16-bit (Final Fantasy V / RPG Maker).
Desktop via **Electron + Phaser 3**. Toda a arte (tiles, personagens, monstros, fontes) e a música
chiptune são geradas em código; não há assets externos.

## Como rodar

```bash
npm install
npm start
```

| Comando | O que faz |
|---|---|
| `npm start` | Abre o jogo (janela 960x720, resolução interna 320x240) |
| `npm run debug` | Abre com DevTools e atalhos de depuração |
| `npm run check` | Valida mapas, eventos e referências de dados |
| `npm run smoke` | Abre o Electron, registra erros do console e fecha sozinho |
| `npm run serve` | Serve a pasta em `http://localhost:5173` para testar no navegador |

## Controles

| Tecla | Ação |
|---|---|
| Setas / WASD | Andar, navegar menus |
| Z / Enter / Espaço | Confirmar, falar, examinar |
| X / Esc | Cancelar, abrir o menu |
| Shift (segurar) | Correr |
| F11 | Tela cheia |

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
(Kael, chefe **Rainha Aranha**) → Floresta Ancestral (Mirela, chefe **Raizmor Corrompido**) → fim do capítulo.

## Sistemas

- Exploração em grade com NPCs, baús, placas, sustos roteirizados, escuridão com lanterna e névoa.
- Combate por turnos ordenado por agilidade: Atacar, Habilidade, Item, Defender, Fugir. Elementos
  (Fogo, Luz, Trevas, Aurora), criaturas sombrias (cura causa dano), status (Veneno, Cegueira, Medo, Sono), roubo.
- Níveis, EXP, habilidades aprendidas por nível, equipamentos (arma, armadura, acessório).
- Menu: Itens, Habilidades, Equipar, Status, Ordem do grupo, Salvar, Configurações.
- Loja (compra/venda), pousada, altares de velas (restauram o grupo e permitem salvar).
- 3 slots de save (JSON em `%APPDATA%/sinos-de-cinza/saves`; no navegador, localStorage).

## Estrutura

```
electron/        processo principal (janela, IPC de saves) e preload
src/main.js      configuração do Phaser e registro das cenas
src/core/        estado do jogo, saves, controles, áudio, fórmulas, fonte, utilitários de pixel
src/art/         geradores de tiles, personagens, monstros, efeitos e fundos de batalha
src/ui/          janelas estilo FF, listas com cursor, caixa de diálogo
src/data/        heróis, habilidades, itens, inimigos, lojas, música, história e mapas
src/scenes/      Boot, Título, Prólogo, Mapa, Batalha, Menu, Loja, Save/Load, Game Over, Fim de capítulo
tools/           validador de dados e servidor estático
```

### Adicionar um mapa

Crie um objeto em `src/data/maps/` com `rows` (caracteres da legenda em `legend.js`) e `events`
(`warp`, `npc`, `obj`, `chest`, `save`, `touch`, `read`, `auto`, `light`), registre-o em
`src/data/maps/index.js` e rode `npm run check`. Scripts de evento são funções `async (a) => {}` que
usam a API do mapa (`a.say`, `a.ask`, `a.battle`, `a.give`, `a.join`, `a.move`, `a.warp`, …),
definida em `MapScene.makeApi()`.
