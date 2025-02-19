const path = require("path");
const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");
const isLinux = process.platform === "linux";
let icon;

isLinux ? icon = "icon.png" : icon = "icon.ico"

module.exports = {
  packagerConfig: {
    name: "GPODofus3",
    asar: false,
    icon: path.join(
      __dirname,
      "staticfiles",
      "medias",
      "icons",
      "favicons",
      icon,
    ),
    executableName: "GPODofus3",
    strip: false,
    ignore: isLinux ? ["libs/python/WPy64-31310"] : [],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "GPODofus3",
        authors: "AnthoB-Dev",
        description: "Guide de progression optimisée pour Dofus 3",
        setupIcon: path.join(
          __dirname,
          "staticfiles",
          "medias",
          "icons",
          "favicons",
          "icon.ico"
        ),
        noMsi: true,
        iconUrl: path.join(
          __dirname,
          "staticfiles",
          "medias",
          "icons",
          "favicons",
          "icon.ico"
        ),
        oneClick: false
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        name: "GPODofus3",
        productName: "GPODofus3",
        genericName: "GPOD3",
        description: "Guide de progression optimisée pour Dofus 3",
        productDescription: "Portage Linux de l'application GPODofus3 build en Django / Electron.",
        version: "1.0.7",
        license: "MIT",
        copyright: "© 2025 AnthoB-Dev. Licensed under MIT.",
        homepage: "https://github.com/AnthoB-Dev/GPODofus3",
        section: "utility",
        categories: ["Game", "Utility"],
        icon: path.join(__dirname, "staticfiles", "medias", "icons", "favicons", icon),
        maintainer: "AnthoB-Dev <bonis.anthony.dev@gmail.com>",
      },
    },
    
  ],
  "publishers": [
    {
      "name": "@electron-forge/publisher-github",
      "config": {
        "repository": {
          "owner": "AnthoB-Dev",
          "name": "GPODofus3-dev"
        },
        "prerelease": false,
        "draft": false
      }
    }
  ],
  plugins: [
    // Fuses sont utilisés pour activer/désactiver diverses fonctionnalités d'Electron
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: true,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
};
