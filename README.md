# BLE background

This project demonstrates [cordova-plugin-ble-central](https://github.com/don/cordova-plugin-ble-central) scanning, connecting, and receiving notifications in while running in the background.

The app looks for a peripheral running the counter service and automatically connects. Once connected, the app subscribes for count notifications. If the app is in the background, the user is notified via local notifications.

The counter service increments a number and sends a notification every 5 seconds. This projects includes and Arduino version of the counter service that runs on the [Arduino 101](http://store-usa.arduino.cc/products/abx00005) or any board supported by [blePeripheral](https://github.com/sandeepmistry/arduino-BLEPeripheral). An experimental Node.js verion of the service is also available.

