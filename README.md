# web-midi-test-api

> Web MIDI API for CI

:zap: WIP

## API
### WebMIDITestAPI
- `constructor()`

#### Instance methods
- `requestMIDIAccess(opts = {}): Promise<MIDIAccess>`
- `createMIDIDevice(opts = {}): MIDIDevice`

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

## Usage
MIDI-IN
```js
var api = new WebMIDITestAPI();
var device = api.createMIDIDevice();
var input;

api.requestMIDIAccess(function(access) {
  input = access.inputs.values().next().value;

  input.onmidimessage = sinon.spy();

  return input.open();
}).then(function() {
  return device.outputs[0].send([ 0x90, 0x30, 0x64 ]);
}).then(function() {
  var message = input.onmidimessage.args[0][0].data;

  assert.deepEqual(message, new Uint8Array([ 0x90, 0x30, 0x64 ]));
});
```

MIDI-OUT
```js
var api = new WebMIDITestAPI();
var device = api.createMIDIDevice();
var output;

device.inputs[0].onmidimessage = sinon.spy();

api.requestMIDIAccess(function(access) {
  output = access.outputs.values().next().value;

  return output.open();
}).then(function() {
  return output.send([ 0x90, 0x30, 0x64 ]);
}).then(function() {
  var message = device.inputs[0].onmidimessage.args[0][0].data;

  assert.deepEqual(message, new Uint8Array([ 0x90, 0x30, 0x64 ]));
});
```

STATE CHANGE
```js
var api = new WebMIDITestAPI();
var device = api.createMIDIDevice();
var input;

api.requestMIDIAccess(function(access) {
  input = access.inputs.values().next().value;

  assert(input.state === "connected");
  assert(input.connection === "closed");

  return input.open();
}).then(function() {
  assert(input.state === "connected");
  assert(input.connection === "open");

  return device.disconnect();
}).then(function() {
  assert(input.state === "disconnected");
  assert(input.connection === "closed");

  return device.connect();
})
}).then(function() {
  assert(input.state === "connected");
  assert(input.connection === "open");
});
```

## License
MIT
