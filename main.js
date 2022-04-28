const { app, BrowserWindow, Menu, MenuItem, Notification } = require('electron');
const { join } = require('path');
const path = require('path')
const { WebSocketServer } = require('ws');
const server = new WebSocketServer({ port: 3000 });
const rpc = require('discord-rpc');
const rpcclient = new rpc.Client({ transport: 'ipc' });
require('update-electron-app')({
  repo: 'cenapyuce/Discord-rpc',
  updateInterval: '1 hour',
  logger: require('electron-log')
})
const electronInstaller = require('electron-winstaller');
try {
   electronInstaller.createWindowsInstaller({
    appDirectory: './build/win-unpacked',
    authors: 'Cenap Yüce.',
    exe: 'discord-rpc.exe'
  });
  console.log('It worked!');
} catch (e) {
  console.log(`No dice: ${e.message}`);
}
let nofy = function(title,msg)  {
  new Notification({
     title: title,
     body: msg //`it's a test project 🔥`
 }).show();
 };

server.on('connection', (socket) => {
  console.log('connected');
  socket.on("close", () => {
    console.log("disconnected");
  });
  socket.on('message', (message) => {
    let array = message.toString().split('&');
    console.log(message.toString().split('&'));
    rpcclient.on('ready', () => {
      rpcclient.setActivity({
        details: array[1],
        state: array[2],
        largeImageKey: array[3],
        largeImageText: array[4],
        startTimestamp: new Date()
      });
      socket.send("Client: ready");
      nofy("Discord RPC", "Discord RPC is ready");
    });
    rpc.register(array[0]);
    rpcclient.login({ clientId: array[0] }).catch(err => {
      socket.send("Error: could not connect to discord");
      console.error(err);
    });
  })
});

function createWindow () {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: join(__dirname, 'logo.png')
  })
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'Close',
    click: () => {
      app.quit();
    },
    accelerator: 'CMD+QorAlt+F4'
  }));
  win.setMenu(menu)
  //win.webContents.openDevTools()
  win.loadFile('index.html')
}


app.whenReady().then(() => {
  
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
