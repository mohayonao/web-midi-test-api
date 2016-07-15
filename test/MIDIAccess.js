"use strict";

const assert = require("assert");
const test = require("eatest");
const sinon = require("sinon");
const WebMIDITestAPI = require("../src/WebMIDITestAPI");
const MIDIAccess = require("../src/MIDIAccess");

test("new MIDIAccess(api: WebMIDITestAPI, opts = {})", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);

  assert(access instanceof MIDIAccess);
  assert(access.$api === api);
})

test("#inputs: Map<string, MIDIInput>", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);

  api.createMIDIDevice({ numberOfOutputs: 2 });
  assert(access.inputs instanceof Map);
  assert(access.inputs.size === 2);
});

test("#outputs: Map<string, MIDIOutput>", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);

  api.createMIDIDevice({ numberOfInputs: 2 });
  assert(access.outputs instanceof Map);
  assert(access.outputs.size === 2);
});

test("#onstatechange: EventHandler", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const onstatechange = sinon.spy();
  const event = {};

  access.onstatechange = onstatechange;
  access.onstatechange = {};
  assert(access.onstatechange === onstatechange);

  access.emit("statechange", event);
  assert(onstatechange.calledOnce);
  assert(onstatechange.args[0][0] === event);
});

test("#onstatechange: EventHandler = null", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const event = {};

  access.onstatechange = null;
  access.onstatechange = {};

  assert(access.onstatechange === null);
  assert.doesNotThrow(() => {
    access.emit("statechange", event);
  });
});

test("#addEventListener(type: string, callback: function): void", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const onstatechange = sinon.spy();
  const event = {};

  access.addEventListener("statechange", onstatechange);

  access.emit("statechange", event);
  assert(onstatechange.calledOnce);
  assert(onstatechange.args[0][0] === event);
});

test("#removeEventListener(type: string, callback: function): void", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const onstatechange = sinon.spy();
  const event = {};

  access.addEventListener("statechange", onstatechange);
  access.removeEventListener("statechange", onstatechange);

  access.emit("statechange", event);
  assert(onstatechange.callCount === 0);
});

test("#sysexEnabled: boolean", () => {
  const api = new WebMIDITestAPI();
  const access1 = new MIDIAccess(api);
  const access2 = new MIDIAccess(api, { sysex: true });

  assert(access1.sysexEnabled === false);
  assert(access2.sysexEnabled === true);
});

test("statechange / MIDIConnectionEvent", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const onstatechange = sinon.spy();

  access.onstatechange = onstatechange;
  access.onstatechange = {};
  assert(access.onstatechange === onstatechange);

  const device = api.createMIDIDevice({ name: "Test Device" });

  assert(onstatechange.callCount === 2);
  assert(onstatechange.args[0][0].port.name === device.name);
  assert(onstatechange.args[0][0].port.name === device.name);
});
