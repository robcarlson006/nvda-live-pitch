import { useEffect, useRef, useState } from 'react';

/**
 * Chrome's built-in speech-to-text (Web Speech API). Free and needs no key, but Chrome sends the audio
 * to Google to transcribe, so it needs internet. A stand-in until M4 (a proper streaming service).
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

export function useSpeech(onText: (text: string, final: boolean) => void) {
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('micLang') as Lang) || 'en-GB');
  const [interim, setInterim] = useState('');
  const [problem, setProblem] = useState<string | null>(null);
  const want = useRef(false);
  const rec = useRef<Rec | null>(null);
  const cb = useRef(onText);
  cb.current = onText;
  const supported = !!Ctor();

  const open = (language: Lang) => {
    const C = Ctor();
    if (!C) return setProblem('This browser has no speech recognition. Use Chrome.');
    rec.current?.abort();
    const r = new C();
    r.lang = language;
    r.continuous = true;
    r.interimResults = true;
    r.onstart = () => {
      setListening(true);
      setProblem(null);
    };
    r.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const text = res[0].transcript.trim();
        if (!text) continue;
        cb.current(text, res.isFinal);
        setInterim(res.isFinal ? '' : text);
      }
    };
    r.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return; // normal; onend restarts
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') want.current = false;
      setProblem(
        e.error === 'not-allowed' ? 'Microphone blocked. Allow it in the address bar, then press Start mic.'
        : e.error === 'network' ? 'Speech service unreachable (Chrome needs internet for this). Use Next / the clicker.'
        : e.error === 'audio-capture' ? 'No microphone found. Check the lavalier receiver is plugged in.'
        : `Speech error: ${e.error}`,
      );
    };
    r.onend = () => {
      setInterim('');
      if (want.current && rec.current === r) setTimeout(() => want.current && rec.current === r && safeStart(r), 250);
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

  const start = () => {
    want.current = true;
    open(lang);
  };
  const stop = () => {
    want.current = false;
    rec.current?.stop();
    setListening(false);
    setInterim('');
  };
  const changeLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem('micLang', l);
    } catch {
      /* private window */
    }
    if (want.current) open(l);
  };

  useEffect(() => () => {
    want.current = false;
    rec.current?.abort();
  }, []);

  return { supported, listening, lang, changeLang, interim, problem, start, stop };
}
