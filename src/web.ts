import { WebPlugin } from '@capacitor/core';

import type { CapacitorMusicKitPlugin } from './definitions';

export class CapacitorMusicKitWeb
  extends WebPlugin
  implements CapacitorMusicKitPlugin
{
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
