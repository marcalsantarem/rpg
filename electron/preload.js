const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  isElectron: true,
  readSave: (slot) => ipcRenderer.invoke('saves:read', slot),
  writeSave: (slot, data) => ipcRenderer.invoke('saves:write', slot, data),
  deleteSave: (slot) => ipcRenderer.invoke('saves:delete', slot),
  quit: () => ipcRenderer.invoke('app:quit'),
});
