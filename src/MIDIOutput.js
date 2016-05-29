"use strict";

const MIDIPort = require("./MIDIPort");
const util = require("./util");

// interface MIDIOutput : MIDIPort {
//   void send(sequence<octet> data, optional double timestamp);
//   void clear();
// };

class MIDIOutput extends MIDIPort {
  constructor(access, port) {
    super(access, port);
  }

  send(data, timestamp) {
    if (!util.validateMidiMessage(data)) {
      throw new TypeError("Invalid MIDI message: " + util.convertMIDIMessageToString(data));
    }
    if ((data[0] & 0xf0) === 0xf0 && !this.$access.sysexEnabled) {
      throw new Error("System exclusive message is not allowed");
    }
    if (this.connection === "open") {
      this.$port.send(data, timestamp);
    }
  }

  clear() {
    this.$port.clear();
  }
}

module.exports = MIDIOutput;
