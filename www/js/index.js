var COUNTER_SERVICE = '1234';
var COUNT_CHARACTERISTIC = '5678';

var app = {
    initialize: function() {
        this.bindEvents();
        this.showMainPage();
        scanButton.hidden = true;
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('backbutton', this.onBackButton, false);
        scanButton.addEventListener('click', this.scan, false);
        disconnectButton.addEventListener('click', this.disconnect, false);
    },
    onDeviceReady: function() {

        // initial scan is on a timer, so there's time to background
        // the app after it starts
        setTimeout(app.scan, 3000);
    },
    scan: function() {
        scanButton.hidden = true;
        ble.startScan([COUNTER_SERVICE], app.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function(device) {

        console.log(JSON.stringify(device));

        // if we're in the background, add a local notification
        var localNotification = {
            title: 'Found Bluetooth Device',
            text: device.name + ' (' + device.id + ')',
        };
        cordova.plugins.notification.local.schedule(localNotification);

        // stop scanning and connect automatically
        ble.stopScan(
            function() {                
                ble.connect(device.id, app.onConnect, app.onDisconnect);
            },
            function(reason) {
                console.log('Error stopping scan', reason);
            }
        );

    },
    onConnect: function(peripheral) {

        app.peripheral = peripheral;

        deviceIdDiv.innerText = 'Connected to ' + peripheral.id;
        app.showDetailPage();
        app.subscribeToNotifications();
    },
    subscribeToNotifications: function() {
        ble.startNotification(
            app.peripheral.id,
            COUNTER_SERVICE,
            COUNT_CHARACTERISTIC,
            app.onData,
            app.onError);
    },
    onData: function(buffer) {
        console.log("onData");
        var data = new Uint32Array(buffer);
        countDiv.innerText = data[0];
        console.log(data[0]);

        var localNotification = {
            title: 'Count',
            text: 'The count is ' + data[0]
        };
        cordova.plugins.notification.local.schedule(localNotification);
    },
    disconnect: function(e) {
        if (app.peripheral && app.peripheral.id) {
            ble.disconnect(app.peripheral.id, app.showMainPage, app.onError);
        }
    },
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
        scanButton.hidden = false;
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
    onBackButton: function() {
        if (mainPage.hidden) {
            app.disconnect();
        } else {
            navigator.app.exitApp();
        }
    },
    onDisconnect: function(peripheral) {
        // onDisconnect is called when the peripheral disconnects from us,
        // but not when we call app.disconnect()
        var message;
        if (typeof peripheral === 'object') {
            // usually we get an object for the peripheral that disconnected
            message = 'Peripheral ' + (peripheral.name || peripheral.id) + ' disconnected';
        } else {
            // sometimes we get an error message
            message = peripheral;
        }
        navigator.notification.alert(message, app.showMainPage, 'Disconnected');
    },
    onError: function(reason) {
        if (typeof reason === 'object') {
            var device = reason;
            navigator.notification.alert('Device ' + device.id + ' disconnected', app.showMainPage, 'Disconnected');
        } else {
            navigator.notification.alert(reason, app.showMainPage, 'Error');
        }
    }
};

app.initialize();
