"use strict";

const assert = require("assert");
const test = require("eatest");
const WebMIDITestAPI = require("../src/WebMIDITestAPI");
const MIDIAccess = require("../src/MIDIAccess");
const MIDIPort = require("../src/MIDIPort");
const MIDIOutput = require("../src/MIDIOutput");
const MIDIDevice = require("../src/MIDIDevice");

test("new MIDIOutput(access: MIDIAccess, port: MIDIDevice.MessagePort)", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const port = new MIDIDevice.MessagePort({}, "output");
  const output = new MIDIOutput(access, port);

  assert(output instanceof MIDIPort);
  assert(output instanceof MIDIOutput);
});

test("#type: string", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const port = new MIDIDevice.MessagePort({}, "output");
  const output = new MIDIOutput(access, port);

  assert(output.type === "output");
});

test("#send(data: number[]): void", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const port = new MIDIDevice.MessagePort({}, "output");
  const output = new MIDIOutput(access, port);

  assert.doesNotThrow(() => {
    output.send([ 0x90, 0x30, 0x64 ]);
  });

  assert.throws(() => {
    output.send([ 0x00, 0x00, 0x00 ]);
  }, TypeError);
});

test("#send(data: number[]): void / sysex:false", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api, { sysex: false });
  const port = new MIDIDevice.MessagePort({}, "output");
  const output = new MIDIOutput(access, port);

  assert.throws(() => {
    output.send([ 0xf0, 0x00, 0x20, 0x29, 0x02, 0x0a, 0x78 ]);
  }, Error);
});

test("#send(data: number[]): void / sysex:true", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api, { sysex: true });
  const port = new MIDIDevice.MessagePort({}, "output");
  const output = new MIDIOutput(access, port);

  assert.doesNotThrow(() => {
    output.send([ 0xf0, 0x00, 0x20, 0x29, 0x02, 0x0a, 0x78 ]);
  }, Error);
});

test("#clear(): void", () => {
  const api = new WebMIDITestAPI();
  const access = new MIDIAccess(api);
  const port = new MIDIDevice.MessagePort({}, "output");
  const output = new MIDIOutput(access, port);

  assert.doesNotThrow(() => {
    output.clear();
  });
});
