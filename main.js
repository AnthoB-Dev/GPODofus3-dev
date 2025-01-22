const path = require("path");
const { app, BrowserWindow, shell } = require('electron');
const log = require("electron-log");

const { handleShortcuts, handleVenv, handlePyDependencies } = require('./scripts/electron/squirrelEventsHandlers')
const { startDjango, closeDjango, killDjangoProcess } = require("./scripts/electron/djangoRelated");


const appFolder = path.resolve(process.execPath, '..');               // compilé ? C:\Users\USER\AppData\Local\GPODofus3\app-1.0.5\           : C:\Users\USER\AppData\Roaming\npm\node_modules\electron\dist
const rootFolder = path.resolve(appFolder, '..');                     // compilé ? C:\Users\USER\AppData\Local\GPODofus3\                     : C:\Users\USER\AppData\Roaming\npm\node_modules\electron\
const updateExe = path.resolve(path.join(rootFolder, 'Update.exe'));  // compilé ? C:\Users\USER\AppData\Local\GPODofus3\Update.exe           : C:\Users\USER\AppData\Roaming\npm\node_modules\electron\Update.exe
const gpodExec = path.basename(process.execPath);                     // compilé ?                                       GPOD3.exe            : electron.exe

let squirellEventVar = "";

/**
 * Essaie de fermer toutes les fenêtres Electron puis tue les processus Node et Django.
 */
function terminate() {
  log.debug("terminate")
  app.quit();
  killDjangoProcess();
  process.exit(0);
}

// Fonction pour gérer les événements Squirrel
function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false; // Pas d'argument Squirrel, exécution normale.
  }

  const squirrelEvent = process.argv[1]; // Le 2ème argument est l'event Squirrel

  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      log.debug(`handleSquirrelEvent : ${squirrelEvent}.`)

      if (!handleVenv(squirrelEvent)) {
        log.error("Échec lors de la gestion du venv. Interruption de l'installation.");
        
        terminate();
        return true;
      }

      if (!handleShortcuts(squirrelEvent)) {      
        log.error("Échec lors de la gestion des raccourcis.");

        terminate();
        return true;
      }

      log.debug(`Processus ${squirrelEvent} terminé.`)
      terminate();
      return true;

    case '--squirrel-uninstall':
      log.debug(`handleSquirrelEvent : ${squirrelEvent}.`)

      handleShortcuts(squirrelEvent);
      // createProgressSave(); // TODO
      // removeGpodDirectories(); // TODO
      
      log.debug(`Processus ${squirrelEvent} terminé.`)
      
      terminate();
      return true;

    case '--squirrel-obsolete':
      terminate();
      return true;

    case '--squirrel-firstrun':
      log.debug(`handleSquirrelEvent : ${squirrelEvent}.`)

      app.whenReady().then(() => {
        log.debug("Application prête. Execution de handleFirstRun...");
        handleFirstRun().then(() => {
          log.debug("handleFirstRun complété.");
        }).catch((err) => {
          log.error("Une erreur est survenue durant handleFirstRun:", err);
          terminate();
        });
      });

      return true;
      
    default:
      return false; // Si aucun événement n'est détecté, continue le flux normal.
  }
}

// Appel la fonction de gestion des événements Squirrel
if (handleSquirrelEvent()) {
  // Si handleSquirrelEvent retourne "true", app.quit() a déjà été appelé.
  // Le flux d'exécution est terminé.
  return;
}

async function handleFirstRun() {
  log.debug("handleFirstRun")
  
  await createInstallerWindow();

  try {
    const checkPyDependencies = await handlePyDependencies();
    if (!checkPyDependencies) {
      log.error("handlePyDependencies à retourner `false`.")
      return false;
    }

    window.close();
    window = null;

    if (!startDjango()) {
      log.error("Le serveur Django ne peut démarré.")
      terminate();
      return false;
    }
    
    createWindow();

  } catch (error) {
    log.error("Une exception est survenue lors de handleFirstRun :", error);
  }
}

/**
 * Fenêtre d'installation.
 */
function createInstallerWindow() {
  return new Promise((resolve) => {
    log.debug("createInstallerWindow");
    log.info("Création de la fenêtre d'installation.")
    
    window = new BrowserWindow({
      width: 400,
      height: 500,
      resizable: false,
      autoHideMenuBar: true,
      icon: path.join(__dirname, "staticfiles", "medias", "icons", "favicons", "icon.ico"),
    })
  
    window.loadURL(path.join(__dirname, "app", "templates", "pages", "installer.html"));
    
    window.webContents.once("did-finish-load", () => {
      log.info("Fenêtre d'installation prête.");
      resolve();
    });

    // Gestion des erreurs éventuelles
    window.webContents.once("did-fail-load", (event, errorCode, errorDescription) => {
      log.error(`Échec du chargement de la fenêtre d'installation : ${errorDescription}`);
      reject(new Error(`Erreur de chargement : ${errorDescription}`));
    });
  })
}

/**
 * Créer la fenêtre principale de l'application.
 */
function createWindow() {
  log.debug("createWindow");
  log.info("Création de la fenêtre principale.");

  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    resizable: true,
    minWidth: 1280,
    minHeight: 720,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "staticfiles", "medias", "icons", "favicons", "icon.ico"),
    backgroundColor: "#202020",
    
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
    },
  });

  mainWindow.loadURL("http://localhost:8000/");

  mainWindow.on("close", () => {
    log.info("Fermeture de la fenêtre principale.");
    mainWindow = null;
    terminate();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Suppression complet du menu
  mainWindow.setMenu(null);

  log.info("Fenêtre principale créée. Fin du processus.");
};

app.whenReady().then(() => {
  const isFirstRun = process.argv.includes('--squirrel-firstrun');

  if (isFirstRun) {
    handleFirstRun();
  } else {
    if (!startDjango()) {
      log.error("Le serveur Django ne peut démarré.")
      terminate();
    }
    createWindow();
  }
  
  app.on("activate", () => {
    log.info("app.on_activate : Application activée.");
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') terminate();
});

app.on("before-quit", async () => {
  log.info(
    "app.on_before-quit : Tentative de fermeture de l'application, arrêt du processus Django."
  );
  closeDjango();
});

app.on("quit", async () => {
  log.info("app.on_quit : L'application s'est fermée.");
  terminate()
});