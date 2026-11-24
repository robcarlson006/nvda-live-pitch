import type { Diagram } from '../shared/schema.ts';
import './answer-visual.css';

export function AnswerVisual({ diagram }: { diagram: Diagram }) {
  const List = diagram.kind === 'flow' ? 'ol' : 'ul';
  return (
    <List className={`answer-visual answer-visual--${diagram.kind}`} aria-label={diagram.kind === 'flow' ? 'Sequence' : diagram.kind === 'comparison' ? 'Comparison' : 'Related points'}>
      {diagram.nodes.map((node) => <li key={node}>{node}</li>)}
    </List>
  );
}
