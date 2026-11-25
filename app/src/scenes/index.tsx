import type { ComponentType } from 'react';
import type { Dataset } from '../../shared/schema.ts';
import { DcfDrivers } from './DcfDrivers.tsx';
import { DcfSummary } from './DcfSummary.tsx';
import { BridgeStack } from './BridgeStack.tsx';
import { Workers } from './Workers.tsx';
import { Connections } from './Connections.tsx';
import { AiIndustries } from './AiIndustries.tsx';
import { SpaceRace } from './SpaceRace.tsx';
import { WallStreet } from './WallStreet.tsx';
import { Napkin } from './Napkin.tsx';
import { FirstGpu } from './FirstGpu.tsx';
import { FourLayers, Handoff } from './FourLayers.tsx';
import { Bubble } from './Bubble.tsx';
import { Returns } from './Returns.tsx';
import { Recommendation } from './Recommendation.tsx';
import { Close } from './Close.tsx';
import { Demand } from './Demand.tsx';
import { OpenEcosystem } from './OpenEcosystem.tsx';
import './scenes.css';

/** `stage` = how many of the slide's points have been said so far, so each scene builds with the speaker. */
export type SceneProps = {
  stage: number;
  motion: boolean;
  /** The text of the points said so far, in the order they were said (figures already looked up). Lets a scene follow
   *  the script as it changes: match on what the point says, not on its position. */
  points?: string[];
  /** How many points the slide has in all. */
  total?: number;
  /** The clean datasets, so a scene can draw real figures with `lookup` instead of typing them. */
  datasets?: Record<string, Dataset>;
};

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
  returns: Returns,
  recommendation: Recommendation,
  close: Close,
  'open-ai': OpenEcosystem,
  'beyond-hyperscalers': Demand,
  'dcf-drivers': DcfDrivers,
  'dcf-summary': DcfSummary,
  'dcf-bridge': BridgeStack,
  cuda: Workers,
  connections: Connections,
};

export function sceneFor(id: string): ComponentType<SceneProps> | undefined {
  return scenes[id];
}
