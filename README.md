# web-midi-test-api
[![Build Status](http://img.shields.io/travis/mohayonao/web-midi-test-api.svg?style=flat-square)](https://travis-ci.org/mohayonao/web-midi-test-api)
[![NPM Version](http://img.shields.io/npm/v/web-midi-test-api.svg?style=flat-square)](https://www.npmjs.org/package/web-midi-test-api)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> Web MIDI API for CI

## API

#### Static methods
- `requestMIDIAccess(opts = {}): Promise<MIDIAccess>`
  - `opts.sysex: boolean`
- `createMIDIDevice(opts = {}): MIDIDevice`
  - create a mock MIDI instrument and register it to api
  - `opts.numberOfInputs: number` number of input MIDI ports - _default: **1**_
  - `opts.numberOfOutputs: number` number of output MIDI ports - _default: **1**_
  - `opts.manufacturer: string` _default: **""**_
  - `opts.name: string` _default: **"Web MIDI Test API"**_
- `devices: MIDIDevice[]`
  - all registered MIDIDevices
- `inputs: MIDIPort[]`
  - all registered input MIDIPorts
- `outputs: MIDIPort[]`
  - all registered output MIDIPorts

### MIDIDevice
`MIDIDevice` is a mock of MIDI instrument (e.g. hardware/software synthesizer or DAW).

#### Instance attributes
- `manufacturer: string`
- `name: string`
- `version: string`
- `state: string`
- `numberOfInputs: number`
- `numberOfOutputs: number`
- `inputs: MIDIPort[]`
- `outputs: MIDIPort[]`

#### Instance methods
- `connect(): void`
- `disconnect(): void`

### MIDIPort
`MIDIPort` is a mock of MIDI messaging port.

#### Instance attributes
- `id: string`
- `manufacturer: string`
- `name: string`
- `type: string` ("input" or "output")
- `version: string`
- `state: string`
- `onmidimessage: function`

#### Instance methods
- `send(data: number[], [timestamp: number]): void`

## How to use

MIDI-IN (test mock -> WebMIDIAPI)

```js
const api = require("web-midi-test-api");
const device = api.createMIDIDevice();

api.requestMIDIAccess().then((access) => {
  const input = access.inputs.values().next().value;

  input.onmidimessage = sinon.spy();
  device.outputs[0].send([ 0x90, 0x30, 0x64 ]);

  const message = input.onmidimessage.args[0][0].data;

  assert.deepEqual(message, new Uint8Array([ 0x90, 0x30, 0x64 ]));
});
```

MIDI-OUT (WebMIDIAPI -> test mock)

```js
const api = require("web-midi-test-api");
const device = api.createMIDIDevice();

device.inputs[0].onmidimessage = sinon.spy();

api.requestMIDIAccess().then((access) => {
  const output = access.outputs.values().next().value;

  output.send([ 0x90, 0x00, 0x00 ]);

  const message = device.inputs[0].onmidimessage.args[0][0].data;

  assert.deepEqual(message, new Uint8Array([ 0x90, 0x00, 0x00 ]));
});
```

STATE CHANGE

```js
const api = require("web-midi-test-api");
const device = api.createMIDIDevice();

let input;

api.requestMIDIAccess().then((access) => {
  input = access.inputs.values().next().value;

  assert(input.state === "connected");
  assert(input.connection === "closed");

  return input.open();
}).then(() => {
  assert(input.state === "connected");
  assert(input.connection === "open");

  return device.disconnect();
}).then(() => {
  assert(input.state === "disconnected");
  assert(input.connection === "closed");

  return device.connect();
}).then(function() {
  assert(input.state === "connected");
  assert(input.connection === "open");
});
```

## License

MIT
