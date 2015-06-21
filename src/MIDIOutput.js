import MIDIPort from "./MIDIPort";

// interface MIDIOutput : MIDIPort {
//     void send (sequence<octet> data, optional double timestamp);
//     void clear ();
// };

export default class MIDIOutput extends MIDIPort {
  constructor(api, opts) {
    super(api, opts);
  }

  get type() {
    return "output";
  }

  send() {
  }

  clear() {
  }
}
