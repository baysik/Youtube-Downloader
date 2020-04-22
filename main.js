const { app, BrowserWindow, Menu, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

// configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

// let win;
let mainWindow;
let addWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  // menu
  const mainMenu = Menu.buildFromTemplate(template);
  // insert menu
  Menu.setApplicationMenu(mainMenu);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// handle add window
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      nodeIntegration: true,
    },
    title: "Version",
  });
  // addWindow.webContents.openDevTools();
  addWindow.on("closed", () => {
    addWindow = null;
  });
  addWindow.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);

  // autoUpdater.autoDownload = true;
  autoUpdater.checkForUpdates();
  return addWindow;
}

// setting a save directory
function setSaveDirectory() {
  dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then((result) => {
      console.log(result.filePaths);
      mainWindow.webContents.send("test", result.filePaths);
    });
}

// Define the menu
let template = [];
// label: "About",
// click() {
//   createAddWindow();
// },

// OS X
// const name = app.getName();
template = [
  {
    label: "About",
    submenu: [
      {
        label: "Check/Install Updates",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Set Save Directory",
        click() {
          setSaveDirectory();
        },
      },
      // {
      //   role: "toggleDevTools",
      // },
      {
        label: "Quit",
        accelerator: "alt+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
  {
    role: "viewMenu",
  },
];

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
  autoUpdater.checkForUpdates();
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
const sendStatusToWindow = (text) => {
  log.info(text);
  if (addWindow) {
    addWindow.webContents.send("message", text);
  }
};

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
  sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("Update not available");
});
autoUpdater.on("error", (err) => {
  sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
});
autoUpdater.on("download-progress", (progressObj) => {
  sendStatusToWindow(
    `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
  );
});
autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("Update downloaded; will install now");
});

autoUpdater.on("update-downloaded", (info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 500 ms.
  // You could call autoUpdater.quitAndInstall(); immediately
  autoUpdater.quitAndInstall();
});
