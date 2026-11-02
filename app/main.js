const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path'), fs = require('fs'), os = require('os'), http = require('http');

// Firebase sign-in needs the page to be served over http(s), so when a Firebase
// config is present the app serves its own files on 127.0.0.1 (this computer only).
function cloudConfigured() {
  try {
    return /apiKey\s*:\s*["'][^"']+["']/.test(fs.readFileSync(path.join(__dirname, 'firebase-config.js'), 'utf8'));
  } catch (e) { return false; }
}
function startServer() {
  return new Promise((resolve) => {
    const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
    const srv = http.createServer((req, res) => {
      let name = req.url.split('?')[0];
      if (name === '/') name = '/index.html';
      if (!['/index.html', '/firebase-config.js'].includes(name)) { res.writeHead(404); return res.end(); }
      fs.readFile(path.join(__dirname, name), (err, buf) => {
        if (err) { res.writeHead(404); return res.end(); }
        res.writeHead(200, { 'Content-Type': types[path.extname(name)] });
        res.end(buf);
      });
    });
    srv.once('listening', () => resolve(srv.address().port));
    srv.on('error', (e) => { if (e.code === 'EADDRINUSE') srv.listen(0, '127.0.0.1'); });
    srv.listen(47821, '127.0.0.1');
  });
}

async function createWindow() {
  const w = new BrowserWindow({
    width: 1400, height: 900, backgroundColor: '#f6f7fb', title: 'Learner Score Master Sheet',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, devTools: false }
  });
  w.setMenuBarVisibility(false);
  if (cloudConfigured()) {
    const port = await startServer();
    w.loadURL('http://127.0.0.1:' + port + '/index.html');
  } else {
    w.loadFile(path.join(__dirname, 'index.html'));
  }
}


// --- Robustness on Windows: keep only one copy running, and keep Chromium's caches in
// places it can always write to (avoids "Unable to move the cache: Access is denied").
app.setPath('userData', path.join(app.getPath('appData'), 'Learner Score Master Sheet Data'));
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const w = BrowserWindow.getAllWindows()[0];
    if (w) { if (w.isMinimized()) w.restore(); w.focus(); }
  });
}
app.commandLine.appendSwitch('disk-cache-dir', path.join(os.tmpdir(), 'learner-score-master-sheet-cache'));
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.setAppUserModelId('com.santamariel.learnerscoremastersheet');
app.whenReady().then(() => {
  if (!gotLock) return;
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('save-pdf', async (event, { html, filename }) => {
  const tmp = path.join(os.tmpdir(), 'bece-sheet-' + Date.now() + '.html');
  fs.writeFileSync(tmp, html, 'utf8');
  const win = new BrowserWindow({ show: false, webPreferences: { sandbox: true } });
  try {
    await win.loadFile(tmp);
    const pdf = await win.webContents.printToPDF({ landscape: true, pageSize: 'A3', printBackground: true, preferCSSPageSize: true });
    const parent = BrowserWindow.fromWebContents(event.sender);
    const r = await dialog.showSaveDialog(parent, { defaultPath: filename, filters: [{ name: 'PDF', extensions: ['pdf'] }] });
    if (r.canceled || !r.filePath) return { ok: false };
    fs.writeFileSync(r.filePath, pdf);
    shell.openPath(r.filePath);
    return { ok: true, path: r.filePath };
  } finally {
    win.destroy();
    try { fs.unlinkSync(tmp); } catch (e) {}
  }
});

ipcMain.handle('save-file', async (event, { content, filename }) => {
  const parent = BrowserWindow.fromWebContents(event.sender);
  const r = await dialog.showSaveDialog(parent, { defaultPath: filename, filters: [{ name: 'Backup', extensions: ['json'] }] });
  if (r.canceled || !r.filePath) return { ok: false };
  fs.writeFileSync(r.filePath, content, 'utf8');
  return { ok: true, path: r.filePath };
});
