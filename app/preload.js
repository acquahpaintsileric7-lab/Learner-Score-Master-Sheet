const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  savePdf: (html, filename) => ipcRenderer.invoke('save-pdf', { html, filename }),
  saveFile: (content, filename) => ipcRenderer.invoke('save-file', { content, filename })
});
