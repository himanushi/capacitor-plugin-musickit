import { WebPlugin } from "@capacitor/core";
import type {
  AddRatingOptions,
  AuthorizationStatus,
  AuthorizationStatusDidChangeResult,
  CapacitorMusicKitPlugin,
  ConfigureOptions,
  DeleteRatingOptions,
  EchoOptions,
  EchoResult,
  GetCurrentIndexResult,
  GetCurrentPlaybackTimeResult,
  GetCurrentSongResult,
  GetLibraryArtistsOptions,
  GetLibraryArtistsResult,
  GetLibraryPlaylistsResult,
  GetLibrarySongsResult,
  GetQueueSongsResult,
  GetRepeatModeResult,
  GetLibraryAlbumsOptions,
  GetRatingsOptions,
  NowPlayingItemDidChangeResult,
  PlayOptions,
  PlaybackState,
  PlaybackStateDidChangeResult,
  RatingsResult,
  SeekToTimeOptions,
  SetQueueOptions,
  SetRepeatModeOptions,
  GetLibrarySongsOptions,
  GetLibraryPlaylistsOptions,
  GetShuffleModeResult,
  SetShuffleModeOptions,
  ActionResult,
  GetCatalogAlbumsOptions,
  GetCatalogAlbumsResult,
  GetLibraryAlbumsResult,
  GetCatalogArtistsOptions,
  GetCatalogArtistsResult,
} from "./definitions";

export class CapacitorMusicKitWeb
  extends WebPlugin
  implements CapacitorMusicKitPlugin {
  storefront = "jp";

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

  async configure (options: ConfigureOptions): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
      script.onload = () => resolve();
      script.onerror = () => reject("musickit.js loading error");
      document.head.appendChild(script);
    });

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

  async getCatalogArtists ({
    limit = 1,
    offset = 0,
    ids,
    albumId,
    libraryId,
    musicVideoId,
    songId,
    songIdForComposers,
  }: GetCatalogArtistsOptions): Promise<GetCatalogArtistsResult> {
    const urls: MusicKit.AppleMusicAPI.ArtistsUrl[] = [`/v1/catalog/${this.storefront}/artists` as const];
    albumId &&
      urls.push(
        `/v1/catalog/${this.storefront}/albums/${albumId}/artists` as const,
      );
    libraryId &&
      urls.push(`/v1/me/library/artists/${libraryId}/catalog` as const);
    musicVideoId &&
      urls.push(
        `/v1/catalog/${this.storefront}/music-videos/${musicVideoId}/artists` as const,
      );
    songId &&
      urls.push(
        `/v1/catalog/${this.storefront}/songs/${songId}/artists` as const,
      );
    songIdForComposers &&
      urls.push(
        `/v1/catalog/${this.storefront}/songs/${songId}/composers` as const,
      );

    const params = ids ? { ids } : {
      limit,
      offset,
    };

    const response = await MusicKit.getInstance().api.music(
      urls.reverse()[0],
      params,
    );
    return response.data;
  }

  async getCatalogAlbums ({
    limit = 1,
    offset = 0,
    ids,
    artistId,
    libraryId,
    musicVideoId,
    songId,
  }: GetCatalogAlbumsOptions): Promise<GetCatalogAlbumsResult> {
    const urls: MusicKit.AppleMusicAPI.AlbumsUrl[] = [`/v1/catalog/${this.storefront}/albums` as const];
    artistId &&
      urls.push(
        `/v1/catalog/${this.storefront}/artists/${artistId}/albums` as const,
      );
    libraryId &&
      urls.push(`/v1/me/library/albums/${libraryId}/catalog` as const);
    musicVideoId &&
      urls.push(
        `/v1/catalog/${this.storefront}/music-videos/${musicVideoId}/albums` as const,
      );
    songId &&
      urls.push(
        `/v1/catalog/${this.storefront}/songs/${songId}/albums` as const,
      );

    const params = ids ? { ids } : {
      limit,
      offset,
    };

    const response = await MusicKit.getInstance().api.music(
      urls.reverse()[0],
      params,
    );
    return response.data;
  }

  async getLibraryArtists ({
    limit = 1,
    offset = 0,
    ids,
    albumId,
    songId,
    musicVideoId,
  }: GetLibraryArtistsOptions): Promise<GetLibraryArtistsResult> {
    const urls: MusicKit.AppleMusicAPI.LibraryArtistsUrl[] = ["/v1/me/library/artists" as const];
    albumId && urls.push(`/v1/me/library/albums/${albumId}/artists` as const);
    songId && urls.push(`/v1/me/library/songs/${songId}/artists` as const);
    musicVideoId &&
      urls.push(`/v1/me/library/music-videos/${musicVideoId}/artists` as const);

    const params = ids ? { ids } : {
      limit,
      offset,
    };

    const response = await MusicKit.getInstance().api.music(
      urls.reverse()[0],
      params,
    );
    return response.data;
  }

  async getLibraryAlbums ({
    limit = 1,
    offset = 0,
    ids,
    catalogId,
    artistId,
    songId,
    musicVideoId,
  }: GetLibraryAlbumsOptions): Promise<GetLibraryAlbumsResult> {
    const urls: MusicKit.AppleMusicAPI.LibraryAlbumsUrl[] = ["/v1/me/library/albums" as const];
    catalogId &&
      urls.push(
        `/v1/catalog/${this.storefront}/albums/${catalogId}/library` as const,
      );
    artistId && urls.push(`/v1/me/library/artists/${artistId}/albums` as const);
    songId && urls.push(`/v1/me/library/songs/${songId}/albums` as const);
    musicVideoId &&
      urls.push(`/v1/me/library/music-videos/${musicVideoId}/albums` as const);

    const params = ids ? { ids } : {
      limit,
      offset,
    };

    const response = await MusicKit.getInstance().api.music(
      urls.reverse()[0],
      params,
    );
    return response.data;
  }

  async getLibrarySongs ({
    limit = 1,
    offset = 0,
    ids,
    catalogId,
    albumId,
    playlistId,
  }: GetLibrarySongsOptions): Promise<GetLibrarySongsResult> {
    const urls: MusicKit.AppleMusicAPI.LibrarySongsUrl[] = ["/v1/me/library/songs" as const];
    catalogId &&
      urls.push(
        `/v1/catalog/${this.storefront}/songs/${catalogId}/library` as const,
      );
    albumId && urls.push(`/v1/me/library/albums/${albumId}/tracks` as const);
    playlistId &&
      urls.push(`/v1/me/library/playlists/${playlistId}/tracks` as const);

    const params = ids ? { ids } : {
      limit,
      offset,
    };

    const response = await MusicKit.getInstance().api.music(
      urls.reverse()[0],
      params,
    );
    return response.data;
  }

  async getLibraryPlaylists ({
    limit = 1,
    offset = 0,
    ids,
    catalogId,
  }: GetLibraryPlaylistsOptions): Promise<GetLibraryPlaylistsResult> {
    const urls: MusicKit.AppleMusicAPI.LibraryPlaylistsUrl[] = ["/v1/me/library/playlists" as const];
    catalogId &&
      urls.push(
        `/v1/catalog/${this.storefront}/playlists/${catalogId}/library` as const,
      );

    const params = ids ? { ids } : {
      limit,
      offset,
    };

    const response = await MusicKit.getInstance().api.music(
      urls.reverse()[0],
      params,
    );
    return response.data;
  }

  async getRatings ({ type, ids }: GetRatingsOptions): Promise<RatingsResult> {
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/ratings/${type}` as const,
      {
        ids,
      },
    );
    return response.data;
  }

  async addRating ({ type, id, value }: AddRatingOptions): Promise<void> {
    await MusicKit.getInstance().api.music(
      `/v1/me/ratings/${type}/${id}` as const,
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
  }

  async deleteRating ({ type, id }: DeleteRatingOptions): Promise<void> {
    await MusicKit.getInstance().api.music(
      `/v1/me/ratings/${type}/${id}` as const,
      {},
      { fetchOptions: { method: "DELETE" } },
    );
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

  async getRepeatMode (): Promise<GetRepeatModeResult> {
    const modeArray: GetRepeatModeResult["mode"][] = ["none", "one", "all"];
    return { mode: modeArray[MusicKit.getInstance().repeatMode] };
  }

  async setRepeatMode (options: SetRepeatModeOptions): Promise<void> {
    const modeMap = {
      all: 2,
      none: 0,
      one: 1,
    } as const;
    MusicKit.getInstance().repeatMode = modeMap[options.mode];
  }

  async getShuffleMode (): Promise<GetShuffleModeResult> {
    const modeArray: GetShuffleModeResult["mode"][] = ["off", "songs"];
    return { mode: modeArray[MusicKit.getInstance().shuffleMode] };
  }

  async setShuffleMode (options: SetShuffleModeOptions): Promise<void> {
    const modeMap = {
      off: 0,
      songs: 1,
    } as const;
    MusicKit.getInstance().shuffleMode = modeMap[options.mode];
  }

  async setQueue (options: SetQueueOptions): Promise<void> {
    if (options.ids.length > 0) {
      await MusicKit.getInstance().setQueue({
        songs: options.ids,
      });
    } else {
      await MusicKit.getInstance().clearQueue();
    }
  }

  async play (options: PlayOptions): Promise<void> {
    if (options.index === undefined) {
      await MusicKit.getInstance().play();
    } else {
      await MusicKit.getInstance().changeToMediaAtIndex(options.index);
    }
  }

  async pause (): Promise<void> {
    await MusicKit.getInstance().pause();
  }

  async stop (): Promise<void> {
    await MusicKit.getInstance().stop();
  }

  async nextPlay (): Promise<void> {
    await MusicKit.getInstance().skipToNextItem();
  }

  async previousPlay (): Promise<void> {
    await MusicKit.getInstance().skipToPreviousItem();
  }

  async seekToTime (options: SeekToTimeOptions): Promise<void> {
    await MusicKit.getInstance().seekToTime(options.time);
  }
}
