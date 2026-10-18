// Servidor estático simples para testar o jogo no navegador (sem Electron).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 5173;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png' };

http
  .createServer((req, res) => {
    // dev: recebe capturas de tela do canvas (POST data URL) e salva em .shots/
    if (req.method === 'POST' && req.url.startsWith('/__shot')) {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        const name = (new URL(req.url, 'http://x').searchParams.get('name') || 'shot').replace(/[^a-z0-9_-]/gi, '');
        fs.mkdirSync(path.join(root, '.shots'), { recursive: true });
        fs.writeFileSync(path.join(root, '.shots', `${name}.png`), Buffer.from(body.split(',')[1], 'base64'));
        res.end('ok');
      });
      return;
    }
    const url = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(root, url === '/' ? 'index.html' : url);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`Sinos de Cinza em http://localhost:${port}`));
