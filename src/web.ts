import { WebPlugin } from '@capacitor/core';

import type {
  CapacitorMusicKitPlugin,
  PlaybackStates,
  AuthorizationStatus,
  EchoOptions,
  EchoResult,
  ConfigureOptions,
  GetLibraryAlbumsOptions,
  GetLibraryAlbumsResult,
  GetLibraryAlbumResult,
  SetQueueOptions,
  ActionResult,
  PlayOptions,
  TrackResult,
  GetCurrentTrackResult,
  GetCurrentIndexResult,
  GetCurrentPlaybackTimeResult,
  SeekToTimeOptions,
  GetQueueTracksResult,
  SetRepeatModeOptions,
  getRepeatModeResult,
  GetLibraryTrackResult,
  GetLibraryTrackOptions,
  GetLibraryAlbumOptions,
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
    data: Parameters<MusicKit.PlaybackStateDidChange['callback']>[0],
  ) => {
    const status = MusicKit.PlaybackStates[data.state] as PlaybackStates;
    this.notifyListeners('playbackStateDidChange', { result: status });
  };

  private nowPlayingItemDidChange = (
    data: Parameters<MusicKit.NowPlayingItemDidChange['callback']>[0],
  ) => {
    let track: TrackResult | undefined;
    const item = data.item;
    if (item) {
      track = {
        id: item.id,
        name: item.attributes.name,
        durationMs: item.attributes.durationInMillis,
        discNumber: item.attributes.discNumber,
        trackNumber: item.attributes.trackNumber,
        artworkUrl: item.attributes.artwork?.url,
      };
    }
    this.notifyListeners('nowPlayingItemDidChange', { result: track });
  };

  private authorizationStatusDidChange = (
    data: Parameters<MusicKit.AuthorizationStatusDidChange['callback']>[0],
  ) => {
    // state.authorizationStatus === -1
    let status: AuthorizationStatus = 'unavailable';
    if (data.authorizationStatus === 0) {
      status = 'notDetermined';
    } else if (data.authorizationStatus === 1) {
      status = 'denied';
    } else if (data.authorizationStatus === 2) {
      status = 'restricted';
    } else if (data.authorizationStatus === 3) {
      status = 'authorized';
    }
    this.notifyListeners('authorizationStatusDidChange', { result: status });
  };

  async configure(options: ConfigureOptions): Promise<ActionResult> {
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
        'nowPlayingItemDidChange',
        this.nowPlayingItemDidChange,
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

  async isAuthorized(): Promise<ActionResult> {
    let result = false;
    try {
      result = Boolean(MusicKit.getInstance()?.isAuthorized);
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async hasMusicSubscription(): Promise<ActionResult> {
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
        id: album.id,
        name: album.attributes.name,
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
            id: resultAlbum.id,
            name: resultAlbum.attributes.name,
            artworkUrl: resultAlbum.attributes.artwork?.url,
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
      const tracks: TrackResult[] = [];
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
              id: track.id,
              name: track.attributes.name,
              durationMs: track.attributes.durationInMillis,
              discNumber: track.attributes.discNumber,
              trackNumber: track.attributes.trackNumber,
              artworkUrl: track.attributes.artwork?.url,
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

  async getLibraryTrack(
    options: GetLibraryTrackOptions,
  ): Promise<GetLibraryTrackResult> {
    let track: TrackResult | undefined;
    try {
      const fetchUrl = `/v1/me/library/songs/${options.id}`;
      const response = await MusicKit.getInstance().api.music(fetchUrl);
      const resultTrack = response.data.data[0];
      if (resultTrack) {
        track = {
          id: resultTrack.id,
          name: resultTrack.attributes.name,
          durationMs: resultTrack.attributes.durationInMillis,
          discNumber: resultTrack.attributes.discNumber,
          trackNumber: resultTrack.attributes.trackNumber,
          artworkUrl: resultTrack.attributes.artwork?.url, // bug?
        };
      }
    } catch (error) {
      console.log(error);
    }
    return { track };
  }

  async getCurrentTrack(): Promise<GetCurrentTrackResult> {
    let track: TrackResult | undefined;
    try {
      const item = MusicKit.getInstance().queue.currentItem;
      if (item) {
        track = {
          id: item.id,
          name: item.attributes.name,
          durationMs: item.attributes.durationInMillis,
          discNumber: item.attributes.discNumber,
          trackNumber: item.attributes.trackNumber,
          artworkUrl: item.attributes.artwork?.url, // bug?
        };
      }
    } catch (error) {
      console.log(error);
    }
    return { track };
  }

  async getQueueTracks(): Promise<GetQueueTracksResult> {
    const tracks: TrackResult[] = [];
    try {
      MusicKit.getInstance().queue.items.map(item =>
        tracks.push({
          id: item.id,
          name: item.attributes.name,
          durationMs: item.attributes.durationInMillis,
          discNumber: item.attributes.discNumber,
          trackNumber: item.attributes.trackNumber,
          artworkUrl: item.attributes.artwork?.url, // bug?
        }),
      );
    } catch (error) {
      console.log(error);
    }
    return { tracks };
  }

  async getCurrentIndex(): Promise<GetCurrentIndexResult> {
    let index = -1;
    try {
      index = MusicKit.getInstance().nowPlayingItemIndex;
    } catch (error) {
      console.log(error);
    }
    return { index };
  }

  async getCurrentPlaybackTime(): Promise<GetCurrentPlaybackTimeResult> {
    let time = 0;
    try {
      time = MusicKit.getInstance().currentPlaybackTime;
    } catch (error) {
      console.log(error);
    }
    return { time };
  }

  async getRepeatMode(): Promise<getRepeatModeResult> {
    const modeArray: getRepeatModeResult['mode'][] = ['none', 'one', 'all'];
    let mode: getRepeatModeResult['mode'] = 'none';
    try {
      mode = modeArray[MusicKit.getInstance().repeatMode] ?? 'none';
    } catch (error) {
      console.log(error);
    }
    return { mode };
  }

  async setRepeatMode(options: SetRepeatModeOptions): Promise<ActionResult> {
    let result = false;
    const modeMap = { none: 0, one: 1, all: 2 };
    try {
      MusicKit.getInstance().repeatMode = modeMap[options.mode];
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async setQueue(options: SetQueueOptions): Promise<ActionResult> {
    let result = false;
    try {
      await MusicKit.getInstance().setQueue({
        songs: options.ids,
      });
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async play(options: PlayOptions): Promise<ActionResult> {
    let result = false;
    try {
      if (options.index === undefined) {
        await MusicKit.getInstance().play();
      } else {
        await MusicKit.getInstance().changeToMediaAtIndex(options.index);
      }
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async pause(): Promise<ActionResult> {
    let result = false;
    try {
      await MusicKit.getInstance().pause();
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async stop(): Promise<ActionResult> {
    let result = false;
    try {
      await MusicKit.getInstance().stop();
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async nextPlay(): Promise<ActionResult> {
    let result = false;
    try {
      await MusicKit.getInstance().skipToNextItem();
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async previousPlay(): Promise<ActionResult> {
    let result = false;
    try {
      await MusicKit.getInstance().skipToPreviousItem();
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async seekToTime(options: SeekToTimeOptions): Promise<ActionResult> {
    let result = false;
    try {
      await MusicKit.getInstance().seekToTime(options.time);
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }
}
