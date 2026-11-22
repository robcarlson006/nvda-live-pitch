import type { AudioMsg } from '../server/deepgram.ts';

/** 'failed': Deepgram can't be used (fall back). 'nomic': the microphone itself is the problem (no point falling back). */
export type MicStatus = { state: 'listening' | 'reconnecting' | 'failed' | 'nomic'; message?: string; device?: string };
type Handlers = { onText: (text: string, final: boolean) => void; onStatus: (s: MicStatus) => void };

/** Microphone → our server (/audio) → Deepgram. Keeps going through server restarts; the server handles Deepgram drops. */
export function startDeepgram(lang: string, h: Handlers) {
  let stopped = false;
  let stream: MediaStream | undefined;
  let ctx: AudioContext | undefined;
  let ws: WebSocket | undefined;
  let timer: ReturnType<typeof setTimeout>;
  let level = 0;
  let device = '';
  let serverDownSince = 0;

  const stop = () => {
    stopped = true;
    clearTimeout(timer);
    stream?.getTracks().forEach((t) => {
      t.onended = null;
      t.stop();
    });
    ctx?.close().catch(() => {});
    ws?.close();
    level = 0;
  };
  const end = (s: MicStatus) => {
    if (stopped) return;
    stop();
    h.onStatus(s);
  };

  const connect = () => {
    const sock = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/audio?lang=${lang}`);
    ws = sock;
    sock.onmessage = (e) => {
      if (stopped) return;
      const m: AudioMsg = JSON.parse(e.data);
      if (m.type === 'transcript') return h.onText(m.text, m.final);
      serverDownSince = 0;
      if (m.state === 'failed') end(m as MicStatus);
      else h.onStatus({ ...m, device });
    };
    sock.onclose = () => {
      if (stopped) return;
      serverDownSince ||= Date.now();
      if (Date.now() - serverDownSince > 8000) return end({ state: 'failed', message: 'The pitch server is not answering' });
      h.onStatus({ state: 'reconnecting', device });
      timer = setTimeout(connect, 500);
    };
  };

  (async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: false, noiseSuppression: true, autoGainControl: true } });
      if (stopped) return stop();
      const track = stream.getAudioTracks()[0];
      device = track.label;
      track.onended = () => end({ state: 'nomic', message: 'Microphone disconnected. Plug it back in, then press Start mic.' });
    } catch (e) {
      const name = (e as DOMException).name;
      return end({
        state: 'nomic',
        message:
          name === 'NotAllowedError' ? 'Microphone blocked. Allow it in the address bar, then press Start mic.'
          : name === 'NotFoundError' ? 'No microphone found. Check the lavalier receiver is plugged in.'
          : `Microphone error: ${name}`,
      });
    }
    try {
      ctx = new AudioContext({ sampleRate: 16000 });
      await ctx.audioWorklet.addModule('/pcm-worklet.js');
      if (stopped) return stop();
      const node = new AudioWorkletNode(ctx, 'pcm', { numberOfOutputs: 0 });
      node.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
        const pcm = new Int16Array(e.data);
        let sum = 0;
        for (const s of pcm) sum += s * s;
        level = Math.sqrt(sum / pcm.length) / 32768;
        if (ws?.readyState === WebSocket.OPEN) ws.send(e.data);
      };
      ctx.createMediaStreamSource(stream).connect(node);
      await ctx.resume();
      if (stopped) return stop();
      connect();
    } catch (e) {
      end({ state: 'failed', message: `Audio capture failed: ${(e as Error).message}` });
    }
  })();

  return { stop, level: () => level };
}
