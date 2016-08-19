// BLE Counter
// Runs on Arduino 101 and Arduino boards compatible with https://github.com/sandeepmistry/arduino-BLEPeripheral
#include <CurieBLE.h>
// #include <blePeripheral.h>

BLEPeripheral blePeripheral;
BLEService service("1234");
BLEUnsignedLongCharacteristic countCharacteristic("5678", BLERead | BLENotify);  

unsigned long count = 0;
unsigned long lastMillis = 0;  // this might be uint64_t on the Arduino 101
unsigned long interval = 5000; // milliseconds

void setup() {
    Serial.begin(9600);
    blePeripheral.setLocalName("Count");
    blePeripheral.setDeviceName("Count");
    blePeripheral.setAdvertisedServiceUuid(service.uuid());
    blePeripheral.addAttribute(service);
    blePeripheral.addAttribute(countCharacteristic);

    blePeripheral.setEventHandler(BLEConnected, onConnect);
    blePeripheral.setEventHandler(BLEDisconnected, onDisconnect);

    countCharacteristic.setEventHandler(BLESubscribed, onSubscribe);
    countCharacteristic.setEventHandler(BLEUnsubscribed, onUnsubscribe);

    blePeripheral.begin();
}

void loop() {
    blePeripheral.poll();

    if (millis() - lastMillis > interval) {
      countCharacteristic.setValue(count);
      count++;
      lastMillis = millis();
    }
}

void onConnect(BLECentral& central) {
  Serial.print("Central ");
  Serial.print(central.address());
  Serial.println(" connected");
}

void onDisconnect(BLECentral& central) {
  Serial.print("Central ");
  Serial.print(central.address());
  Serial.println(" disconnected");
}

void onSubscribe(BLECentral& central, BLECharacteristic& characteristic) {
    Serial.print(central.address());
    Serial.print(" subscribed to characteristic ");
    Serial.println(characteristic.uuid());
 
    count = 0;
}

void onUnsubscribe(BLECentral& central, BLECharacteristic& characteristic) {
    Serial.print(central.address());
    Serial.print(" unsubscribed from characteristic ");
    Serial.println(characteristic.uuid());
}
