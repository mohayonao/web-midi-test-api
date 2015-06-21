import assert from "power-assert";
import EventEmitter from "../src/EventEmitter";
import WebMIDITestAPI from "../src/WebMIDITestAPI";
import MIDIAccess from "../src/MIDIAccess";
import MIDIDevice from "../src/MIDIDevice";

describe("WebMIDITestAPI", () => {
  describe("constructor()", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();

      assert(api instanceof EventEmitter);
      assert(api instanceof WebMIDITestAPI);
      assert(typeof api.requestMIDIAccess === "function");
    });
  });
  describe("#inputs: MIDIDeviceMessagePort[]", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();

      assert.deepEqual(api.inputs, []);
    });
  });
  describe("#outputs: MIDIDeviceMessagePort[]", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();

      assert.deepEqual(api.outputs, []);
    });
  });
  describe("#createMIDIDevice(opts: any): MIDIDevice", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();
      let device = api.createMIDIDevice();

      assert(device instanceof MIDIDevice);
    });
  });
  describe("#requestMIDIAccess(opts: any): Promise<MIDIAccess>", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();
      let navigator = { requestMIDIAccess: api.requestMIDIAccess };

      return Promise.all([
        api.requestMIDIAccess(),
        navigator.requestMIDIAccess(),
      ]).then(([ access1, access2 ]) => {
        assert(access1 !== access2);
        assert(access1 instanceof MIDIAccess);
        assert(access1 instanceof MIDIAccess);
      });
    });
  });
});
