import { WebPlugin } from '@capacitor/core';

import type {
  CapacitorMusicKitPlugin,
  PlaybackStates,
  AuthorizationStatus,
  EchoOptions,
  EchoResult,
  ConfigureOptions,
  ConfigureResult,
  IsAuthorizedResult,
  HasMusicSubscriptionResult,
  GetLibraryAlbumsOptions,
  GetLibraryAlbumsResult,
  GetLibraryAlbumOptions,
  GetLibraryAlbumResult,
  GetLibraryAlbumTrackResult,
} from './definitions';

export class CapacitorMusicKitWeb
  extends WebPlugin
  implements CapacitorMusicKitPlugin
{
  async echo(options: EchoOptions): Promise<EchoResult> {
    console.log('ECHO', options);
    return options;
  }

  private playbackStateDidChange = (
    state: Parameters<MusicKit.PlaybackStateDidChange['callback']>[0],
  ) => {
    const status = MusicKit.PlaybackStates[state.state] as PlaybackStates;
    this.notifyListeners('playbackStateDidChange', { result: status });
  };

  private authorizationStatusDidChange = (
    state: Parameters<MusicKit.AuthorizationStatusDidChange['callback']>[0],
  ) => {
    // state.authorizationStatus === -1
    let status: AuthorizationStatus = 'unavailable';
    if (state.authorizationStatus === 0) {
      status = 'notDetermined';
    } else if (state.authorizationStatus === 1) {
      status = 'denied';
    } else if (state.authorizationStatus === 2) {
      status = 'restricted';
    } else if (state.authorizationStatus === 3) {
      status = 'authorized';
    }
    this.notifyListeners('authorizationStatusDidChange', { result: status });
  };

  async configure(options: ConfigureOptions): Promise<ConfigureResult> {
    let result = false;
    try {
      const loaded = await new Promise<boolean>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://js-cdn.music.apple.com/musickit/v3/musickit.js';
        script.onload = () => resolve(true);
        script.onerror = () => reject(false);
        document.head.appendChild(script);
      });

      if (!loaded) {
        return { result };
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

  async isAuthorized(): Promise<IsAuthorizedResult> {
    let result = false;
    try {
      result = Boolean(MusicKit.getInstance()?.isAuthorized);
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async hasMusicSubscription(): Promise<HasMusicSubscriptionResult> {
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

  async getLibraryAlbums(
    options: GetLibraryAlbumsOptions,
  ): Promise<GetLibraryAlbumsResult> {
    const albums: GetLibraryAlbumsResult['albums'] = [];

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

  async getLibraryAlbum(
    options: GetLibraryAlbumOptions,
  ): Promise<GetLibraryAlbumResult> {
    let album: GetLibraryAlbumResult['album'];
    let hasNext = false;
    let resultAlbum: MusicKit.APIResultData | undefined;
    let fetchUrl = `/v1/me/library/albums/${options.id}`;

    // アルバム検索
    const limit = 10;
    let count = 0;
    do {
      // 無限ループの可能性を排除
      count += 1;
      if (count > limit) {
        break;
      }
      hasNext = false;
      const response = await MusicKit.getInstance().api.music(fetchUrl);
      const albums = options.id
        ? { data: response.data.data, next: false }
        : response.data.results['library-albums'];

      if (albums) {
        resultAlbum = albums.data.find(abm => abm.id === options.id);
        if (resultAlbum) {
          album = {
            title: resultAlbum.attributes.name,
            id: resultAlbum.id,
            tracks: [],
          };
          break;
        }
        if (albums.next) {
          hasNext = true;
          fetchUrl = `${albums.next}&limit=25`;
        }
      }
    } while (hasNext);

    // 曲一覧
    if (album) {
      hasNext = false;
      fetchUrl = `/v1/me/library/albums/${album.id}/tracks?limit=100`;
      const tracks: GetLibraryAlbumTrackResult[] = [];
      count = 0;

      do {
        // 無限ループの可能性を排除
        count += 1;
        if (count > limit) {
          break;
        }
        hasNext = false;
        const response = await MusicKit.getInstance().api.music(fetchUrl);
        const data = response.data;
        if (data) {
          for (const track of data.data) {
            tracks.push({
              title: track.attributes.name,
              id: track.id,
              discNumber: track.attributes.discNumber.toString(),
              trackNumber: track.attributes.trackNumber.toString(),
            });
          }
          if (data.next) {
            hasNext = true;
            fetchUrl = `${data.next}&limit=100`;
          }
        }
      } while (hasNext);

      album.tracks = tracks;
    }

    return { album };
  }
}
