"use strict";

const assert = require("assert");
const test = require("eatest");
const WebMIDITestAPI = require("../src/WebMIDITestAPI");
const MIDIAccess = require("../src/MIDIAccess");
const MIDIDevice = require("../src/MIDIDevice");

test("new WebMIDITestAPI()", () => {
  const api = new WebMIDITestAPI();

  assert(api instanceof WebMIDITestAPI);
  assert(typeof api.requestMIDIAccess === "function");
});

test("#devices: MIDIDevice[]", () => {
  const api = new WebMIDITestAPI();

  assert.deepEqual(api.devices, []);
});

test("#inputs: MIDIDevice.MessagePort[]", () => {
  const api = new WebMIDITestAPI();

  assert.deepEqual(api.inputs, []);
});

test("#outputs: MIDIDevice.MessagePort[]", () => {
  const api = new WebMIDITestAPI();

  assert.deepEqual(api.outputs, []);
});

test("#createMIDIDevice(opts: any): MIDIDevice", () => {
  const api = new WebMIDITestAPI();
  const device = api.createMIDIDevice();

  assert(device instanceof MIDIDevice);
});

test("#requestMIDIAccess(opts: any): Promise<MIDIAccess>", () => {
  const api = new WebMIDITestAPI();
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
