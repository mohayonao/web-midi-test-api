"use strict";

const assert = require("power-assert");
const sinon = require("sinon");
const WebMIDITestAPI = require("../src/WebMIDITestAPI");
const MIDIAccess = require("../src/MIDIAccess");

describe("MIDIAccess", () => {
  let api;

  beforeEach(() => {
    api = new WebMIDITestAPI();
  });

  describe("constructor(api: WebMIDITestAPI, opts = {})", () => {
    it("works", () => {
      const access = new MIDIAccess(api);

      assert(access instanceof MIDIAccess);
      assert(access.$api === api);
    });
  });
  describe("#inputs: Map<string, MIDIInput>", () => {
    it("works", () => {
      const access = new MIDIAccess(api);

      api.createMIDIDevice({ numberOfOutputs: 2 });
      assert(access.inputs instanceof Map);
      assert(access.inputs.size === 2);
    });
  });
  describe("#outputs: Map<string, MIDIOutput>", () => {
    it("works", () => {
      const access = new MIDIAccess(api);

      api.createMIDIDevice({ numberOfInputs: 2 });
      assert(access.outputs instanceof Map);
      assert(access.outputs.size === 2);
    });
  });
  describe("#onstatechange: EventHandler", () => {
    it("works", () => {
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
    it("null", () => {
      const access = new MIDIAccess(api);
      const event = {};

      access.onstatechange = null;
      access.onstatechange = {};

      assert(access.onstatechange === null);
      assert.doesNotThrow(() => {
        access.emit("statechange", event);
      });
    });
  });
  describe("#sysexEnabled: boolean", () => {
    it("works", () => {
      const access1 = new MIDIAccess(api);
      const access2 = new MIDIAccess(api, { sysex: true });

      assert(access1.sysexEnabled === false);
      assert(access2.sysexEnabled === true);
    });
  });
});
