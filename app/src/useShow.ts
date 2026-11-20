import { useEffect, useRef, useState } from 'react';
import type { ClientMsg, Dataset, ServerMsg, ShowState, SpineSlide } from '../shared/schema.ts';

/** Live connection to the backend. Reconnects forever with backoff, so a server restart or Wi-Fi blip heals itself. */
export function useShow() {
  const [state, setState] = useState<ShowState | null>(null);
  const [spine, setSpine] = useState<SpineSlide[]>([]);
  const [spineError, setSpineError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [clients, setClients] = useState(0);
  const [error, setError] = useState<string | null>(null);
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
        } else setError(msg.message);
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

  return { state, spine, spineError, connected, clients, error, send };
}

/** Clicker and keyboard control. Presentation clickers send PageDown/PageUp (or arrows). */
export function useNavKeys(send: (m: ClientMsg) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || e.metaKey || e.ctrlKey) return;
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) send({ type: 'next' });
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) send({ type: 'back' });
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
