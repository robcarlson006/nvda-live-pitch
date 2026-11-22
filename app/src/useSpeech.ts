import { useEffect, useRef, useState } from 'react';
import { startDeepgram } from './deepgramMic.ts';

/**
 * The operator's microphone. Two engines, same output:
 * - Deepgram, through our server (needs a key in app/.env).
 * - Chrome's built-in speech-to-text: the backup. Free, no key, but Chrome sends the audio to Google.
 * If Deepgram can't be used, the mic switches to Chrome by itself and says so.
 * Chrome ends a session after a pause or about a minute, so while the mic is on it restarts by itself.
 */
type Rec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
type RecCtor = new () => Rec;

const Ctor = (): RecCtor | undefined => (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
export type Lang = 'en-GB' | 'en-US';
export type Engine = 'deepgram' | 'chrome';

const remember = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* private window */
  }
};

export function useSpeech(onText: (text: string, final: boolean) => void) {
  const [on, setOn] = useState(false); // the operator wants the mic on
  const [listening, setListening] = useState(false); // it is actually hearing
  const [engine, setEngine] = useState<Engine>('deepgram');
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('micLang') as Lang) || 'en-GB');
  const [interim, setInterim] = useState('');
  const [problem, setProblem] = useState<string | null>(null);
  const [device, setDevice] = useState('');
  const want = useRef(false);
  const rec = useRef<Rec | null>(null);
  const dg = useRef<ReturnType<typeof startDeepgram> | null>(null);
  const pending = useRef(''); // the interim text not yet confirmed by a final result
  const cb = useRef(onText);
  cb.current = onText;
  const supported = !!Ctor();

  const emit = (text: string, final: boolean) => {
    pending.current = final ? '' : text;
    setInterim(pending.current);
    cb.current(text, final);
  };
  /** The stream broke mid-utterance: its final result will never come, so close it with what we have. */
  const flush = () => {
    if (pending.current) emit(pending.current, true);
  };

  const closeAll = () => {
    flush();
    dg.current?.stop();
    dg.current = null;
    const r = rec.current;
    rec.current = null;
    r?.abort();
    setListening(false);
    setDevice('');
  };
  const off = () => {
    want.current = false;
    setOn(false);
    closeAll();
  };

  const openDeepgram = (language: Lang) => {
    const session: ReturnType<typeof startDeepgram> = startDeepgram(language, {
      onText: (text, final) => dg.current === session && emit(text, final),
      onStatus: (s) => {
        if (dg.current !== session) return;
        setListening(s.state === 'listening');
        setDevice(s.device ? `Mic: ${s.device}` : '');
        if (s.state === 'listening') return setProblem(null);
        flush();
        if (s.state === 'reconnecting') return setProblem('Deepgram connection lost. Reconnecting… Use Next / the clicker meanwhile.');
        if (s.state === 'nomic') {
          off();
          return setProblem(s.message ?? 'Microphone problem');
        }
        // Deepgram can't be used: carry on with Chrome.
        closeAll();
        if (!supported) {
          off();
          return setProblem(`${s.message}. No backup in this browser: use Chrome, or Next / the clicker.`);
        }
        setEngine('chrome');
        openChrome(language, `${s.message}. Switched to Chrome speech-to-text.`);
      },
    });
    dg.current = session;
  };

  const openChrome = (language: Lang, note: string | null = null) => {
    const C = Ctor();
    if (!C) {
      off();
      return setProblem('This browser has no speech recognition. Use Chrome.');
    }
    setProblem(note);
    const r = new C();
    r.lang = language;
    r.continuous = true;
    r.interimResults = true;
    r.onstart = () => {
      if (rec.current !== r) return;
      setListening(true);
      setProblem(note);
    };
    r.onresult = (e) => {
      if (rec.current !== r) return;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const text = res[0].transcript.trim();
        if (text) emit(text, res.isFinal);
      }
    };
    r.onerror = (e) => {
      if (rec.current !== r || e.error === 'no-speech' || e.error === 'aborted') return; // normal; onend restarts
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') off();
      setProblem(
        e.error === 'not-allowed' ? 'Microphone blocked. Allow it in the address bar, then press Start mic.'
        : e.error === 'network' ? 'Speech service unreachable (Chrome needs internet for this). Use Next / the clicker.'
        : e.error === 'audio-capture' ? 'No microphone found. Check the lavalier receiver is plugged in.'
        : `Speech error: ${e.error}`,
      );
    };
    r.onend = () => {
      if (rec.current !== r) return;
      flush();
      if (want.current) setTimeout(() => want.current && rec.current === r && safeStart(r), 250);
      else setListening(false);
    };
    rec.current = r;
    safeStart(r);
  };

  const safeStart = (r: Rec) => {
    try {
      r.start();
    } catch {
      /* already started */
    }
  };

  const open = (e: Engine, l: Lang) => {
    closeAll();
    setProblem(null);
    if (e === 'deepgram') openDeepgram(l);
    else openChrome(l);
  };
  const start = () => {
    want.current = true;
    setOn(true);
    open(engine, lang);
  };
  const changeLang = (l: Lang) => {
    setLang(l);
    remember('micLang', l);
    if (want.current) open(engine, l);
  };
  const changeEngine = (e: Engine) => {
    setEngine(e);
    if (want.current) open(e, lang);
  };

  useEffect(() => () => {
    want.current = false;
    dg.current?.stop();
    rec.current?.abort();
  }, []);

  const level = () => dg.current?.level() ?? 0;
  return { supported, on, listening, engine, changeEngine, lang, changeLang, interim, problem, device, level, start, stop: off };
}
