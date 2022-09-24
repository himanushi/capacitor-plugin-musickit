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

  private playbackStateDidChange = (state: {
    oldState: number;
    state: number;
  }) => {
    const status = MusicKit.PlaybackStates[state.state];
    const data = { result: status };
    this.notifyListeners('playbackStateDidChange', data);
  };

  private authorizationStatusDidChange = (result: {
    authorizationStatus: number;
  }) => {
    let status = '';
    if (result.authorizationStatus === -1) {
      status = 'unavailable';
    } else if (result.authorizationStatus === 0) {
      status = 'notDetermined';
    } else if (result.authorizationStatus === 1) {
      status = 'denied';
    } else if (result.authorizationStatus === 2) {
      status = 'restricted';
    } else if (result.authorizationStatus === 3) {
      status = 'authorized';
    }
    this.notifyListeners('authorizationStatusDidChange', { result: status });
  };

  async configure(options: {
    config: MusicKit.Config;
  }): Promise<{ result: boolean }> {
    let result = false;
    try {
      const loaded = await new Promise<boolean>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
        script.onload = () => resolve(true);
        script.onerror = () => reject(false);
        document.head.appendChild(script);
      });

      if(!loaded) {
        return { result }
      }

      const musicKit = await MusicKit.configure(options.config);

      musicKit.addEventListener(
        'playbackStateDidChange',
        this.playbackStateDidChange,
      );

      musicKit.addEventListener(
        'authorizationStatusDidChange',
        this.authorizationStatusDidChange,
      );

      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async isAuthorized(): Promise<{ result: boolean }> {
    let result = false;
    try {
      result = Boolean(MusicKit.getInstance()?.isAuthorized);
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async hasMusicSubscription(): Promise<{ result: boolean }> {
    let result = false;
    try {
      result = await MusicKit.getInstance().hasMusicSubscription();
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async authorize(): Promise<void> {
    try {
      await MusicKit.getInstance().authorize();
    } catch (error) {
      console.log(error);
    }
  }

  async unauthorize(): Promise<void> {
    try {
      await MusicKit.getInstance().unauthorize();
    } catch (error) {
      console.log(error);
    }
  }

  async getLibraryAlbums(options: {
    limit: number;
    offset: number;
  }): Promise<{
    albums: {
      title: string;
      id: string;
      artworkUrl?: string;
    }[];
    hasNext: boolean;
  }> {
    const albums: {
      title: string;
      id: string;
      artworkUrl?: string;
    }[] = [];

    const response = await MusicKit.getInstance().api.music(
      `/v1/me/library/albums?limit=${options.limit}&offset=${options.offset}`,
    );

    response.data.data.map(album => {
      albums.push({
        title: album.attributes.name,
        id: album.id,
        artworkUrl: album.attributes.artwork?.url,
      });
    });

    const hasNext =
      response.data.meta.total !== options.offset + response.data.data.length;

    return { albums, hasNext };
  }
}
