import { useEffect, useRef, useState } from 'react';
import type { AiInfo, ClientMsg, Dataset, ServerMsg, ShowState, SpineSlide } from '../shared/schema.ts';

/** Live connection to the backend. Reconnects forever with backoff, so a server restart or Wi-Fi blip heals itself. */
export function useShow() {
  const [state, setState] = useState<ShowState | null>(null);
  const [spine, setSpine] = useState<SpineSlide[]>([]);
  const [spineError, setSpineError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [ai, setAi] = useState<AiInfo | null>(null);
  const [bank, setBank] = useState<{ id: string; question: string }[]>([]);
  const [clients, setClients] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    let retry = 0;
    let timer: ReturnType<typeof setTimeout>;
    let closed = false;
    const connect = () => {
      const sock = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`);
      ws.current = sock;
      sock.onopen = () => {
        retry = 0;
        setConnected(true);
      };
      sock.onmessage = (e) => {
        const msg: ServerMsg = JSON.parse(e.data);
        if (msg.type === 'state') {
          setState(msg.state);
          setSpine(msg.spine);
          setSpineError(msg.spineError);
          setClients(msg.clients);
          setAi(msg.ai);
          setBank(msg.bank);
        } else if (msg.type === 'saved') setNotice(`Rehearsal saved to ${msg.file}`);
        else if (msg.type === 'error') setError(msg.message);
      };
      sock.onclose = () => {
        setConnected(false);
        if (!closed) timer = setTimeout(connect, Math.min(4000, 250 * 2 ** retry++));
      };
    };
    connect();
    return () => {
      closed = true;
      clearTimeout(timer);
      ws.current?.close();
    };
  }, []);

  const send = (msg: ClientMsg) => {
    setError(null);
    if (ws.current?.readyState === WebSocket.OPEN) ws.current.send(JSON.stringify(msg));
    else setError('Not connected to the server');
  };

  return { state, spine, spineError, connected, clients, error, notice, send, ai, bank };
}

/** Clicker and keyboard control. Presentation clickers send PageDown/PageUp (or arrows). */
export function useNavKeys(send: (m: ClientMsg) => void, state: ShowState | null) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || e.metaKey || e.ctrlKey) return;
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) send({ type: 'next' });
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) send({ type: 'back' });
      else if (e.repeat) return;
      else if (e.key === 'q') send({ type: 'question', action: state?.mode === 'question' ? 'answer' : 'start' });
      else if (e.key === 'a' && state?.drafts[0]) send({ type: 'draft', action: 'show', id: state.drafts[0].id });
      else if (e.key === 'x' && state?.drafts[0]) send({ type: 'draft', action: 'reject', id: state.drafts[0].id });
      else if (e.key === 'r') send({ type: 'resume' });
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
}

export function useDatasets() {
  const [datasets, setDatasets] = useState<Record<string, Dataset>>({});
  useEffect(() => {
    fetch('/api/datasets')
      .then((r) => r.json())
      .then(setDatasets)
      .catch(() => {}); // shortcut: no retry; a stage refresh reloads them
  }, []);
  return datasets;
}
