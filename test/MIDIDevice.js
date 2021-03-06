"use strict";

const assert = require("assert");
const test = require("eatest");
const sinon = require("sinon");
const events = require("events");
const WebMIDITestAPI = require("../src/WebMIDITestAPI");
const MIDIDevice = require("../src/MIDIDevice");

test("new MIDIDevice(api, opts = {})", () => {
  const api = new WebMIDITestAPI();
  const device = new MIDIDevice(api);

  assert(device instanceof MIDIDevice);
});

test("#state: string", () => {
  const api = new WebMIDITestAPI();
  const device = new MIDIDevice(api);

  assert(device.state === "disconnected");

  device.connect();
  assert(device.state === "connected");
});

test("#numberOfInputs: number", () => {
  const api = new WebMIDITestAPI();
  const device = new MIDIDevice(api);

  assert(device.numberOfInputs === 1);
});

test("#numberOfOutputs: number", () => {
  const api = new WebMIDITestAPI();
  const device = new MIDIDevice(api);

  assert(device.numberOfOutputs === 1);
});

test("#inputs: MIDIDevice.MessagePort[]", () => {
  const api = new WebMIDITestAPI();
  const device = new MIDIDevice(api, { numberOfInputs: 2 });

  assert(device.inputs !== device.inputs);
  assert.deepEqual(device.inputs, device.inputs);
  assert(device.inputs[0] !== device.inputs[1]);
  assert(device.inputs[0] instanceof MIDIDevice.MessagePort);
  assert(device.inputs[1] instanceof MIDIDevice.MessagePort);
});

test("#outputs: MIDIDevice.MessagePort[]", () => {
  const api = new WebMIDITestAPI();
  const device = new MIDIDevice(api, { numberOfOutputs: 2 });

  assert(device.outputs !== device.outputs);
  assert.deepEqual(device.outputs, device.outputs);
  assert(device.outputs[0] !== device.outputs[1]);
  assert(device.outputs[0] instanceof MIDIDevice.MessagePort);
  assert(device.outputs[1] instanceof MIDIDevice.MessagePort);
});

test("#connect(): void", () => {
  const api = new WebMIDITestAPI();
  const device = new MIDIDevice(api);
  const onconnected = sinon.spy();

  device.on("connected", onconnected);
  device.disconnect();
  assert(onconnected.callCount === 0);

  device.connect();
  assert(onconnected.callCount === 1);
  onconnected.reset();

  device.connect();
  assert(onconnected.callCount === 0);
});

test("#disconnect(): void", () => {
  const api = new WebMIDITestAPI();
  const device = new MIDIDevice(api);
  const ondisconnected = sinon.spy();

  device.on("disconnected", ondisconnected);

  device.disconnect();
  assert(ondisconnected.callCount === 0);

  device.connect();

  device.disconnect();
  assert(ondisconnected.callCount === 1);
});

test("new MIDIDevice.MessageChannel(device: MIDIDevice)", () => {
  const device = { manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const channel = new MIDIDevice.MessageChannel(device);

  assert(channel instanceof MIDIDevice.MessageChannel);
  assert(channel.device === device);
  assert(typeof channel.id === "string");
  assert(typeof channel.name === "string");
  assert(typeof channel.version === "string");
  assert(channel.input instanceof MIDIDevice.MessagePort);
  assert(channel.output instanceof MIDIDevice.MessagePort);
  assert(channel.input.target === channel.output);
  assert(channel.output.target === channel.input);
});

test("#state", () => {
  const device = { manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const channel = new MIDIDevice.MessageChannel(device);

  assert(channel.state === "connected");

  device.state = "disconnected";
  assert(channel.state === "disconnected");
});

test("new MIDIDevice.MessagePort(channel: MIDIDevice.MessageChannel)", () => {
  const channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const port = new MIDIDevice.MessagePort(channel, "input");

  assert(port instanceof MIDIDevice.MessagePort);
  assert(port.channel === channel);
});

test("#id: string", () => {
  const channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const port = new MIDIDevice.MessagePort(channel, "input");

  assert(port.id === "00000000");
});

test("#manufacturer: string", () => {
  const channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const port = new MIDIDevice.MessagePort(channel, "input");

  assert(port.manufacturer === "manufacturer");
});

test("#name: string", () => {
  const channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const port = new MIDIDevice.MessagePort(channel, "input");

  assert(port.name === "name");
});

test("#type: string", () => {
  const channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const port = new MIDIDevice.MessagePort(channel, "input");

  assert(port.type === "input");
});

test("#version: string", () => {
  const channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const port = new MIDIDevice.MessagePort(channel, "input");

  assert(port.version === "version");
});

test("#state", () => {
  const channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const port = new MIDIDevice.MessagePort(channel, "input");

  assert(port.state === "connected");

  channel.state = "disconnected";
  assert(port.state === "disconnected");
});

test("#onmidimessage: EventHandler", () => {
  const channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const port = new MIDIDevice.MessagePort(channel, "input");
  const onmidimessage = sinon.spy();
  const event = {};

  port.onmidimessage = onmidimessage;
  port.onmidimessage = {};
  assert(port.onmidimessage === onmidimessage);

  port.emit("midimessage", event);
  assert(onmidimessage.callCount === 1);
  assert(onmidimessage.args[0][0] === event);
});

test("#onmidimessage: EventHandler = null", () => {
  const channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const port = new MIDIDevice.MessagePort(channel, "input");
  const event = {};

  port.onmidimessage = null;
  port.onmidimessage = {};

  assert(port.onmidimessage === null);
  assert.doesNotThrow(() => {
    port.emit("midimessage", event);
  });
});

test("#send(data: number[], timestamp: number): void", () => {
  const channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const port = new MIDIDevice.MessagePort(channel, "input");
  const onmidimessage = sinon.spy();

  port.target = new events.EventEmitter();
  port.target.on("midimessage", onmidimessage);

  port.send([ 0x90, 0x30, 0x64 ]);

  return Promise.resolve().then(() => {
    assert(onmidimessage.callCount === 1);
    assert(typeof onmidimessage.args[0][0].receivedTime === "number");
    assert.deepEqual(onmidimessage.args[0][0].data, new Uint8Array([ 0x90, 0x30, 0x64 ]));
    onmidimessage.reset();

    channel.state = "disconnected";
    port.send([ 0x90, 0x30, 0x64 ]);
    assert(onmidimessage.callCount === 0);

    assert.throws(() => {
      port.send([ 0x00, 0x00, 0x00 ]);
    }, TypeError);
  });
});

test("#clear(): void", () => {
  const channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  const port = new MIDIDevice.MessagePort(channel, "input");

  assert.doesNotThrow(() => {
    port.clear();
  });
});
