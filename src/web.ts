import { WebPlugin } from "@capacitor/core";

import type {
  CapacitorMusicKitPlugin,
  AuthorizationStatus,
  EchoOptions,
  EchoResult,
  ConfigureOptions,
  GetLibraryAlbumsResult,
  SetQueueOptions,
  ActionResult,
  PlayOptions,
  GetCurrentIndexResult,
  GetCurrentPlaybackTimeResult,
  SeekToTimeOptions,
  SetRepeatModeOptions,
  getRepeatModeResult,
  PlaybackStateDidChangeResult,
  NowPlayingItemDidChangeResult,
  AuthorizationStatusDidChangeResult,
  GetMultiDataOptions,
  GetLibraryArtistsResult,
  GetLibraryPlaylistsResult,
  RatingsResult,
  GetRatingsOptions,
  AddRatingOptions,
  DeleteRatingOptions,
  GetLibraryArtistOptions,
  GetLibraryAlbumOptions,
  GetLibraryPlaylistOptions,
  PlaybackState,
  GetLibrarySongOptions,
  GetLibrarySongsResult,
  GetCurrentSongResult,
  GetQueueSongsResult,
} from "./definitions";

export class CapacitorMusicKitWeb
  extends WebPlugin
  implements CapacitorMusicKitPlugin {
  async echo (options: EchoOptions): Promise<EchoResult> {
    console.log("ECHO", options);
    return options;
  }

  private playbackStateDidChange = (
    data: MusicKit.Events["playbackStateDidChange"],
  ) => {
    const state = MusicKit.PlaybackStates[data.state] as PlaybackState;
    const result: PlaybackStateDidChangeResult = { state };
    this.notifyListeners("playbackStateDidChange", result);
  };

  private nowPlayingItemDidChange = (
    data: MusicKit.Events["nowPlayingItemDidChange"],
  ) => {
    const item = data.item;
    const index = MusicKit.getInstance().nowPlayingItemIndex;
    const result: NowPlayingItemDidChangeResult = {
      index,
      item,
    };
    this.notifyListeners("nowPlayingItemDidChange", result);
  };

  private authorizationStatusDidChange = (
    data: MusicKit.Events["authorizationStatusDidChange"],
  ) => {
    // state.authorizationStatus === -1
    let status: AuthorizationStatus = "unavailable";
    if (data.authorizationStatus === 0) {
      status = "notDetermined";
    } else if (data.authorizationStatus === 1) {
      status = "denied";
    } else if (data.authorizationStatus === 2) {
      status = "restricted";
    } else if (data.authorizationStatus === 3) {
      status = "authorized";
    }
    const result: AuthorizationStatusDidChangeResult = { status };
    this.notifyListeners("authorizationStatusDidChange", result);
  };

  async configure (options: ConfigureOptions): Promise<ActionResult> {
    let result = false;

    const loaded = await new Promise<boolean>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.head.appendChild(script);
    });

    if (!loaded) {
      return { result };
    }

    const musicKit = await MusicKit.configure(options.config);

    musicKit.addEventListener(
      "playbackStateDidChange",
      this.playbackStateDidChange,
    );

    musicKit.addEventListener(
      "nowPlayingItemDidChange",
      this.nowPlayingItemDidChange,
    );

    musicKit.addEventListener(
      "authorizationStatusDidChange",
      this.authorizationStatusDidChange,
    );

    result = true;

    return { result };
  }

  async isAuthorized (): Promise<ActionResult> {
    return { result: Boolean(MusicKit.getInstance()?.isAuthorized) };
  }

  async hasMusicSubscription (): Promise<ActionResult> {
    return { result: await MusicKit.getInstance().hasMusicSubscription() };
  }

  async authorize (): Promise<void> {
    await MusicKit.getInstance().authorize();
  }

  async unauthorize (): Promise<void> {
    await MusicKit.getInstance().unauthorize();
  }

  async getLibraryArtist (
    options: GetLibraryArtistOptions,
  ): Promise<GetLibraryArtistsResult> {
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/library/artists/${options.id}`,
    );
    return response.data;
  }

  async getLibraryArtists (
    options: GetMultiDataOptions,
  ): Promise<GetLibraryArtistsResult> {
    const idsOption = options.ids ? { ids: options.ids } : {};
    const response = await MusicKit.getInstance().api.music(
      "/v1/me/library/artists",
      {
        limit: options.limit,
        offset: options.offset,
        ...idsOption,
      },
    );
    return response.data;
  }

  async getLibraryAlbum (
    options: GetLibraryAlbumOptions,
  ): Promise<GetLibraryAlbumsResult> {
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/library/albums/${options.id}`,
    );
    return response.data;
  }

  async getLibraryAlbums (
    options: GetMultiDataOptions,
  ): Promise<GetLibraryAlbumsResult> {
    const idsOption = options.ids ? { ids: options.ids } : {};
    const response = await MusicKit.getInstance().api.music(
      "/v1/me/library/albums",
      {
        limit: options.limit,
        offset: options.offset,
        ...idsOption,
      },
    );
    return response.data;
  }

  async getLibrarySong (
    options: GetLibrarySongOptions,
  ): Promise<GetLibrarySongsResult> {
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/library/songs/${options.id}`,
    );
    return response.data;
  }

  async getLibrarySongs (
    options: GetMultiDataOptions,
  ): Promise<GetLibrarySongsResult> {
    const idsOption = options.ids ? { ids: options.ids } : {};
    const response = await MusicKit.getInstance().api.music(
      "/v1/me/library/songs",
      {
        limit: options.limit,
        offset: options.offset,
        ...idsOption,
      },
    );
    return response.data;
  }

  async getLibraryPlaylist (
    options: GetLibraryPlaylistOptions,
  ): Promise<GetLibraryPlaylistsResult> {
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/library/playlists/${options.id}`,
    );
    return response.data;
  }

  async getLibraryPlaylists (
    options: GetMultiDataOptions,
  ): Promise<GetLibraryPlaylistsResult> {
    const idsOption = options.ids ? { ids: options.ids } : {};
    const response = await MusicKit.getInstance().api.music(
      "/v1/me/library/playlists",
      {
        limit: options.limit,
        offset: options.offset,
        ...idsOption,
      },
    );
    return response.data;
  }

  async getRatings ({ type, ids }: GetRatingsOptions): Promise<RatingsResult> {
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/ratings/${type}`,
      {
        ids,
      },
    );
    return response.data;
  }

  async addRating ({
    type,
    id,
    value,
  }: AddRatingOptions): Promise<RatingsResult> {
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/ratings/${type}/${id}`,
      {},
      {
        fetchOptions: {
          body: JSON.stringify({
            attributes: {
              value,
            },
            type: "ratings",
          }),
          method: "PUT",
        },
      },
    );

    return response.data;
  }

  async deleteRating ({
    type,
    id,
  }: DeleteRatingOptions): Promise<RatingsResult> {
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/ratings/${type}/${id}`,
      {},
      { fetchOptions: { method: "DELETE" } },
    );
    return response.data;
  }

  async getCurrentSong (): Promise<GetCurrentSongResult> {
    return { item: MusicKit.getInstance().queue.currentItem };
  }

  async getQueueSongs (): Promise<GetQueueSongsResult> {
    return { items: MusicKit.getInstance().queue.items };
  }

  async getCurrentIndex (): Promise<GetCurrentIndexResult> {
    return { index: MusicKit.getInstance().nowPlayingItemIndex };
  }

  async getCurrentPlaybackTime (): Promise<GetCurrentPlaybackTimeResult> {
    return { time: MusicKit.getInstance().currentPlaybackTime };
  }

  async getRepeatMode (): Promise<getRepeatModeResult> {
    const modeArray: getRepeatModeResult["mode"][] = ["none", "one", "all"];
    return { mode: modeArray[MusicKit.getInstance().repeatMode] };
  }

  async setRepeatMode (options: SetRepeatModeOptions): Promise<ActionResult> {
    const modeMap = {
      all: 2,
      none: 0,
      one: 1,
    } as const;
    MusicKit.getInstance().repeatMode = modeMap[options.mode];
    return { result: true };
  }

  async setQueue (options: SetQueueOptions): Promise<ActionResult> {
    await MusicKit.getInstance().setQueue({
      songs: options.ids,
    });
    return { result: true };
  }

  async play (options: PlayOptions): Promise<ActionResult> {
    if (options.index === undefined) {
      await MusicKit.getInstance().play();
    } else {
      await MusicKit.getInstance().changeToMediaAtIndex(options.index);
    }
    return { result: true };
  }

  async pause (): Promise<ActionResult> {
    await MusicKit.getInstance().pause();
    return { result: true };
  }

  async stop (): Promise<ActionResult> {
    await MusicKit.getInstance().stop();
    return { result: true };
  }

  async nextPlay (): Promise<ActionResult> {
    await MusicKit.getInstance().skipToNextItem();
    return { result: true };
  }

  async previousPlay (): Promise<ActionResult> {
    await MusicKit.getInstance().skipToPreviousItem();
    return { result: true };
  }

  async seekToTime (options: SeekToTimeOptions): Promise<ActionResult> {
    await MusicKit.getInstance().seekToTime(options.time);
    return { result: true };
  }
}
