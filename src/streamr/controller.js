module.exports = function Controller(Streamr){
  const common = require('../common');
  const electron = require('electron')
  const app = electron.app
  const BrowserWindow = electron.BrowserWindow
  const ipc = electron.ipcMain;
  const path = require('path')
  const url = require('url')
  const fs = require('fs');
  const controllerPath = path.join(__dirname, '..', 'www', 'controller.html');


  let controller = common.object('controller');
  let updateTimer = null;

  controller.saveWindowDimension = function(x,y,w,h){
    let json = {x: x, y: y, width: w, height: h};
    let windowFilePath = path.join(process.cwd(), 'window.json');
    fs.writeFile(windowFilePath, JSON.stringify(json), controller.log.bind(controller, "writing preferences to file... error:"));
  };

  controller.onWindowMoveOrResize = function(event){
    updateTimer = clearTimeout(updateTimer);
    let window = event.sender;
    let size = window.getSize();
    let position = window.getPosition();
    updateTimer = setTimeout(controller.saveWindowDimension.bind(controller, position[0], position[1], size[0], size[1]), 1000);
  };

  let mainWindow
  function createWindow () {
    let windowDimension = require(process.cwd() + "/window.json") || {"x":1063,"y":340,"width":1358,"height":877};
    mainWindow = new BrowserWindow({width: windowDimension.width, height: windowDimension.height, x: windowDimension.x, y: windowDimension.y});
    mainWindow.loadURL(url.format({
      pathname: controllerPath,
      protocol: 'file:',
      slashes: true
    }))
    mainWindow.on('move', controller.onWindowMoveOrResize);
    mainWindow.on('resize', controller.onWindowMoveOrResize);
    mainWindow.on('closed', function () {
      mainWindow = null
    });
    ipc.on('ctrl:message', function(event, command, ...args){
      controller.emit.apply(controller, ['ctrl:message', event, command, ...args]);
    });
  }

  app.on('ready', createWindow)


  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })

  return controller;
};