const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveLastAchievement: (achievementId) => ipcRenderer.invoke('save-last-achievement', achievementId)
});

// TODO: Enlever le code ci-dessous si renderer.js est configuté et fonctionne
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.electron.openExternal(link.href);
    });
  });
});
