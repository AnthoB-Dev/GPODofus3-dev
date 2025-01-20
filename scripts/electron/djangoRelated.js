const _startDjango = startDjango;
const _closeDjango = closeDjango;
const _killDjangoProcess = killDjangoProcess

module.exports = {
  startDjango: _startDjango,
  closeDjango: _closeDjango,
  killDjangoProcess: _killDjangoProcess
}

const fs = require("fs");
const log = require("electron-log");
const path = require("path");
const { spawn, execSync } = require("child_process");


const djangoProjectPath = path.join(__dirname);
const appFolder = path.resolve(process.execPath, '..'); 
let venvPath = path.join(appFolder, "venv");
let pythonExec = path.join(venvPath, "Scripts", "python.exe");
const managePyPath = path.join(appFolder,"resources", "app", "manage.py");
let djangoPid = null;
let stdio = false;


function doesManagePyExists() {
  return fs.existsSync(managePyPath);
}

/**
 * Vérifie la présence de manage.py.
 * @returns {boolean} `true` s'il existe, `false` si ce n'est pas le cas.
 */
function ensureManagePyFileExists() {
  log.debug("ensureManagePyFileExists");

  try {
    if (doesManagePyExists()) {
      log.info("Manage.py existant au chemin :", managePyPath);
      return true;
    }
    log.error("Manage.py inexistant. Veuillez réinstaller l'application.");
  } catch (error) {
    log.error("Une erreur s'est produite dans ensureManagePyFileExists :", error);
  }
  return false;
}

/**
 * Tuer les processus Django sous Windows qui exécutent `manage.py runserver`.
 * @returns {boolean} `true` si au moins un processus a été tué, sinon `false`.
 */
function killDjangoProcess() {
  log.debug("killDjangoProcess");

  try {
    // Utiliser WMIC pour obtenir les lignes de commande des processus Python
    const processes = execSync(`wmic process where "name='python.exe'" get Commandline,ProcessId /FORMAT:LIST`, {
      encoding: "utf8",
    });

    // Séparer les processus et extraire les lignes de commande
    const processEntries = processes.split(/\r?\n\r?\n/).filter(entry => entry.trim().length > 0);
    let killed = false;

    for (const entry of processEntries) {
      const commandLineMatch = entry.match(/CommandLine=(.+)/);
      const pidMatch = entry.match(/ProcessId=(\d+)/);

      if (commandLineMatch && pidMatch) {
        const commandLine = commandLineMatch[1].trim();
        const pid = pidMatch[1].trim();

        // Vérifier si la ligne de commande contient `manage.py runserver`
        if (commandLine.includes("manage.py runserver")) {
          log.info(`Processus Django trouvé. PID : ${pid}, Commande : ${commandLine}`);
          execSync(`taskkill /PID ${pid} /F`); // Terminer le processus
          log.info(`Processus Django avec PID ${pid} arrêté.`);
          killed = true;
        }
      }
    }

    if (!killed) {
      log.warn("Aucun processus Django (manage.py runserver) trouvé.");
    }

    return killed;
  } catch (error) {
    log.error("Erreur lors de la tentative de tuer le processus Django :", error);
    return false;
  }
}

/**
 * Ferme le serveur Django. S'assure de tuer le processus python.
 */
function closeDjango() {
  log.debug("closeDjango");

  if (killDjangoProcess()) {
    log.info("Django fermé avec succès.");
  } else if (killed || !killed) {
    log.info("Aucun processus Django orphelin à fermer.")
  } else {
    log.error("Impossible de fermer Django.");
  }
}

/**
 * Lance le serveur Django.
 */
function startDjango() {
  log.debug("startDjango");

  try {
    if (!ensureManagePyFileExists()) {
      log.error("Impossible de démarrer le processus Django car manage.py est introuvable.");
      return false;
    }

    log.info("Lancement du processus Django.");

    stdio ? stdio = "pipe" : stdio = "ignore";

    // Vérifiez que pythonExec et managePyPath sont corrects
    log.debug("pythonExec : ", pythonExec);
    log.debug("managePyPath : ", managePyPath);

    const django = spawn(pythonExec, [managePyPath, "runserver"], {
      cwd: djangoProjectPath,
      shell: false,
      stdio: stdio,
    });

    djangoPid = django.pid;
    django.unref();
    
    if (stdio) {
      // Capture stdout et stderr pour afficher les logs du serveur Django
      django.stdout.on('data', (data) => {
        log.info("stdout: " + data.toString());
      });
      
      django.stderr.on('data', (data) => {
        log.error("stderr: " + data.toString());
      });
    }

    log.info("Processus Django démarré avec succès avec le PID :", djangoPid);
    return true;
  } catch (error) {
    log.error("Une erreur s'est produite dans startDjango :", error);
    return false;
  }
}
