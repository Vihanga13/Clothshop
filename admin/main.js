const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let mainWindow;
let localServer;

// Built-in lightweight static server for the packaged Next.js export (out/)
function startInternalServer(outDir, port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
  };

  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cleanUrl = req.url.split('?')[0];
      let filePath = path.join(outDir, cleanUrl);

      if (filePath.endsWith(path.sep) || (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory())) {
        filePath = path.join(filePath, 'index.html');
      }
      if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      }

      fs.readFile(filePath, (err, content) => {
        if (err) {
          // Fallback to index.html only for SPA client-side page navigation, not static assets
          const isAsset = cleanUrl.startsWith('/_next/') || Boolean(path.extname(cleanUrl));
          if (isAsset) {
            res.writeHead(404);
            res.end('Asset Not Found');
            return;
          }
          fs.readFile(path.join(outDir, 'index.html'), (err2, indexHtml) => {
            if (err2) {
              res.writeHead(404);
              res.end('Not Found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(indexHtml);
            }
          });
        } else {
          const ext = path.extname(filePath).toLowerCase();
          res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(content);
        }
      });
    });

    server.listen(port, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: 'Clothshop Atelier — Admin Desktop',
    backgroundColor: '#FFF8E7',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    autoHideMenuBar: true,
  });

  Menu.setApplicationMenu(null);

  const outDir = path.join(__dirname, 'out');
  const hasOutDir = fs.existsSync(outDir);
  const isPackaged = app.isPackaged;

  let targetUrl = 'http://localhost:3002';

  if (isPackaged || hasOutDir) {
    // Packaged .exe mode: serve local out/ bundle directly (no Next.js dev server required!)
    const internalPort = 3003;
    localServer = await startInternalServer(outDir, internalPort);
    targetUrl = `http://127.0.0.1:${internalPort}`;
  }

  // Load URL with retry
  let attempts = 0;
  const maxAttempts = 30;

  const loadWithRetry = () => {
    mainWindow.loadURL(targetUrl).catch((err) => {
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(loadWithRetry, 1000);
      } else {
        console.error('Could not connect to server at ' + targetUrl, err);
      }
    });
  };

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  loadWithRetry();

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (localServer) {
      localServer.close();
    }
  });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => {
    if (localServer) localServer.close();
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
