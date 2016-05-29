"use strict";

const assert = require("power-assert");
const WebMIDITestAPI = require("../src/WebMIDITestAPI");
const MIDIAccess = require("../src/MIDIAccess");
const MIDIDevice = require("../src/MIDIDevice");

describe("WebMIDITestAPI", () => {
  describe("constructor()", () => {
    it("works", () => {
      const api = new WebMIDITestAPI();

      assert(api instanceof WebMIDITestAPI);
      assert(typeof api.requestMIDIAccess === "function");
    });
  });
  describe("#inputs: MIDIDeviceMessagePort[]", () => {
    it("works", () => {
      const api = new WebMIDITestAPI();

      assert.deepEqual(api.inputs, []);
    });
  });
  describe("#outputs: MIDIDeviceMessagePort[]", () => {
    it("works", () => {
      const api = new WebMIDITestAPI();

      assert.deepEqual(api.outputs, []);
    });
  });
  describe("#createMIDIDevice(opts: any): MIDIDevice", () => {
    it("works", () => {
      const api = new WebMIDITestAPI();
      const device = api.createMIDIDevice();

      assert(device instanceof MIDIDevice);
    });
  });
  describe("#requestMIDIAccess(opts: any): Promise<MIDIAccess>", () => {
    it("works", () => {
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
  });
});
