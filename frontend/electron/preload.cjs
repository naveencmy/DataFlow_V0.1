const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  isDesktop: true,
  platform: process.platform,
  version: process.env.npm_package_version || '1.0.0',
  
  // Window control actions
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  
  // External browser links
  openExternal: (url) => ipcRenderer.send('open-external', url),
  
  // Server connection diagnostics
  checkServerConnection: (url) => ipcRenderer.invoke('check-server-connection', url),
  
  // App info
  getAppInfo: () => ipcRenderer.invoke('get-app-info')
});
