# BLE background

This project demonstrates [cordova-plugin-ble-central](https://github.com/don/cordova-plugin-ble-central) scanning, connecting, and receiving notifications in while running in the background.

The app looks for a peripheral running the counter service and automatically connects. Once connected, the app subscribes for count notifications. If the app is in the background, the user is notified via local notifications.

## Installing

### iOS

    $ git clone https://github.com/don/ble-background.git
    $ cd ble-background
    $ cordova platform add ios
    $ cordova run ios --device

### Android

    $ git clone https://github.com/don/ble-background.git
    $ cd ble-background
    $ cordova platform add android
    $ cordova run android --device

### Peripheral

The application needs a peripheral running the counter service. The counter service increments a number and sends a notification every 5 seconds. This projects includes and Arduino version of the counter service that runs on the [Arduino 101](http://store-usa.arduino.cc/products/abx00005) or any board supported by [blePeripheral](https://github.com/sandeepmistry/arduino-BLEPeripheral). An experimental Node.js verion of the service is also available.

See [arduino/Counter/Counter.ino](arduino/Counter/Counter.ino) for the Arudino sketch and [counter/](counter/) for the Node.js code.
