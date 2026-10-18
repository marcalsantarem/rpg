const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const DEBUG = process.argv.includes('--debug');
const SMOKE = process.argv.includes('--smoke'); // teste automático: abre, registra erros e fecha

function savesDir() {
  const dir = path.join(app.getPath('userData'), 'saves');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function slotFile(slot) {
  const n = Number(slot);
  if (!Number.isInteger(n) || n < 1 || n > 3) throw new Error('Slot inválido');
  return path.join(savesDir(), `slot${n}.json`);
}

ipcMain.handle('saves:read', (_e, slot) => {
  const file = slotFile(slot);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
});

ipcMain.handle('saves:write', (_e, slot, data) => {
  fs.writeFileSync(slotFile(slot), JSON.stringify(data, null, 2), 'utf8');
  return true;
});

ipcMain.handle('saves:delete', (_e, slot) => {
  const file = slotFile(slot);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  return true;
});

ipcMain.handle('app:quit', () => app.quit());

// Somente no modo --smoke: captura a janela em .shots/<nome>.png (usado por testes automatizados)
ipcMain.handle('debug:shot', async (e, name) => {
  if (!SMOKE) return false;
  const img = await BrowserWindow.fromWebContents(e.sender).webContents.capturePage();
  const dir = path.join(__dirname, '..', '.shots');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${String(name).replace(/[^a-z0-9_-]/gi, '')}.png`), img.toPNG());
  return true;
});

function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 720,
    useContentSize: true,
    backgroundColor: '#000000',
    title: 'Sinos da Aurora',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: !SMOKE,
    },
  });
  Menu.setApplicationMenu(null);
  const query = DEBUG || SMOKE ? { debug: '1' } : {};
  win.loadFile(path.join(__dirname, '..', 'index.html'), { query });
  if (DEBUG && !SMOKE) win.webContents.openDevTools({ mode: 'detach' });
  if (DEBUG || SMOKE) {
    win.webContents.on('console-message', (e) => {
      const { level, message } = e;
      if (SMOKE && !['error', 'warning', 3, 2].includes(level)) return;
      console.log(`[renderer:${level}] ${message}`);
    });
  }
  if (SMOKE) {
    // SMOKE_JS: código opcional executado no jogo após o carregamento (para testar cenas específicas)
    // SMOKE_FILE: caminho de um arquivo .js com o mesmo propósito
    const script = process.env.SMOKE_FILE ? fs.readFileSync(process.env.SMOKE_FILE, 'utf8') : process.env.SMOKE_JS;
    if (script) setTimeout(() => win.webContents.executeJavaScript(script).catch((e) => console.log(`[smoke] erro: ${e}`)), 2500);
    setTimeout(async () => {
      const scenes = await win.webContents.executeJavaScript(
        "window.game ? JSON.stringify(window.game.scene.getScenes(true).map((s) => s.sys.settings.key)) : 'sem jogo'",
      );
      console.log(`[smoke] cenas ativas: ${scenes}`);
      app.quit();
    }, Number(process.env.SMOKE_MS) || 6000);
  }
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      win.setFullScreen(!win.isFullScreen());
      event.preventDefault();
    }
  });
}

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
