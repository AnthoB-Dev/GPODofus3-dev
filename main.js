const path = require("path");
const { app, BrowserWindow, shell, ipcMain, globalShortcut } = require("electron");
const { spawn } = require("child_process");
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');
const log = require('electron-log');

const store = new Store();
let mainWindow;
let djangoProcess;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App is starting...');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    resizable: true,
    minWidth: 1280,
    minHeight: 720,
    maxWidth: 1600,
    maxHeight: 900,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '/static/medias/icons/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
    },
  });

  mainWindow.loadURL("http://localhost:8000/");

  mainWindow.on("close", () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Supprimer complètement le menu
  mainWindow.setMenu(null);

  // Empêcher l'ouverture de la barre de menus avec ALT
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Alt') {
      event.preventDefault();
    }
  });

  // Enregistrer un raccourci vide pour désactiver le comportement ALT
  globalShortcut.register('Alt', () => {
    // Ne rien faire
  });
  
}

// Fonction pour exécuter le processus Django
const runDjangoProcess = (pythonPath, djangoProjectPath) => {
  return spawn(pythonPath, ['manage.py', 'runserver'], {
    cwd: djangoProjectPath,
    windowsHide: true,
    stdio: 'inherit',
  });
};

// Fonction pour démarrer Django
const startDjango = () => {
  const pythonPath = path.join(__dirname, "venv", "Scripts", "python.exe");
  const djangoProjectPath = path.join(__dirname);

  djangoProcess = runDjangoProcess(pythonPath, djangoProjectPath);

  console.log('Django process started with PID:', djangoProcess.pid);
};

// Fonction pour nettoyer les processus enfants
function cleanupAndExit(signal) {
  console.log(`Received ${signal}. Cleaning up...`);
  if (djangoProcess && !djangoProcess.killed) {
    try {
      djangoProcess.kill(); // Tuer le processus sans spécifier de signal
      console.log('Django process terminated.');
    } catch (error) {
      console.error('Error terminating Django process:', error);
    }
  } else {
    console.log('No Django process to terminate.');
  }
  app.quit();
}

// Gestion des signaux de terminaison
process.on('SIGINT', () => cleanupAndExit('SIGINT'));
process.on('SIGTERM', () => cleanupAndExit('SIGTERM'));

// Gestion de l'événement 'exit'
process.on('exit', () => cleanupAndExit('exit'));

// Gestion de la fermeture de toutes les fenêtres
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    cleanupAndExit('window-all-closed');
  }
});

// Gestionnaire IPC pour 'save-last-achievement'
ipcMain.handle('save-last-achievement', (event, achievementId) => {
  store.set('lastAchievement', achievementId);
  return { status: 'success' };
});

// Initialiser l'application
app.whenReady().then(() => {
  startDjango();
  createWindow();

  // Vérifier les mises à jour
  autoUpdater.checkForUpdatesAndNotify();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Gérer les événements de mise à jour
autoUpdater.on('update-available', () => {
  log.info('Mise à jour disponible.');
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});