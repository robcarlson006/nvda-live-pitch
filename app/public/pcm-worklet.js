// Microphone samples → 50 ms blocks of 16-bit PCM. The AudioContext runs at 16 kHz, so no resampling here.
class Pcm extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buf = new Int16Array(800);
    this.n = 0;
  }
  process(inputs) {
    const ch = inputs[0][0];
    if (!ch) return true;
    for (let i = 0; i < ch.length; i++) {
      this.buf[this.n++] = Math.max(-1, Math.min(1, ch[i])) * 32767;
      if (this.n === this.buf.length) {
        this.port.postMessage(this.buf.buffer, [this.buf.buffer]);
        this.buf = new Int16Array(800);
        this.n = 0;
      }
    }
    return true;
  }
}
registerProcessor('pcm', Pcm);
