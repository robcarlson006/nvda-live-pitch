import type { ComponentType } from 'react';
import { AiIndustries } from './AiIndustries.tsx';
import { SpaceRace } from './SpaceRace.tsx';
import { WallStreet } from './WallStreet.tsx';
import { Napkin } from './Napkin.tsx';
import { FirstGpu } from './FirstGpu.tsx';
import { FourLayers, Handoff } from './FourLayers.tsx';
import { Bubble } from './Bubble.tsx';
import './scenes.css';

/** `stage` = how many of the slide's points have been said so far, so each scene builds with the speaker. */
export type SceneProps = { stage: number; motion: boolean };

/**
 * Bespoke animated scenes, keyed by spine slide id. They sit on the right of the slide while its own title and
 * points stay on the left, so docs/script/spine.yaml needs no change. A slide id that isn't here simply has no scene.
 */
const scenes: Record<string, ComponentType<SceneProps>> = {
  'space-race': SpaceRace,
  'already-doing': AiIndustries,
  'wall-street': WallStreet,
  founding: Napkin,
  'first-gpu': FirstGpu,
  'four-layers': FourLayers,
  handoff: Handoff,
  'if-it-pops': Bubble,
};

export function sceneFor(id: string): ComponentType<SceneProps> | undefined {
  return scenes[id];
}
