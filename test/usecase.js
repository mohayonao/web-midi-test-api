import assert from "power-assert";
import sinon from "sinon";
import WebMIDITestAPI from "../src";

describe("usecase", () => {
  it("midi-in", () => {
    let api = new WebMIDITestAPI();
    let device = api.createMIDIDevice();
    let { requestMIDIAccess } = api;
    let input, onmidimessage;

    return requestMIDIAccess().then((access) => {
      input = access.inputs.values().next().value;
      onmidimessage = sinon.spy();

      input.onmidimessage = onmidimessage;

      return input.open();
    }).then(() => {
      assert(input.connection === "open");

      return device.outputs[0].send([ 0x90, 0x00, 0x00 ]);
    }).then(() => {
      assert(onmidimessage.calledOnce);
      assert.deepEqual(onmidimessage.args[0][0].data, new Uint8Array([ 0x90, 0x00, 0x00 ]));
      onmidimessage.reset();
    }).then(() => {
      return input.close();
    }).then(() => {
      assert(input.connection === "closed");

      return device.outputs[0].send([ 0x90, 0x00, 0x00 ]);
    }).then(() => {
      assert(!onmidimessage.called);
    });
  });
  it("midi-out", () => {
    let api = new WebMIDITestAPI();
    let device = api.createMIDIDevice();
    let { requestMIDIAccess } = api;
    let output, onmidimessage = sinon.spy();

    device.inputs[0].onmidimessage = onmidimessage;

    return requestMIDIAccess().then((access) => {
      output = access.outputs.values().next().value;

      return output.open();
    }).then(() => {
      assert(output.connection === "open");

      return output.send([ 0x90, 0x00, 0x00 ]);
    }).then(() => {
      assert(onmidimessage.calledOnce);
      assert.deepEqual(onmidimessage.args[0][0].data, new Uint8Array([ 0x90, 0x00, 0x00 ]));
      onmidimessage.reset();
    }).then(() => {
      return output.close();
    }).then(() => {
      assert(output.connection === "closed");

      return output.send([ 0x90, 0x00, 0x00 ]);
    }).then(() => {
      assert(!onmidimessage.called);
    });
  });
});
