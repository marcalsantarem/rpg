// Camada de interface sobre o mapa (caixa de diálogo, avisos). Fica sempre ativa.
import { uiCamera } from '../ui/UI.js';

export class HudScene extends Phaser.Scene {
  constructor() {
    super('Hud');
  }

  create() {
    uiCamera(this);
  }
}
