import { createRoot } from 'react-dom/client';
import { Operator } from './Operator.tsx';
import { Stage } from './Stage.tsx';
import './styles.css';

// Two routes only, so no router: /stage is the projector, everything else is the operator panel.
const isStage = location.pathname.startsWith('/stage');
document.body.className = isStage ? 'is-stage' : 'is-operator';
createRoot(document.getElementById('root')!).render(isStage ? <Stage /> : <Operator />);
