"use strict";

const assert = require("assert");
const test = require("eatest");
const sinon = require("sinon");
const WebMIDITestAPI = require("../src/WebMIDITestAPI");
const MIDIAccess = require("../src/MIDIAccess");
const MIDIPort = require("../src/MIDIPort");
const MIDIInput = require("../src/MIDIInput");
const MIDIDevice = require("../src/MIDIDevice");

test("new MIDIInput(access: MIDIAccess, port: MIDIDevice.MessagePort)", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const port = new MIDIDevice.MessagePort({}, "input");
  const input = new MIDIInput(access, port);

  assert(input instanceof MIDIPort);
  assert(input instanceof MIDIInput);
});

test("#type: string", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const port = new MIDIDevice.MessagePort({}, "input");
  const input = new MIDIInput(access, port);

  assert(input.type === "input");
});

test("#onmidimessage: EventHandler", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const port = new MIDIDevice.MessagePort({}, "input");
  const input = new MIDIInput(access, port);
  const onmidimessage = sinon.spy();
  const event = {};

  input.onmidimessage = onmidimessage;
  input.onmidimessage = {};
  assert(input.onmidimessage === onmidimessage);

  return Promise.resolve().then(() => {
    return input.open();
  }).then(() => {
    port.emit("midimessage", event);
    assert(onmidimessage.callCount === 1);
    assert(onmidimessage.args[0][0] === event);
    onmidimessage.reset();
  }).then(() => {
    return input.close();
  }).then(() => {
    port.emit("midimessage", event);
    assert(onmidimessage.callCount === 0);
  });
});

test("#onmidimessage: EventHandler = null", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const port = new MIDIDevice.MessagePort({}, "input");
  const input = new MIDIInput(access, port);
  const event = {};

  input.onmidimessage = null;
  input.onmidimessage = {};
  assert(input.onmidimessage === null);

  return Promise.resolve().then(() => {
    return input.open();
  }).then(() => {
    assert.doesNotThrow(() => {
      port.emit("midimessage", event);
    });
  });
});
