const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openExternal: (url) => ipcRenderer.send("open-external", url),
});

// renderer.js
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.electron.openExternal(link.href);
    });
  });
});
