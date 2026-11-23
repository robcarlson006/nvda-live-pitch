import type { ComponentType } from 'react';
import type { SceneProps } from '../primitives.tsx';
import { Discovering, Emissions, Finale, Governance, Race } from './mikael.tsx';
import { Bear, Forecast, Implied, Margins, RevenueRecent, ValueBars, Worth } from './panshul.tsx';
import { ChipShare, FirstChip, Founding, FourLayers, Hook, Question, RevenueLine, TwentyYears } from './rob.tsx';

/**
 * Scene name (the `scene:` field in spine.yaml) → component. `beats` is how many elements the scene builds, title included;
 * a test checks it against the spine so a slide can never ask for a beat the scene does not have.
 * Several slides may share one scene name: the scene then stays mounted across them, so shared elements morph instead of cutting.
 */
export const SCENES: Record<string, { Component: ComponentType<SceneProps> }> = {
  hook: { Component: Hook },
  founding: { Component: Founding },
  'first-chip': { Component: FirstChip },
  'revenue-line': { Component: RevenueLine },
  'twenty-years': { Component: TwentyYears },
  'four-layers': { Component: FourLayers },
  'chip-share': { Component: ChipShare },
  question: { Component: Question },
  'revenue-recent': { Component: RevenueRecent },
  margins: { Component: Margins },
  forecast: { Component: Forecast },
  worth: { Component: Worth },
  'value-bars': { Component: ValueBars },
  implied: { Component: Implied },
  bear: { Component: Bear },
  discovering: { Component: Discovering },
  race: { Component: Race },
  emissions: { Component: Emissions },
  governance: { Component: Governance },
  finale: { Component: Finale },
};
