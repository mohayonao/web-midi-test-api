"use strict";

const assert = require("power-assert");
const sinon = require("sinon");
const WebMIDITestAPI = require("../src");

describe("usecase", () => {
  it("midi-in", () => {
    const api = new WebMIDITestAPI();
    const device = api.createMIDIDevice();
    let input;

    return api.requestMIDIAccess().then((access) => {
      input = access.inputs.values().next().value;

      input.onmidimessage = sinon.spy();

      return input.open();
    }).then(() => {
      assert(input.connection === "open");

      return device.outputs[0].send([ 0x90, 0x00, 0x00 ]);
    }).then(() => {
      assert(input.onmidimessage.callCount === 1);

      const message = input.onmidimessage.args[0][0].data;

      assert.deepEqual(message, new Uint8Array([ 0x90, 0x00, 0x00 ]));

      input.onmidimessage.reset();

      return input.close();
    }).then(() => {
      assert(input.connection === "closed");

      return device.outputs[0].send([ 0x90, 0x00, 0x00 ]);
    }).then(() => {
      assert(input.onmidimessage.callCount === 0);
    });
  });
  it("midi-out", () => {
    const api = new WebMIDITestAPI();
    const device = api.createMIDIDevice();
    let output;

    device.inputs[0].onmidimessage = sinon.spy();

    return api.requestMIDIAccess().then((access) => {
      output = access.outputs.values().next().value;

      return output.open();
    }).then(() => {
      assert(output.connection === "open");

      return output.send([ 0x90, 0x00, 0x00 ]);
    }).then(() => {
      assert(device.inputs[0].onmidimessage.callCount === 1);

      const message = device.inputs[0].onmidimessage.args[0][0].data;

      assert.deepEqual(message, new Uint8Array([ 0x90, 0x00, 0x00 ]));

      device.inputs[0].onmidimessage.reset();
    }).then(() => {
      return output.close();
    }).then(() => {
      assert(output.connection === "closed");

      return output.send([ 0x90, 0x00, 0x00 ]);
    }).then(() => {
      assert(device.inputs[0].onmidimessage.callCount === 0);
    });
  });
});
