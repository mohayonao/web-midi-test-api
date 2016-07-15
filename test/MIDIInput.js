"use strict";

const assert = require("assert");
const test = require("eatest");
const sinon = require("sinon");
const events = require("events");
const MIDIAccess = require("../src/MIDIAccess");
const MIDIPort = require("../src/MIDIPort");
const MIDIInput = require("../src/MIDIInput");
const MIDIDevice = require("../src/MIDIDevice");

test("new MIDIInput(access: MIDIAccess, port: MIDIDevice.MessagePort)", () => {
  const access = new MIDIAccess(new events.EventEmitter());
  const port = new MIDIDevice.MessagePort({}, "input");
  const input = new MIDIInput(access, port);

  assert(input instanceof MIDIPort);
  assert(input instanceof MIDIInput);
});

test("#type: string", () => {
  const access = new MIDIAccess(new events.EventEmitter());
  const port = new MIDIDevice.MessagePort({}, "input");
  const input = new MIDIInput(access, port);

  assert(input.type === "input");
});

test("#onmidimessage: EventHandler", () => {
  const access = new MIDIAccess(new events.EventEmitter());
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
    assert(onmidimessage.calledOnce);
    assert(onmidimessage.args[0][0] === event);
    onmidimessage.reset();
  }).then(() => {
    return input.close();
  }).then(() => {
    port.emit("midimessage", event);
    assert(!onmidimessage.called);
  });
});

test("#onmidimessage: EventHandler = null", () => {
  const access = new MIDIAccess(new events.EventEmitter());
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
