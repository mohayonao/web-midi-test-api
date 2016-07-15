"use strict";

const assert = require("assert");
const test = require("eatest");
const api = require("../src/WebMIDITestAPI");
const MIDIAccess = require("../src/MIDIAccess");
const MIDIDevice = require("../src/MIDIDevice");

test(".MIDIDevice", () => {
  const device = new api.MIDIDevice();

  assert(device instanceof MIDIDevice);
  assert(device instanceof api.MIDIDevice);
  assert(device.state === "disconnected");
});

test(".devices: MIDIDevice[]", () => {
  assert.deepEqual(api.devices, []);
});

test(".inputs: MIDIDevice.MessagePort[]", () => {
  assert.deepEqual(api.inputs, []);
});

test(".outputs: MIDIDevice.MessagePort[]", () => {
  assert.deepEqual(api.outputs, []);
});

test(".createMIDIDevice(opts: any): MIDIDevice", () => {
  const device = api.createMIDIDevice();

  assert(device instanceof MIDIDevice);
  assert(device instanceof api.MIDIDevice);
  assert(device.state === "connected");
});

test("#requestMIDIAccess(opts: any): Promise<MIDIAccess>", () => {
  const navigator = { requestMIDIAccess: api.requestMIDIAccess };

  return Promise.all([
    api.requestMIDIAccess(),
    navigator.requestMIDIAccess()
  ]).then((items) => {
    assert(items[0] !== items[1]);
    assert(items[0] instanceof MIDIAccess);
    assert(items[1] instanceof MIDIAccess);
  });
});
