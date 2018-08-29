"use strict";

const assert = require("assert");
const test = require("eatest");
const sinon = require("sinon");
const WebMIDITestAPI = require("../src/WebMIDITestAPI");
const MIDIAccess = require("../src/MIDIAccess");
const MIDIPort = require("../src/MIDIPort");
const MIDIDevice = require("../src/MIDIDevice");

test("new MIDIPort(access: MIDIAccess, port: MIDIDevice.MessagePort)", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = new MIDIDevice(api);
  const port = device.inputs[0];
  const input = new MIDIPort(access, port);

  assert(input instanceof MIDIPort);
  assert(input.$access === access);
  assert(input.$port === port);
});

test("#id: string", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = new MIDIDevice(api);
  const port = device.inputs[0];
  const input = new MIDIPort(access, port);

  assert(input.id === port.id);
});

test("#manufacturer: string", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = new MIDIDevice(api);
  const port = device.inputs[0];
  const input = new MIDIPort(access, port);

  assert(input.manufacturer === port.manufacturer);
});

test("#name: string", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = new MIDIDevice(api);
  const port = device.inputs[0];
  const input = new MIDIPort(access, port);

  assert(input.name === port.name);
});

test("#type: string", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = new MIDIDevice(api);
  const port = device.inputs[0];
  const input = new MIDIPort(access, port);

  assert(input.type === port.type);
});

test("#version: string", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = new MIDIDevice(api);
  const port = device.inputs[0];
  const input = new MIDIPort(access, port);

  assert(input.version === port.version);
});

test("#state: string", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = new MIDIDevice(api);
  const port = device.inputs[0];
  const input = new MIDIPort(access, port);

  assert(input.state === port.state);
});

test("#connection: string", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = new MIDIDevice(api);
  const port = device.inputs[0];
  const input = new MIDIPort(access, port);

  assert(input.connection === "closed");
});

test("#onstatechange: EventHandler", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = new MIDIDevice(api);
  const port = device.inputs[0];
  const input = new MIDIPort(access, port);
  const onstatechange = sinon.spy();
  const event = {};

  input.onstatechange = onstatechange;
  input.onstatechange = {};
  assert(input.onstatechange === onstatechange);

  input.emit("statechange", event);
  assert(onstatechange.callCount === 1);
  assert(onstatechange.args[0][0] === event);
});

test("#onstatechange: EventHandler = null", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = new MIDIDevice(api);
  const port = device.inputs[0];
  const input = new MIDIPort(access, port);
  const event = {};

  input.onstatechange = null;
  input.onstatechange = {};

  assert(input.onstatechange === null);
  assert.doesNotThrow(() => {
    input.emit("statechange", event);
  });
});

test("#addEventListener(type: string, callback: function): void", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = new MIDIDevice(api);
  const port = device.inputs[0];
  const input = new MIDIPort(access, port);
  const onstatechange = sinon.spy();
  const event = {};

  input.addEventListener("statechange", onstatechange);

  input.emit("statechange", event);
  assert(onstatechange.callCount === 1);
  assert(onstatechange.args[0][0] === event);
});

test("#removeEventListener(type: string, callback: function): void", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = new MIDIDevice(api);
  const port = device.inputs[0];
  const input = new MIDIPort(access, port);
  const onstatechange = sinon.spy();
  const event = {};

  input.addEventListener("statechange", onstatechange);
  input.removeEventListener("statechange", onstatechange);

  input.emit("statechange", event);
  assert(onstatechange.callCount === 0);
});

test("#open(): Promise<MIDIPort>", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = api.createMIDIDevice();
  const input = access.inputs.values().next().value

  access.onstatechange = sinon.spy();
  input.onstatechange = sinon.spy();

  return Promise.resolve().then(() => {
    return device.connect();
  }).then(() => {
    return input.open();
  }).then((value) => {
    assert(value === input);
    assert(input.connection === "open");
    assert(access.onstatechange.callCount === 1);
    assert(access.onstatechange.args[0][0].port === input);
    assert(input.onstatechange.callCount === 1);
    assert(input.onstatechange.args[0][0].port === input);

    access.onstatechange.reset();
    input.onstatechange.reset();

    return input.open();
  }).then((value) => {
    assert(value === input);
    assert(input.connection === "open");
    assert(access.onstatechange.callCount === 0);
    assert(input.onstatechange.callCount === 0);
  });
});

test("#open(): Promise<MIDIPort> / pending", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = api.createMIDIDevice();
  const input = access.inputs.values().next().value

  access.onstatechange = sinon.spy();
  input.onstatechange = sinon.spy();

  return Promise.resolve().then(() => {
    return device.disconnect();
  }).then(() => {
    return input.open();
  }).then((value) => {
    assert(value === input);
    assert(input.connection === "pending");
    assert(access.onstatechange.callCount === 3);
    assert(access.onstatechange.args[1][0].port === input);
    assert(access.onstatechange.args[2][0].port === input);
    assert(input.onstatechange.callCount === 2);
    assert(input.onstatechange.args[0][0].port === input);
    assert(input.onstatechange.args[1][0].port === input);

    access.onstatechange.reset();
    input.onstatechange.reset();

    return input.open();
  }).then((value) => {
    assert(value === input);
    assert(input.connection === "pending");
    assert(access.onstatechange.callCount === 0);
    assert(input.onstatechange.callCount === 0);
  });
});

test("#open(): Promise<MIDIPort> / pending -> open", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = api.createMIDIDevice();
  const input = access.inputs.values().next().value

  access.onstatechange = sinon.spy();
  input.onstatechange = sinon.spy();

  return Promise.resolve().then(() => {
    return device.disconnect();
  }).then(() => {
    return input.open();
  }).then((value) => {
    assert(value === input);
    assert(input.connection === "pending");
    assert(access.onstatechange.callCount === 3);
    assert(access.onstatechange.args[1][0].port === input);
    assert(access.onstatechange.args[2][0].port === input);
    assert(input.onstatechange.callCount === 2);
    assert(input.onstatechange.args[0][0].port === input);
    assert(input.onstatechange.args[1][0].port === input);

    access.onstatechange.reset();
    input.onstatechange.reset();

    return device.connect();
  }).then(() => {
    assert(input.connection === "open");
    assert(access.onstatechange.callCount === 2);
    assert(access.onstatechange.args[1][0].port === input);
    assert(input.onstatechange.callCount === 1);
    assert(input.onstatechange.args[0][0].port === input);
  });
});

test("#close(): Promise<MIDIPort>", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = api.createMIDIDevice();
  const input = access.inputs.values().next().value

  access.onstatechange = sinon.spy();
  input.onstatechange = sinon.spy();

  return Promise.resolve().then(() => {
    return device.connect();
  }).then(() => {
    return input.open();
  }).then((value) => {
    assert(value === input);
    assert(input.connection === "open");

    access.onstatechange.reset();
    input.onstatechange.reset();

    return input.close();
  }).then((value) => {
    assert(value === input);
    assert(input.connection === "closed");
    assert(access.onstatechange.callCount === 1);
    assert(access.onstatechange.args[0][0].port === input);
    assert(input.onstatechange.callCount === 1);
    assert(input.onstatechange.args[0][0].port === input);

    access.onstatechange.reset();
    input.onstatechange.reset();

    return input.close();
  }).then((value) => {
    assert(value === input);
    assert(input.connection === "closed");
    assert(access.onstatechange.callCount === 0);
    assert(input.onstatechange.callCount === 0);
  });
});

test("#close(): Promise<MIDIPort> / open -> closed", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const device = api.createMIDIDevice();
  const input = access.inputs.values().next().value

  access.onstatechange = sinon.spy();
  input.onstatechange = sinon.spy();

  return Promise.resolve().then(() => {
    return device.connect();
  }).then(() => {
    return input.open();
  }).then((value) => {
    assert(value === input);
    assert(input.connection === "open");

    access.onstatechange.reset();
    input.onstatechange.reset();

    return device.disconnect();
  }).then(() => {
    assert(input.connection === "closed");
    assert(access.onstatechange.callCount === 2);
    assert(access.onstatechange.args[1][0].port === input);
    assert(input.onstatechange.callCount === 1);
    assert(input.onstatechange.args[0][0].port === input);

    access.onstatechange.reset();
    input.onstatechange.reset();

    return device.connect();
  }).then(() => {
    assert(input.connection === "closed");
    assert(access.onstatechange.callCount === 2);
    assert(input.onstatechange.callCount === 1);
  });
});
