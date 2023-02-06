import { WebPlugin } from "@capacitor/core";
import { Howl } from "howler";
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
  ApiOptions,
  ApiResult,
  GetCurrentPlaybackDurationResult,
  SetSongOptions,
  SetSongResult,
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

  async api<T extends any> ({
    url,
    params = {},
    options = {},
  }: ApiOptions): Promise<ApiResult<T>> {
    const { data } = await MusicKit.getInstance().api.music(
      url as any,
      params,
      options,
    );
    return data as any;
  }

  async getCatalogArtists ({
    limit = 1,
    offset = 0,
    ids,
    albumId,
    libraryId,
    musicVideoId,
    songId,
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

  async currentPlaybackDuration (): Promise<GetCurrentPlaybackDurationResult> {
    let time = 0;
    if (this.player) {
      time = this.player.duration();
    } else {
      time = await MusicKit.getInstance().currentPlaybackDuration;
    }
    return { time };
  }

  async getCurrentPlaybackTime (): Promise<GetCurrentPlaybackTimeResult> {
    let time = 0;
    if (this.player) {
      time = this.player.seek() as number;
    } else {
      time = MusicKit.getInstance().currentPlaybackTime;
    }
    return { time };
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
      if (this.player) {
        this.player.play();
      } else {
        await MusicKit.getInstance().play();
      }
    } else {
      await MusicKit.getInstance().changeToMediaAtIndex(options.index);
    }
  }

  async pause (): Promise<void> {
    if (this.player) {
      this.player.pause();
    } else {
      await MusicKit.getInstance().pause();
    }
  }

  async stop (): Promise<void> {
    if (this.player) {
      this.player.stop();
    } else {
      await MusicKit.getInstance().stop();
    }
  }

  async nextPlay (): Promise<void> {
    await MusicKit.getInstance().skipToNextItem();
  }

  async previousPlay (): Promise<void> {
    await MusicKit.getInstance().skipToPreviousItem();
  }

  async seekToTime (options: SeekToTimeOptions): Promise<void> {
    if (this.player) {
      this.player.seek(options.time);
    } else {
      MusicKit.getInstance().seekToTime(options.time);
    }
  }

  player: Howl | undefined;

  defaultVolume = 1.0;

  fadeoutId: NodeJS.Timeout | undefined;

  resetFadeoutId (): void {
    if (this.fadeoutId !== undefined) {
      clearTimeout(this.fadeoutId);
      this.fadeoutId = undefined;
    }
  }

  async resetMusicKit (): Promise<void> {
    MusicKit.getInstance().volume = this.defaultVolume;
    await MusicKit.getInstance().stop();
    await MusicKit.getInstance().setQueue({ songs: [] });
  }

  async resetPreviewPlayer (): Promise<void> {
    this.resetFadeoutId();
    if (this.player) {
      this.player.stop();
      this.player.off("play");
      this.player.off("pause");
      this.player.off("end");
      this.player.off("stop");
      this.player = undefined;
    }
  }

  async reset (): Promise<void> {
    await this.resetMusicKit();
    this.resetPreviewPlayer();
  }

  async setSong (options: SetSongOptions): Promise<SetSongResult> {
    const replaceName = (name: string) =>
      // 名前が長すぎる場合は検索で引っかからないのでなるべく短い名前にする
      // eslint-disable-next-line prefer-named-capture-group
      name.replace(/(?!^)(\[|\(|-|:|〜|~|,).*/gu, "");
    const getLibrarySong = async (name: string, songId: string) => {
      const endpoint = `/v1/me/library/search?types=library-songs&term=${replaceName(
        name,
      )}`;
      return await getLoopLibrarySong(endpoint, songId);
    };

    const searchLibrarySongs = async (
      endpoint: MusicKit.AppleMusicAPI.SearchLibrarySongsUrl,
    ) => await MusicKit.getInstance().api.music(endpoint);

    const getLoopLibrarySong = async (
      endpoint: string,
      songId: string,
    ): Promise<MusicKit.LibrarySongs | null> => {
      const response = await searchLibrarySongs(
        `${endpoint}&limit=25` as MusicKit.AppleMusicAPI.SearchLibrarySongsUrl,
      );

      if (!("results" in response.data)) {
        return null;
      }

      const track = response.data.results["library-songs"]?.data.find(
        (trk) => trk.attributes.playParams?.purchasedId === options.songId,
      );

      if (track) {
        return track;
      }

      if (response.data.results["library-songs"]?.next) {
        return await getLoopLibrarySong(
          response.data.results["library-songs"]?.next,
          songId,
        );
      }

      return null;
    };

    try {
      await this.reset();

      // ライブラリ参照権限がない場合はプレビュー再生
      // または
      // 強制的にプレビュー再生
      if (!(await this.isAuthorized()).result || options.forcePreview) {
        if (options.previewUrl) {
          this.resetPreviewPlayer();
          if (options.forcePreview) {
            console.log(
              "🎵 ------ force preview ---------",
              options.previewUrl,
            );
          } else {
            console.log(
              "🎵 ------ unAuth preview ---------",
              options.previewUrl,
            );
          }
          this.setPlayer(options.previewUrl);
          return { result: true };
        }
        return { result: false };
      }

      // ライブラリIDが存在する場合はライブラリの曲を再生
      if (options.librarySongId) {
        console.log("🎵 ------ iTunes Cache ---------");
        await MusicKit.getInstance().setQueue({
          songs: [options.librarySongId],
        });
        return {
          librarySongId: options.librarySongId,
          result: true,
        };
      }

      const catalogResult = await MusicKit.getInstance().api.music(
        `v1/catalog/jp/songs/${options.songId}` as MusicKit.AppleMusicAPI.SongsUrl,
      );

      if (!("data" in catalogResult.data)) {
        return { result: false };
      }

      const track = catalogResult.data.data[0];
      if (!track) {
        return { result: false };
      }

      const playable = Boolean(track.attributes.playParams);
      if (playable) {
        console.log("🎵 ------ Apple Music ---------");
        await MusicKit.getInstance().setQueue({ songs: [options.songId] });
      } else {
        const purchasedTrack = await getLibrarySong(
          options.songTitle ?? track.attributes.name,
          options.songId,
        );
        const previewUrl = track.attributes.previews[0]?.url;

        if (purchasedTrack) {
          console.log("🎵 ------ iTunes ---------");
          await MusicKit.getInstance().setQueue({ songs: [purchasedTrack.id] });
          return {
            albumTitle: purchasedTrack.attributes.albumName,
            librarySongId: purchasedTrack.id,
            result: true,
          };
        } else if (previewUrl) {
          console.log("🎵 ------ preview ---------", previewUrl);
          this.setPlayer(previewUrl);
        }
      }
    } catch (error) {
      try {
        // Apple ID が 404 の場合
        console.log(error);

        if (!options.songTitle) {
          return { result: false };
        }

        const purchasedTrack = await getLibrarySong(
          options.songTitle,
          options.songId,
        );
        const previewUrl = options.previewUrl;

        if (purchasedTrack) {
          console.log("🎵 ------ iTunes ---------");
          await MusicKit.getInstance().setQueue({ songs: [purchasedTrack.id] });
          return {
            albumTitle: purchasedTrack.attributes.albumName,
            librarySongId: purchasedTrack.id,
            result: true,
          };
        } else if (previewUrl) {
          console.log("🎵 ------ preview ---------", previewUrl);
          this.setPlayer(previewUrl);
        }
      } catch (error2) {
        console.log(error2);
        return { result: false };
      }
    }
    return { result: true };
  }

  setPlayer (previewUrl: string): void {
    this.player = new Howl({
      autoplay: false,
      html5: true,
      preload: false,
      src: previewUrl,
      volume: 0,
    });

    const fadeouttime = 2000;

    const fadeIn = () => {
      if (!this.player) {
        return;
      }

      if (this.player.volume() === 0) {
        this.player.fade(0, this.defaultVolume, fadeouttime);
      } else {
        this.player.volume(this.defaultVolume);
      }
    };

    const fadeOut = () => {
      if (!this.player || this.fadeoutId !== undefined) {
        return;
      }

      const seek = this.player.seek() as number;

      const time = (this.player.duration() - seek) as number;

      const ms = time * 1000;

      const timeout = ms - fadeouttime;

      this.fadeoutId = setTimeout(() => {
        if (!this.player) {
          return;
        }
        this.player.fade(this.defaultVolume, 0, fadeouttime);
      }, timeout);
    };

    this.player.on("play", () => {
      fadeIn();
      fadeOut();
      this.notifyListeners("playbackStateDidChange", { result: "playing" });
    });
    this.player.on("pause", () => {
      this.resetFadeoutId();
      this.notifyListeners("playbackStateDidChange", { result: "paused" });
    });
    this.player.on("end", () => {
      this.resetFadeoutId();
      this.notifyListeners("playbackStateDidChange", { result: "completed" });
    });
    this.player.on("stop", () => {
      this.resetFadeoutId();
      this.notifyListeners("playbackStateDidChange", { result: "stopped" });
    });
    this.player.on("seek", () => {
      this.resetFadeoutId();
      fadeOut();
    });
  }
}
