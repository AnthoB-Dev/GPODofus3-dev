(async () => {
  const { app, BrowserWindow, shell, dialog } = require("electron");
  const { autoUpdater } = require('electron-updater');
  const { spawn } = require("child_process");
  const path = require("path");
  const fs = require("fs");
  const log = require("electron-log");
  const kill = require("tree-kill");
  const https = require("https");

  let mainWindow;
  let djangoProcess;
  let stdio;
  let venvPath;
  let venvPythonPath;
  let pipPath;
  const stdOn = false; // Définir sur false pour désactiver la sortie standard
  const embeddablePython = path.join(__dirname, "libs", "python", "3131");
  const embeddablePythonExec = path.join(__dirname, embeddablePython, "python.exe");
  const embeddablePipExec = path.join(__dirname, embeddablePython, "Scripts", "pip.exe");
  const appFolder = path.resolve(process.execPath, '..');
  const rootFolder = path.resolve(appFolder, '..');
  const updateExe = path.resolve(path.join(rootFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);
  const djangoProjectPath = path.join(__dirname);

  const installationMarker = path.join(app.getPath('userData'), '.installation_complete');

  log.info(`Arguments de lancement : ${process.argv.join(' ')}`);

  const spawnUpdate = function(args) {
    let spawnedProcess;
    try {
      spawnedProcess = spawn(updateExe, args, { detached: true });
      spawnedProcess.on('close', (code) => {
        log.info(`Update.exe terminé avec le code ${code}`);
      });
    } catch (error) {
      log.error(`Erreur lors de l'exécution de Update.exe avec les arguments ${args}:`, error);
    }
    return spawnedProcess;
  };

  /**
   * Défini le venvPath selon si l'installation est lancée via le setup.exe ("../../venv") ou via le script install.vbs ("venv").\
   * Il change car je n'arrivais pas à faire en sorte que le venv soit crée où je le voulais soit : \AppData\Local\GPODofus3\app-1.0.5\resources\app, et me suis résolu à le laisser dans \AppData\Local\GPODofus3\app-1.0.5\ où il était crée malgré moi.\
   * Pour ce qui est de cette fonction, je vérifie simplement le nom du parent pour savoir si oui ou non il commence par "app-" si c'est le cas, alors c'est une installation via setup.exe.
   */
  const defineVenvPath = () => {
    const parentFolder = path.join(__dirname, "../");
    const parentFolderName = path.basename(parentFolder);

    if (parentFolderName.startsWith("app-")) {
      venvPath = path.join(__dirname, "../../venv");
    } else {
      venvPath = path.join(__dirname, "venv");
    }
    log.info(`Set venvPath to : ${venvPath}`);
    venvPythonPath = path.join(venvPath, "Scripts", "python.exe");
  }

  const handleSquirrelEvent = async () => {
    if (process.argv.length > 1) {
      const squirrelEvent = process.argv[1];
      defineVenvPath();

      log.info(`Set venvPath to : ${venvPath}`);

      // L'event firstrun est censé être le moment où on peut afficher un spalshscreen ou une UI de configuration d'options par exemple.
      if (squirrelEvent === '--squirrel-firstrun') {
        log.info("Événement --squirrel-firstrun détecté.");
      
      
        if (!fs.existsSync(installationMarker)) {
          log.info("Installation incomplète lors du premier lancement, attente de l'installation.");
          // Attendre ou exécuter à nouveau l'installation si nécessaire
          await runInstaller();
        }
      
        // Laisser l'application continuer à démarrer normalement
        return false;
      }
  
      if (squirrelEvent === '--squirrel-install' || squirrelEvent === '--squirrel-updated') {
        // Création des raccourcis
        spawnUpdate(['--createShortcut', exeName]);
      
        try {
          log.info("Démarrage de l'installation...");
          await runInstaller();
          log.info("Installation terminée.");
      
          // Redémarrer manuellement l'application après l'installation
          const spawnOptions = {
            detached: true,
            stdio: 'ignore'
          };
          const child = spawn(process.execPath, [], spawnOptions);
          child.unref();
      
        } catch (error) {
          log.error(`Erreur lors de l'installation : ${error.message}`);
          dialog.showErrorBox(
            "Erreur",
            `Erreur lors de l'installation : ${error.message}`
          );
        } finally {
          app.quit();
        }
        return true;
      }
  
      if (squirrelEvent === '--squirrel-uninstall') {
        // Suppression des raccourcis
        spawnUpdate(['--removeShortcut', exeName]);
  
        // Suppression des dossiers spécifiques avec réessai
        try {
          // Fonction de réessai
          const deletePathWithRetry = (targetPath, retries = 3, delay = 1000) => {
            return new Promise((resolve, reject) => {
              const attemptDelete = (currentAttempt) => {
                if (!fs.existsSync(targetPath)) {
                  log.info(`Le dossier n'existe pas : ${targetPath}`);
                  return resolve();
                }
                try {
                  fs.rmSync(targetPath, { recursive: true, force: true });
                  log.info(`Dossier supprimé : ${targetPath}`);
                  resolve();
                } catch (error) {
                  if (currentAttempt < retries) {
                    log.warn(`Tentative ${currentAttempt + 1} échouée pour supprimer ${targetPath}. Nouvelle tentative dans ${delay}ms.`);
                    setTimeout(() => attemptDelete(currentAttempt + 1), delay);
                  } else {
                    reject(error);
                  }
                }
              };
              attemptDelete(0);
            });
          };
  
          // Chemin vers AppData\Local\GPODofus3
          const localAppDataPath = path.join(process.env.LOCALAPPDATA, 'GPODofus3');
          // Chemin vers AppData\Roaming\GPODofus3
          const appDataPath = path.join(process.env.APPDATA, 'GPODofus3');
  
          await deletePathWithRetry(localAppDataPath);
          await deletePathWithRetry(appDataPath);
        } catch (error) {
          log.error(`Erreur lors de la suppression des dossiers : ${error}`);
        }
  
        app.quit();
        return true;
      }
  
      if (squirrelEvent === '--squirrel-obsolete') {
        app.quit();
        return true;
      }
    }
    return false;
  };

  // En cas d'event squirrel, lance la fonction handleSquirrelEvent().
  if (require("electron-squirrel-startup")) {
    handleSquirrelEvent();
  }

  const executeCommand = (command, args) => {
    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, { shell: true });
      let stdout = "";
      let stderr = "";
  
      proc.stdout.on("data", (data) => {
        const output = data.toString();
        stdout += output;
        log.info(`stdout: ${output}`);
      });
  
      proc.stderr.on("data", (data) => {
        const errorOutput = data.toString();
        stderr += errorOutput;
        log.error(`stderr: ${errorOutput}`);
      });
  
      proc.on("close", (code) => {
        log.info(`Processus terminé avec le code ${code}`);
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          const errorMessage = `Commande "${command} ${args.join(' ')}" échouée avec le code ${code}`;
          log.error(errorMessage);
          reject(new Error(stderr.trim() || errorMessage));
        }
      });
  
      proc.on("error", (err) => {
        log.error(`Erreur lors de l'exécution de la commande : ${err.message}`);
        reject(err);
      });
    });
  };

  /**
   * Fonction pour créer le virtual environment (venv).\
   * Utilise la version Python embarquée pour créer le virtual environment.
   * @returns {Promise<string>} venvPath
   */
  const createVenv = async () => {
    log.info(`Chemin de création du virtual environment : ${venvPath}`);

    if (fs.existsSync(venvPath)) {
      log.info("Virtual environment déjà existant.");
      return venvPath;
    }

    try {
      log.info("Création du virtual environment...");
      await executeCommand(`"${embeddablePythonExec}"`, ["-m", "venv", venvPath]);
      log.info("Virtual environment créé avec succès.");
      pipPath = path.join(venvPath, "Scripts", "pip.exe")
      return venvPath;
    } catch (error) {
      log.error(`Erreur lors de la création du venv : ${error.message}`);
      dialog.showErrorBox(
        "Erreur",
        `Erreur lors de la création du virtual environment : ${error.message}`
      );
      app.quit();
    }
  };

  const ensurePipIsInstalled = async() => {
    if (!fs.existsSync(pipPath)) {
      log.error(`pip.exe introuvable dans le venv à : ${pipPath}. Les dépendances Python ne peuvent pas être installées.`);

      try {
        log.info('Tentative de purge du cache pip...')  
        await executeCommand("pip", ["cache", "purge"]);
        log.info('Le cache pip a été purgé.')  
      } catch (error) {
        log.error(`Erreur lors de la tentative de purge du cache pip`, error);
        return false;
      }
      return;
    }
  }

  // Fonction pour vérifier si les dépendances sont déjà installées
  const areDependenciesInstalled = async () => {
    try {
      log.info("Vérification des dépendances avec pip freeze...");
      const installedPackagesRaw = await executeCommand(`"${pipPath}"`, [
        "freeze",
      ]);
      const installedPackages = installedPackagesRaw
        .split("\n")
        .map((line) => line.trim().toLowerCase());
      const requirements = fs
        .readFileSync(path.join(__dirname, "requirements.txt"), "utf-8")
        .split("\n")
        .map((line) => line.trim().toLowerCase());
      for (const requirement of requirements) {
        if (requirement && !installedPackages.includes(requirement)) {
          log.info(`Dépendance ${requirement} manquante.`);
          return false;
        }
      }
      return true;
    } catch (error) {
      log.error(
        `Erreur lors de la vérification des dépendances : ${error.message}`
      );
      return false;
    }
  };

  // Fonction pour installer les dépendances du venv
  const installDependencies = async () => {
    log.info(`Vérification de pip à : ${pipPath}`);

    await ensurePipIsInstalled();
    if(!ensurePipIsInstalled()) { return; }
  
    const dependenciesInstalled = await areDependenciesInstalled();

    if (dependenciesInstalled) {
      log.info("Toutes les dépendances sont déjà installées.");
      return;
    } else {
      try {
        log.info("Installation des dépendances avec pip...");
        log.info(`Commande exécutée : "${pipPath}" install --no-cache-dir -r ${path.join(__dirname, "requirements.txt")}`);
        await executeCommand(pipPath, [
          "install",
          "--no-cache-dir",
          "-r",
          path.join(__dirname, "requirements.txt"),
        ]);
        log.info("Dépendances installées avec succès.");
      } catch (error) {
        log.error(
          `Erreur lors de l'installation des dépendances : ${error.message}`
        );
        log.error(`Détails de l'erreur : ${error.stack}`);
        dialog.showErrorBox(
          "Erreur",
          `Erreur lors de l'installation des dépendances : ${error.message}. Réessayez de lancer l'installateur en tant qu'administrateur.`
        );
        app.quit();
      }
    }
  };

  const runInstaller = async () => {
    try {
      await createVenv();
      await installDependencies(venvPath);
      log.info("Environnement configuré avec succès.");
    } catch (error) {
      log.error("Erreur lors de la configuration de l'environnement :", error);
      dialog.showErrorBox(
        "Erreur",
        "Erreur lors de la configuration de l'environnement."
      );
      app.quit();
    }
  };

  // Fonction pour exécuter le processus Django
  const runDjangoProcess = (venvPythonPath, djangoProjectPath) => {
    const managePyPath = path.join(djangoProjectPath, "manage.py");

    log.info("- Lancement du processus Django.");
    log.info(`Chemin Python utilisé : ${venvPythonPath}`);
    log.info(`Chemin manage.py utilisé : ${managePyPath}`);

    stdOn ? (stdio = "pipe") : (stdio = "ignore");

    const django = spawn(venvPythonPath, ["manage.py", "runserver"], {
      cwd: djangoProjectPath,
      shell: false,
      stdio: stdio,
    });

    log.info("Django process spawned.");

    if (stdOn) {
      // Capture de la sortie standard
      django.stdout.on("data", (data) => {
        log.info(`Django stdout : ${data}`);
      });

      // Capture de la sortie d'erreur
      django.stderr.on("data", (data) => {
        log.error(`Django stderr : ${data}`);
      });
    }

    django.on("error", (err) => {
      log.error("Échec du démarrage du processus Django :", err);
      dialog.showErrorBox(
        "Erreur",
        "Échec du démarrage du serveur Django."
      );
      app.quit();
    });

    django.on("exit", (code) => {
      if (code !== 0) {
        log.error(`Le processus Django s'est terminé avec le code ${code}`);
        dialog.showErrorBox(
          "Erreur",
          `Le serveur Django s'est arrêté avec le code ${code}.`
        );
      }
      log.info("Processus Django terminé.");
      app.quit();
    });

    return django;
  };

  // Fonction pour démarrer Django
  const startDjango = async () => {
    log.info("- Démarrage de Django. Début du processus.");
    log.info(`__Python_path : ${venvPythonPath}`);

    try {
      log.info(`__Django_project_path : ${djangoProjectPath}`);
      djangoProcess = runDjangoProcess(venvPythonPath, djangoProjectPath);
      log.info("Processus Django démarré avec le PID :", djangoProcess.pid);
    } catch (error) {
      log.error("Erreur lors du démarrage du processus Django :", error);
      dialog.showErrorBox(
        "Erreur",
        "Erreur lors du démarrage du serveur Django."
      );
      app.quit();
    }
  };

  // Fonction pour arrêter Django
  const killDjangoProcess = () => {
    return new Promise((resolve, reject) => {
      try {
        if (djangoProcess && !djangoProcess.killed) {
          log.info("Arrêt du processus Django.");
          kill(djangoProcess.pid, "SIGTERM", (err) => {
            if (err) {
              log.error(
                "Erreur lors de l'arrêt du processus Django :",
                err
              );
              reject(err);
            } else {
              log.info("Processus Django arrêté avec succès.");
              resolve();
            }
          });
        } else {
          log.info("Aucun processus Django actif à arrêter.");
          resolve();
        }
      } catch (error) {
        log.error("Erreur lors de l'arrêt du processus Django :", error);
        reject(error);
      }
    });
  };

  // Fonction pour créer la fenêtre principale
  const createWindow = () => {
    log.info("- Création de la fenêtre principale.");

    mainWindow = new BrowserWindow({
      width: 1600,
      height: 900,
      resizable: true,
      minWidth: 1280,
      minHeight: 720,
      autoHideMenuBar: true,
      icon: path.join(__dirname, "staticfiles", "medias", "icons", "favicons", "icon.ico"),
      
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
      log.info("- Fermeture de la fenêtre principale.");
      mainWindow = null;
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: "deny" };
    });

    // Supprimer complètement le menu
    mainWindow.setMenu(null);

    log.info("Fenêtre principale créée. Fin du processus.");
  };

  // Gérer les événements de l'application
  app.whenReady().then(async () => {
    autoUpdater.checkForUpdatesAndNotify();
    await startDjango();
    createWindow();

    app.on("activate", () => {
      log.info("app.on_activate : Application activée.");
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  autoUpdater.on('checking-for-update', () => {
    console.log('Vérification des mises à jour...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('Nouvelle mise à jour disponible :', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('Pas de mise à jour disponible.');
  });

  autoUpdater.on('error', (err) => {
    console.error('Erreur pendant la mise à jour :', err);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Mise à jour téléchargée. Elle sera installée au prochain démarrage.');
    autoUpdater.quitAndInstall(); // Redémarre l'application pour installer la mise à jour
  });

  app.on("window-all-closed", () => {
    log.info(
      "app.on_window-all-closed : Toutes les fenêtres sont fermées."
    );
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("before-quit", async () => {
    log.info(
      "app.on_before-quit : Tentative de fermeture de l'application, arrêt du processus Django."
    );
    await killDjangoProcess();
  });

  app.on("quit", async () => {
    log.info("app.on_quit : L'application s'est fermée.");
    app.quit();
  });

  // Gestion des signaux de terminaison
  process.on("SIGINT", async () => {
    log.info("SIGINT reçu, fermeture de l'application.");
    await killDjangoProcess();
    app.quit();
  });

  process.on("SIGTERM", async () => {
    log.info("SIGTERM reçu, fermeture de l'application.");
    await killDjangoProcess();
    app.quit();
  });
})();
