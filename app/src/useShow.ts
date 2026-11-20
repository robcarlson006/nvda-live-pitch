import { useEffect, useRef, useState } from 'react';
import type { ClientMsg, Dataset, ServerMsg, ShowState } from '../shared/schema.ts';

/** Live connection to the backend. Reconnects forever with backoff, so a server restart or Wi-Fi blip heals itself. */
export function useShow() {
  const [state, setState] = useState<ShowState | null>(null);
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
    else setError('Not connected to server');
  };

  return { state, connected, clients, error, send };
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
