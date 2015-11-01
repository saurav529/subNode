var app = require('app'),  // Module to control application life.
    server,
    BrowserWindow = require('browser-window'),  // Module to create native browser window.
    Menu = require('menu');

// Report crashes to our server.
require('crash-reporter').start();

// for squirrel install
if(require('electron-squirrel-startup')) return;
/*var handleStartupEvent = function() {
    if (process.platform !== 'win32') {
        return false;
    }

    var squirrelCommand = process.argv[1];
    switch (squirrelCommand) {
        case '--squirrel-install':
        case '--squirrel-updated':

            // Optionally do things such as:
            //
            // - Install desktop and start menu shortcuts
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Always quit when done
            app.quit();

            return true;
        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Always quit when done
            app.quit();

            return true;
        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated
            app.quit();
            return true;
    }
};

if (handleStartupEvent()) {
    return;
}*/

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        server.stop();
        app.quit();
    }
});

var setDevMenu = function () {
    var devMenu = Menu.buildFromTemplate([{
        label: 'Development',
        submenu: [{
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: function () {
                BrowserWindow.getFocusedWindow().reloadIgnoringCache();
            }
        },{
            label: 'Toggle DevTools',
            accelerator: 'Alt+CmdOrCtrl+I',
            click: function () {
                BrowserWindow.getFocusedWindow().toggleDevTools();
            }
        },{
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: function () {
                app.quit();
            }
        }]
    }]);
    Menu.setApplicationMenu(devMenu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Start the server
    server = require(__dirname + '/app.js');

    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1280, height: 1024});

    // and load the index.html of the app.
    mainWindow.loadUrl('http://localhost:3000/');

    // Open the DevTools.
    //mainWindow.openDevTools();

    setDevMenu();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});

app.on('login', function(event, webContents, request, authInfo, callback) {
    event.preventDefault();

    // auto login
    var appParams = require(__dirname + '/appParams.json');
    callback(appParams.username, appParams.password);
})
