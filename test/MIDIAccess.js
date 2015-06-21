import assert from "power-assert";
import sinon from "sinon";
import WebMIDITestAPI from "../src/WebMIDITestAPI";
import EventEmitter from "../src/EventEmitter";
import MIDIAccess from "../src/MIDIAccess";

describe("MIDIAccess", () => {
  let api;

  beforeEach(() => {
    api = new WebMIDITestAPI();
  });

  describe("constructor(api: WebMIDITestAPI, opts = {})", () => {
    it("works", () => {
      let access = new MIDIAccess(api);

      assert(access instanceof EventEmitter);
      assert(access instanceof MIDIAccess);
      assert(access.$api === api);
    });
  });
  describe("#inputs: Map<string, MIDIInput>", () => {
    it("works", () => {
      let access = new MIDIAccess(api);

      api.createMIDIDevice({ numberOfOutputs: 2 });
      assert(access.inputs instanceof Map);
      assert(access.inputs.size === 2);
    });
  });
  describe("#outputs: Map<string, MIDIOutput>", () => {
    it("works", () => {
      let access = new MIDIAccess(api);

      api.createMIDIDevice({ numberOfInputs: 2 });
      assert(access.outputs instanceof Map);
      assert(access.outputs.size === 2);
    });
  });
  describe("#onstatechange: EventHandler", () => {
    it("works", () => {
      let access = new MIDIAccess(api);
      let onstatechange = sinon.spy();
      let event = {};

      access.onstatechange = onstatechange;
      access.onstatechange = {};
      assert(access.onstatechange === onstatechange);

      access.emit("statechange", event);
      assert(onstatechange.calledOnce);
      assert(onstatechange.args[0][0] === event);
    });
    it("null", () => {
      let access = new MIDIAccess(api);
      let event = {};

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
      let access1 = new MIDIAccess(api);
      let access2 = new MIDIAccess(api, { sysex: true });

      assert(access1.sysexEnabled === false);
      assert(access2.sysexEnabled === true);
    });
  });
});
