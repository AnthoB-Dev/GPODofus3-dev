const _handleVenv = handleVenv;
const _handlePyDependencies = handlePyDependencies;
const _handleShortcuts = handleShortcuts;

module.exports = {
  handleVenv: _handleVenv,
  handlePyDependencies: _handlePyDependencies,
  handleShortcuts: _handleShortcuts
}

const fs = require("fs");
const log = require("electron-log");
const path = require("path");
const { spawn, exec, spawnSync } = require("child_process");

const appFolder = path.resolve(process.execPath, '..'); 
const rootFolder = path.resolve(appFolder, '..');
const scriptPath = path.join(appFolder, "resources", "app", "scripts", "install_dep.bat")
let pythonPath;
let pythonExec;
let venvPath = path.join(appFolder, "venv"); // TODO Ajuster le venvPath selon source code / compilé
// const pipPath = path.join(venvPath, "Scripts");
const pipPath = path.join(venvPath, "Scripts", "pip.exe")
const pipExec = path.resolve(path.join(pipPath, 'pip.exe'))
const requirementsFile = path.join(appFolder, "resources", "app", "requirements.txt");
const updateExe = path.resolve(path.join(rootFolder, 'Update.exe'));
const gpodExec = path.basename(process.execPath);
const venvActivatePath = path.join(venvPath, "Scripts", "activate.bat"); // Chemin vers activate.bat


/**
 * Vérifie si le venv existe.
 * @returns {boolean} - `true` si le venv existe, sinon `false`.
 */
function doesVenvExists() {
  return fs.existsSync(venvPath);
}

/**
 * Vérifie si pip.exe existe.
 * @returns {boolean} - `true` si pip.exe existe, sinon `false`.
 */
function doesPipExists() {
  return fs.existsSync(pipPath);
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
 * Crée un environnement virtuel (venv).
 * @returns {boolean} `true` si le venv a été créé avec succès, sinon `false`.
 */
function createVenv() {
  log.debug("createVenv");
  
  pythonPath = path.join(appFolder, "resources", "app", "libs", "python", "WPy64-31310", "python");
  pythonExec = path.join(pythonPath, "python.exe")
  log.info("Variables pythonPath & pythonExec modifiées pour la création du venv.")
  log.debug("Variable pythonPath :", pythonPath);
  log.debug("Variable pythonExec :", pythonExec);

  try {
    log.info("Création du venv au chemin :", venvPath);
    const result = spawnSync(pythonExec, ["-m", "venv", venvPath], { 
      stdio: ['pipe', 'pipe', 'pipe'], 
    });

    if (result.error) {
      log.error("Erreur lors de la création du venv :", result.error);
      return false;
    }

    if (result.status !== 0) {
      log.error(`La commande de création du venv a échoué avec le code : ${result.status}`);
      return false;
    }
    
    log.info("Le venv a été créé avec succès.");
    return true;
  } catch (error) {
    log.error("Une exception est survenue lors de la création du venv :", error);
    return false;
  }
}

/**
 * Installe pip en téléchargeant et exécutant le script officiel "get-pip.py".
 * @returns {boolean} `true` si l'installation réussit, sinon `false`.
 */
function installPip() {
  log.debug("installPip");

  // Vérification si Python est disponible
  try {
    const pythonCheck = spawnSync(pythonPath, ["--version"], {
      stdio: ['pipe', 'pipe', 'pipe'], 
    });
    if (pythonCheck.error || pythonCheck.status !== 0) {
      log.error("Python n'est pas disponible. Impossible d'installer pip.");
      return false;
    }
  } catch (error) {
    log.error("Erreur lors de la vérification de Python :", error);
    return false;
  }

  // Téléchargement du script get-pip.py
  const getPipUrl = "https://bootstrap.pypa.io/get-pip.py";
  const getPipPath = path.join(os.tmpdir(), "get-pip.py");

  try {
    log.info("Téléchargement de get-pip.py depuis :", getPipUrl);
    const response = require("https").get(getPipUrl, (res) => {
      const fileStream = fs.createWriteStream(getPipPath);
      res.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close(() => {
          log.info("Script get-pip.py téléchargé avec succès.");
        });
      });
    });

    response.on("error", (error) => {
      log.error("Erreur lors du téléchargement de get-pip.py :", error);
      return false;
    });
  } catch (error) {
    log.error("Une erreur s'est produite lors du téléchargement de get-pip.py :", error);
    return false;
  }

  // Exécution du script pour installer pip
  try {
    log.info("Installation de pip en exécutant le script get-pip.py...");
    const pipInstall = spawnSync(pythonPath, [getPipPath], { 
      stdio: ['pipe', 'pipe', 'pipe'],  
    });

    if (pipInstall.error || pipInstall.status !== 0) {
      log.error("L'installation de pip a échoué avec le code :", pipInstall.status);
      return false;
    }

    log.info("pip a été installé avec succès.");
    return true;
  } catch (error) {
    log.error("Une erreur s'est produite lors de l'installation de pip :", error);
    return false;
  }
}

/**
 * Vérifie ou crée le venv si nécessaire.
 * @returns {*} `true` si le venv existe ou a été créé avec succès, sinon retourne la fonction de création du venv.
 */
function ensureVenvExists() {
  if (doesVenvExists()) {
    log.info("Dossier venv existant au chemin :", venvPath);
    pythonPath = path.join(appFolder, "venv", "Scripts");
    pythonExec = path.join(pythonPath, "python.exe");
    log.info("Variables pythonPath & pythonExec modifiées en conséquence.")
    log.debug("Variable pythonPath :", pythonPath);
    log.debug("Variable pythonExec :", pythonExec);

    return true;
  }

  log.warn("Dossier venv non trouvé.");
  return createVenv();
}

/**
 * Vérifie ou installe pip si nécessaire.
 * @returns `true` si le venv existe ou a été créé avec succès, sinon retourne la fonction d'installation de pip.
 */
function ensurePipExists() {
  if (doesPipExists()) {
    log.info(`pip.exe existant dans ${pipPath} : ${pipPath}`);
    return true;
  }

  log.warn("pip.exe introuvable dans :", pipPath);
  log.info("Tentative d'installation de pip...");
  return installPip();
}

/**
 * Gère l'installation ou la mise à jour du venv selon l'événement Squirrel.
 * @param {string} squirrelEvent - L'événement Squirrel (e.g., "--squirrel-install").
 * @returns {boolean} `true` si l'opération réussit, sinon `false`.
 */
function handleVenv(squirrelEvent) {
  log.debug("handleVenv appelé avec l'événement :", squirrelEvent);

  try {
    if (squirrelEvent === "--squirrel-install") {
      log.debug("Gestion de l'événement : --squirrel-install");
      return ensureVenvExists();

    } else if (squirrelEvent === "--squirrel-updated") {
      log.debug("Gestion de l'événement : --squirrel-updated");
      return ensureVenvExists();

    } else {
      log.debug("Événement Squirrel non pris en charge :", squirrelEvent);
      return true; // Aucun problème pour les événements non pris en charge
    }
  } catch (error) {
    log.error("Une erreur s'est produite dans handleVenv :", error);
    return false;
  }
}

/**
 * Vérifie si toute les dépendances de requirements.txt sont installées mais s'interromp si une d'elles ne l'est pas.
 * @returns {boolean} `true` si toute les dépendances sont installées, sinon `false`.
 */
function areDependenciesInstalled() {
  log.debug("areDependenciesInstalled");

  try {
    log.info("Vérification des dépendances avec pip freeze...");
    const result = spawnSync(pipPath, ["freeze"], { 
      encoding: "utf-8",
      stdio: ['pipe', 'pipe', 'pipe'], 
    });
    log.info(result.stdout);

    if (result.error || result.status !== 0) {
      log.error("Erreur lors de l'exécution de pip freeze :", result.error);
      return false;
    }

    const installedPackages = result.stdout
      .split("\n")
      .map((line) => line.trim().toLowerCase());

    const requirements = fs
      .readFileSync(requirementsFile, "utf-8")
      .split("\n")
      .map((line) => line.trim().toLowerCase());

    for (const requirement of requirements) {
      if (requirement && !installedPackages.some((pkg) => pkg.startsWith(requirement))) {
        log.warn(`Dépendance manquante : ${requirement}`);
        return false;
      }
    }

    log.info("Toutes les dépendances sont installées.");
    return true;
  } catch (error) {
    log.error("Une erreur s'est produite dans areDependenciesInstalled :", error);
    return false;
  }
}

/**
 * Installe les dépendances Python grâce à la commande "pip install --no-cache-dir -r requirements.txt".\
 * Vérifie sur les dépendances existe déjà, puis si pip.exe est présent dans pipPath puis s'exécute.
 * @returns {boolean} `true` si l'opération réussit, sinon `false`.
 */
async function installDependencies() {
  log.debug("Installation des dépendances");

  try {
    // Lancer le venv et installer les dépendances avec pip
    log.info("Activation du venv et installation des dépendances...");
    log.info(`Chemin vers activate.bat : ${venvActivatePath}`);
    log.info(`Chemin vers requirements.txt : ${requirementsFile}`);
    
    spawnSync('cmd.exe', ['/c', scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    log.info("Dépendances installées avec succès.");
    return true;
  } catch (error) {
    log.error("Erreur lors de l'installation des dépendances : ", error);
    return false;
  }
}

/**
 * Vérifie et installe les dépendances si nécessaire.
 * @returns {boolean} `true` si toutes les dépendances sont installées, sinon `false`.
 */
function ensureDependencies() {
  if (areDependenciesInstalled()) {
    log.info("Les dépendances sont déjà installées.");
    return true;
  }

  log.info("Une ou plusieurs dépendances sont manquantes. Installation...");
  return installDependencies();
}


/**
 * Gère l'installation ou la mise à jour des dépendances selon l'événement Squirrel.
 * @param {string} squirrelEvent - L'événement Squirrel (e.g., "--squirrel-install").
 * @returns {boolean} `true` si l'opération réussit, sinon `false`.
 */
function handlePyDependencies(squirrelEvent) {
  log.debug("handlePyDependencies appelé avec l'événement :", squirrelEvent);

  try {
    if (["--squirrel-install", "--squirrel-updated"].includes(squirrelEvent)) {
      log.debug(`Gestion de l'événement : ${squirrelEvent}`);
      return ensureDependencies();
    } else {
      log.debug("Événement Squirrel non pris en charge :", squirrelEvent);
      return true; // Aucun problème pour les événements non pris en charge
    }
  } catch (error) {
    log.error("Une erreur s'est produite dans handlePyDependencies :", error);
    return false;
  }
}

/**
 * Gère la création ou suppression des raccourcis selon l'event squirrel.
 * @param {string} squirrelEvent 
 * @returns {boolean} `true` si l'opération réussit, `false` si elle échoue.
 */
function handleShortcuts(squirrelEvent) {
  if (squirrelEvent == "--squirrel-install" || squirrelEvent == "--squirrel-updated") {
    try {
      // Lancement du processus enfant pour créer les raccourcis
      const child = spawn(updateExe, ['--createShortcut', gpodExec], {
        detached: true,  // Détache le processus
        stdio: 'ignore', // Ignore les flux (pas besoin de feedback)
      });
      // Permet au processus enfant de fonctionner indépendamment
      child.unref();
      log.info("Raccourci ajouté avec succès.")
    } catch (error) {
      log.error('Erreur lors du traitement des raccourcis Squirrel:', error);
    }
  } else if (squirrelEvent == "--squirrel-uninstall") {
    try {
      const child = spawn(updateExe, ['--removeShortcut', gpodExec], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
      log.info("Raccourci retiré avec succès.")
      return true;
    } catch (error) {
      log.error('Erreur lors du traitement des raccourcis Squirrel:', error);
      return false;
    }
  }
};
