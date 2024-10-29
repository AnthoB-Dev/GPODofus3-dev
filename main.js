const{app, BrowserWindow, Menu} = require("electron")
const { exec } = require('child_process');

const path = require("path")
// const url = require("url")
let win

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: true,
        minWidth: 1280,
        minHeight: 720,
        autoHideMenuBar: false,
        webPreferences: {
            nodeIntegration: true,
        },
    })
    
    // Load the React frontend served by Django at http://localhost:8000
    win.loadURL('http://127.0.0.1:8000/character_management/');

    // win.loadURL(url.format({
    //     pathname: path.join(__dirname, "main.html"),
    //     protocol: "file:",
    //     slashes: true,
    // }))

    win.on("close", () => {
        win = null
    })

    win.openDevTools()
}

const startDjango = () => {
    const pythonPath = path.join(__dirname, 'Scripts', 'python.exe');
    const djangoProjectPath = path.join(__dirname, 'backend');
    
    const djangoProcess = exec(`${pythonPath} ${djangoProjectPath}/manage.py runserver`);

    djangoProcess.stdout.on('data', (data) => {
        console.log(`Django: ${data}`);
    });

    djangoProcess.stderr.on('data', (data) => {
        console.error(`Django error: ${data}`);
    });
}

app.on("ready", () => {
    startDjango()
    createWindow()
})

app.on("window-all-closed", ()=>{
    if(process.platform !== "darwin"){
        app.quit()
    }
})

app.on("activate", ()=>{
    if(win == null) {
        createWindow()
    }
})