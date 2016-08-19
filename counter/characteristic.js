var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var CountCharacteristic = function() {
  CountCharacteristic.super_.call(this, {
    uuid: '5678',
    properties: ['read', 'notify'],
    value: null
  });

  this._value = new Buffer([17,0,0,0]);
  this._interval = null;
  this._updateValueCallback = null;
};

util.inherits(CountCharacteristic, BlenoCharacteristic);

CountCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('CountCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

CountCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('CountCharacteristic - onSubscribe');

  // start counting
  this._interval = setInterval(this.increment.bind(this), 5000);

  this._updateValueCallback = updateValueCallback;
};

CountCharacteristic.prototype.onUnsubscribe = function() {
  console.log('CountCharacteristic - onUnsubscribe');

  // stop counting
  clearInterval(this._interval);

  this._updateValueCallback = null;
};

CountCharacteristic.prototype.increment = function() {
    var count = this._value.readUInt32LE() + 1;
    console.log(count);
    this._value.writeUInt32LE(count);
    // this._isinsane
    this._updateValueCallback(this._value);
};

module.exports = CountCharacteristic;
