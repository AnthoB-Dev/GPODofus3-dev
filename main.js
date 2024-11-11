const { app, BrowserWindow, shell } = require("electron");
const { exec } = require("child_process");

const path = require("path");
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: true,
    minWidth: 1280,
    minHeight: 720,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL("http://localhost:8000/app/guide/1/");

  mainWindow.on("close", () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

const startDjango = () => {
  const pythonPath = path.join(__dirname, "venv", "Scripts", "python.exe");
  const djangoProjectPath = path.join(__dirname, "core");

  const djangoProcess = exec(
    `${pythonPath} ${djangoProjectPath}/manage.py runserver`
  );

  djangoProcess.stdout.on("data", (data) => {
    console.log(`Django: ${data}`);
  });

  djangoProcess.stderr.on("data", (data) => {
    console.error(`Django error: ${data}`);
  });
};

app.whenReady().then(() => {
  startDjango();
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainwindow == null) {
    createWindow();
  }
});
