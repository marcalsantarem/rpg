import { W, H, DEBUG } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { ArtTestScene } from './scenes/ArtTestScene.js';
import { MapScene } from './scenes/MapScene.js';
import { BattleScene } from './scenes/BattleScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { ShopScene } from './scenes/ShopScene.js';
import { SaveLoadScene } from './scenes/SaveLoadScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { IntroScene, GameOverScene, EndChapterScene } from './scenes/StoryScenes.js';

const scenes = [BootScene, TitleScene, IntroScene, MapScene, BattleScene, MenuScene, ShopScene, SaveLoadScene, GameOverScene, EndChapterScene, ArtTestScene];

const game = new Phaser.Game({
  type: Phaser.WEBGL,
  parent: 'game',
  width: W,
  height: H,
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#000000',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: scenes,
  disableContextMenu: true,
  banner: false,
  fps: new URLSearchParams(location.search).has('timer') ? { forceSetTimeOut: true, target: 60 } : undefined,
});

if (DEBUG) window.game = game;

// Ferramentas de teste (somente ?debug=1)
if (DEBUG) {
  const codes = { left: 37, up: 38, right: 39, down: 40, z: 90, x: 88, enter: 13, esc: 27, shift: 16 };
  window.press = async (key, ms = 80) => {
    const kc = codes[key] ?? key.toUpperCase().charCodeAt(0);
    const opts = { keyCode: kc, which: kc, bubbles: true };
    window.dispatchEvent(new KeyboardEvent('keydown', opts));
    await new Promise((r) => setTimeout(r, ms));
    window.dispatchEvent(new KeyboardEvent('keyup', opts));
    await new Promise((r) => setTimeout(r, 60));
  };
  window.seq = async (keys, gap = 120) => {
    for (const k of keys) {
      await window.press(k);
      await new Promise((r) => setTimeout(r, gap));
    }
  };
  window.shot = (name = 'shot') =>
    new Promise((res) => game.renderer.snapshot((img) => fetch(`/__shot?name=${name}`, { method: 'POST', body: img.src }).then(() => res(name))));
}
