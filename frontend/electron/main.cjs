const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const http = require('http');
const https = require('https');
const { fork } = require('child_process');
const fs = require('fs');

let mainWindow = null;
let backendProcess = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function isServerRunning(port = 5000) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/health`, { timeout: 1500 }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function startBackendServerIfNeeded() {
  try {
    const alreadyRunning = await isServerRunning(5000);
    if (alreadyRunning) {
      console.log('✅ DayFlow Backend is already active on http://localhost:5000');
      return;
    }

    let backendServerPath;
    let backendCwd;

    if (app.isPackaged) {
      backendServerPath = path.join(process.resourcesPath, 'backend', 'src', 'server.js');
      backendCwd = path.join(process.resourcesPath, 'backend');
    } else {
      backendServerPath = path.join(__dirname, '..', '..', 'backend', 'src', 'server.js');
      backendCwd = path.join(__dirname, '..', '..', 'backend');
    }

    if (fs.existsSync(backendServerPath)) {
      console.log(`🚀 Spawning DayFlow Backend Server from: ${backendServerPath}`);
      backendProcess = fork(backendServerPath, [], {
        cwd: backendCwd,
        env: {
          ...process.env,
          PORT: '5000',
          NODE_ENV: 'production',
          DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dayflow_hrms?schema=public',
          ELECTRON_RUN_AS_NODE: '1',
        },
        silent: true,
      });

      backendProcess.stdout?.on('data', (data) => {
        console.log(`[Backend]: ${data.toString().trim()}`);
      });

      backendProcess.stderr?.on('data', (data) => {
        console.error(`[Backend Error]: ${data.toString().trim()}`);
      });

      backendProcess.on('exit', (code, signal) => {
        console.log(`Backend process terminated (code: ${code}, signal: ${signal})`);
        backendProcess = null;
      });
    } else {
      console.log(`ℹ️ Backend script not found at ${backendServerPath}. Skipping local server spawn.`);
    }
  } catch (err) {
    console.error('Failed to auto-start backend server:', err);
  }
}

function stopBackendServer() {
  if (backendProcess) {
    try {
      console.log('🛑 Stopping DayFlow backend server...');
      backendProcess.kill('SIGTERM');
      backendProcess = null;
    } catch (err) {
      console.error('Error stopping backend:', err);
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1080,
    minHeight: 700,
    title: 'DayFlow HRMS',
    backgroundColor: '#0f172a',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });

  // Gracefully show window once content is ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle external links in native browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Create minimalist desktop application menu
  createApplicationMenu();
}

function createApplicationMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow && mainWindow.reload(),
        },
        {
          label: 'Force Reload',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => mainWindow && mainWindow.webContents.reloadIgnoringCache(),
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        ...(isDev
          ? [
              { type: 'separator' },
              { role: 'toggleDevTools' },
            ]
          : []),
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'DayFlow Documentation',
          click: () => shell.openExternal('https://github.com/'),
        },
        {
          label: 'About DayFlow HRMS',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About DayFlow HRMS',
              message: 'DayFlow HRMS Desktop Edition',
              detail: `Version: ${app.getVersion()}\nPlatform: ${process.platform}\nNode: ${process.versions.node}\nElectron: ${process.versions.electron}`,
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('open-external', (_, url) => {
  if (url && (url.startsWith('http:') || url.startsWith('https:'))) {
    shell.openExternal(url);
  }
});

ipcMain.handle('get-app-info', () => {
  return {
    name: 'DayFlow HRMS',
    version: app.getVersion(),
    platform: process.platform,
    isPackaged: app.isPackaged,
  };
});

ipcMain.handle('check-server-connection', async (_, serverUrl) => {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(serverUrl);
      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.get(
        serverUrl.replace(/\/+$/, '') + '/health',
        { timeout: 4000 },
        (res) => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 400,
            status: res.statusCode,
          });
        }
      );

      req.on('error', (err) => {
        resolve({ ok: false, error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, error: 'Connection timed out' });
      });
    } catch (err) {
      resolve({ ok: false, error: err.message });
    }
  });
});

// Single instance lock
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

  app.whenReady().then(async () => {
    await startBackendServerIfNeeded();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('before-quit', () => {
  stopBackendServer();
});

app.on('window-all-closed', () => {
  stopBackendServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
