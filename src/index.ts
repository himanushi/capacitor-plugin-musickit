// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="../types" />

import { registerPlugin } from '@capacitor/core';

import type { CapacitorMusicKitPlugin } from './definitions';

const CapacitorMusicKit = registerPlugin<CapacitorMusicKitPlugin>(
  'CapacitorMusicKit',
  {
    web: () => import('./web').then(m => new m.CapacitorMusicKitWeb()),
  },
);

export * from './definitions';
export { CapacitorMusicKit };
