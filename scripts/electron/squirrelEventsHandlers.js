const _handleVenv = handleVenv;
const _handlePyDependencies = handlePyDependencies;
const _handleShortcuts = handleShortcuts;
const _defineVenvPath = defineVenvPath;

module.exports = {
  handleVenv: _handleVenv,
  handlePyDependencies: _handlePyDependencies,
  handleShortcuts: _handleShortcuts,
  defineVenvPath: _defineVenvPath
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
const pipPath = path.join(venvPath, "Scripts");
const pipExec = path.resolve(path.join(pipPath, 'pip.exe'))
const requirementsFile = path.join(appFolder, "resources", "app", "requirements.txt");
const updateExe = path.resolve(path.join(rootFolder, 'Update.exe'));
const gpodExec = path.basename(process.execPath);


function executeCommand(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);

    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
      log.info(`stdout: ${data}`);
    });

    child.stderr.on("data", (data) => {
      log.error(`stderr: ${data}`);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

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
  return fs.existsSync(pipExec);
}

function defineVenvPath() {
  const parentFolder = path.join(__dirname, "..");
  const parentFolderName = path.basename(parentFolder);

  if (venvPath != "") return;

  if (parentFolderName.startsWith("resources")) {
    log.info("Dossier parent : '" + parentFolderName + "'. Environnement 'compilé' detecté.");
    venvPath = path.join(__dirname, "../../venv");
  } else {
    log.info("Dossier parent : '" + parentFolderName + "'. Environnement 'source code' detecté.");
    venvPath = path.join(__dirname, "venv");
  }
}

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
  log.debug("ensurePipExists")
  
  if (!doesPipExists()) {
    log.warn("pip.exe introuvable dans :", pipPath);
    log.info("Tentative d'installation de pip...");
    return installPip();
  }

  log.info(`pip.exe existant dans ${pipPath} : ${pipExec}`);
  return true;
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
async function areDependenciesInstalled() {
  try {
    log.info("Vérification des dépendances avec pip freeze...");

    const installedPackagesRaw = await executeCommand(pipExec, ["freeze"], {
      encoding: "utf-8",
      shell: true,
    });

    const installedPackages = installedPackagesRaw
      .split("\n")
      .map((line) => line.trim().toLowerCase());

    if (process.argv.includes("--squirrel-firstrun")) {
      log.debug("installedPackages :", installedPackages);
    }

    if (!installedPackages.some((line) => line.trim() !== "")) {
      log.warn("Les dépendances ne sont pas installées.");
      return false;
    }

    const requirements = fs
      .readFileSync(requirementsFile, "utf-8")
      .split("\n")
      .map((line) => line.trim().toLowerCase());

    if (process.argv.includes("--squirrel-firstrun")) {
      log.debug("requirements :", requirements);
    }

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
}


/**
 * Installe les dépendances Python grâce à la commande "pip install --no-cache-dir -r requirements.txt".\
 * Vérifie sur les dépendances existe déjà, puis si pip.exe est présent dans pipPath puis s'exécute.
 * @returns {boolean} `true` si l'opération réussit, sinon `false`.
 */
async function installDependencies() {
  log.debug("installDependencies");
  log.info("Installation des dépendances...");

  try {
    log.info("Installation via pip...");
    const pipArgs = [
      "install",
      "--no-cache-dir",
      "-r",
      requirementsFile,
      "--default-timeout=600",
    ];

    const output = await executeCommand(pipExec, pipArgs, { encoding: "utf-8" });
    log.debug(`Installation réussie : ${output}`);
    return true;
  } catch (error) {
    log.error("Erreur lors de l'installation des dépendances :", error);
    return false;
  }
}

/**
 * Vérifie et installe les dépendances si nécessaire.
 * @returns {boolean} `true` si toutes les dépendances sont installées, sinon `false`.
 */
async function ensureDependencies() {
  log.debug("ensureDependencies");

  if(!ensurePipExists()) {
    return false
  }

  const dependenciesInstalled = await areDependenciesInstalled();

  if (dependenciesInstalled) {
    log.info("Les dépendances sont déjà installées.");
    return true;
  }

  log.info("Une ou plusieurs dépendances sont manquantes. Installation...");
  return await installDependencies();
}


/**
 * Gère l'installation ou la mise à jour des dépendances selon l'événement Squirrel.
 * @param {string} squirrelEvent - L'événement Squirrel (e.g., "--squirrel-install").
 * @returns {boolean} `true` si l'opération réussit, sinon `false`.
 */
async function handlePyDependencies(squirrelEvent) {
  log.debug("handlePyDependencies appelé avec l'événement :", squirrelEvent);

  try {
    if (["--squirrel-install", "--squirrel-updated"].includes(squirrelEvent)) {
      return await ensureDependencies();
    } else {
      log.debug("Événement non pris en charge :", squirrelEvent);
      return await ensureDependencies();
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
      return true;
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
