import { WebPlugin } from "@capacitor/core";

import type {
  CapacitorMusicKitPlugin,
  AuthorizationStatus,
  EchoOptions,
  EchoResult,
  ConfigureOptions,
  GetLibraryAlbumsResult,
  GetLibraryAlbumResult,
  SetQueueOptions,
  ActionResult,
  PlayOptions,
  LibraryTrack,
  GetCurrentTrackResult,
  GetCurrentIndexResult,
  GetCurrentPlaybackTimeResult,
  SeekToTimeOptions,
  GetQueueTracksResult,
  SetRepeatModeOptions,
  getRepeatModeResult,
  GetLibraryTrackResult,
  PlaybackStateDidChangeResult,
  NowPlayingItemDidChangeResult,
  AuthorizationStatusDidChangeResult,
  GetMultiDataOptions,
  LibraryArtist,
  LibraryAlbum,
  GetLibraryTracksResult,
  GetLibraryArtistResult,
  GetLibraryArtistsResult,
  GetLibraryPlaylistResult,
  LibraryPlaylist,
  GetLibraryPlaylistsResult,
  RatingsResult,
  GetRatingsOptions,
  AddRatingOptions,
  ActionRatingsResult,
  DeleteRatingOptions,
  GetLibraryArtistOptions,
  GetLibraryAlbumOptions,
  GetLibraryTrackOptions,
  GetLibraryPlaylistOptions,
  CatalogArtist,
  PlaybackState,
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
    let track: LibraryTrack | undefined;
    const item = data.item;
    if (item) {
      track = this.toLibraryTrackResult(item);
    }
    const index = MusicKit.getInstance().nowPlayingItemIndex;
    const result: NowPlayingItemDidChangeResult = { index,
      track };
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

  toLibraryArtistResult = (artist: MusicKit.LibraryArtists): LibraryArtist => ({
    id: artist.id,
    name: artist.attributes.name,
  });

  toLibraryAlbumResult = (album: MusicKit.LibraryAlbums): LibraryAlbum => ({
    artworkUrl: album.attributes.artwork?.url,
    id: album.id,
    name: album.attributes.name,
  });

  toLibraryTrackResult = (
    track: MusicKit.LibrarySongs | MusicKit.MediaItem,
  ): LibraryTrack => ({
    artworkUrl: track.attributes.artwork?.url,
    discNumber: track.attributes.discNumber,
    durationMs: track.attributes.durationInMillis,
    id: track.id,
    name: track.attributes.name,
    trackNumber: track.attributes.trackNumber,
  });

  toLibraryPlaylist = (
    playlist: MusicKit.LibraryPlaylists,
  ): LibraryPlaylist => ({
    artworkUrl: playlist.attributes.artwork?.url,
    description: playlist.attributes.description?.standard,
    id: playlist.id,
    name: playlist.attributes.name,
  });

  include = <T>(relation: T, include?: T[]): boolean =>
    include?.includes(relation) ?? false;

  relationParams<T> (relations: T[], includes?: T[]): { include: T[] } {
    const include: T[] = [];
    relations.forEach((relation) => {
      this.include(relation, includes) && include.push(relation);
    });
    return { include };
  }

  selectionLibraryArtists (
    item: MusicKit.LibraryAlbums | MusicKit.LibrarySongs,
  ): LibraryArtist[] {
    const items: LibraryArtist[] = [];
    item.relationships.artists?.data.forEach((artist) => {
      items.push(this.toLibraryArtistResult(artist));
    });
    return items;
  }

  selectionLibraryAlbums (
    item: MusicKit.LibraryArtists | MusicKit.LibrarySongs,
  ): LibraryAlbum[] {
    const items: LibraryAlbum[] = [];
    item.relationships.albums?.data.forEach((album) => {
      items.push(this.toLibraryAlbumResult(album));
    });
    return items;
  }

  selectionLibraryTracks (
    item: MusicKit.LibraryAlbums | MusicKit.LibraryPlaylists,
  ): LibraryTrack[] {
    const items: LibraryTrack[] = [];
    item.relationships.tracks?.data.forEach((track) => {
      if (track.type === "library-songs") {
        items.push(this.toLibraryTrackResult(track));
      }
    });
    return items;
  }

  async nextTracks (
    options: { include?: string[] },
    nextTrackUrl: string | undefined,
  ): Promise<LibraryTrack[]> {
    const tracks: LibraryTrack[] = [];

    if (options.include?.includes("tracks") && nextTrackUrl) {
      let hasNext = false;
      let fetchUrl = `${nextTrackUrl}&limit=100`;

      do {
        hasNext = false;
        const response = await MusicKit.getInstance().api.music(
          fetchUrl as MusicKit.Music.LibrarySongsUrl,
        );
        const data = response.data;
        if (data) {
          data.data.forEach((track) => {
            tracks.push(this.toLibraryTrackResult(track));
          });
          if (data.next) {
            hasNext = true;
            fetchUrl = `${data.next}&limit=100`;
          }
        }
      } while (hasNext);
    }

    return tracks;
  }

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
  ): Promise<GetLibraryArtistResult> {
    let artist: LibraryArtist | undefined;
    let albums: LibraryAlbum[] | undefined;
    let catalog: CatalogArtist[] | undefined;

    const params = this.relationParams(["albums", "catalog"], options.include);

    try {
      // Artist
      const fetchUrl = `/v1/me/library/artists/${options.id}` as const;
      const response = await MusicKit.getInstance().api.music(fetchUrl, params);
      const item = response.data.data.find((itm) => itm.id === options.id);
      if (item) {
        artist = this.toLibraryArtistResult(item);

        // Albums
        if (this.include("albums", options.include)) {
          albums = this.selectionLibraryAlbums(item);
        }
      }
    } catch (error) {
      console.log(error);
    }

    return { albums,
      artist,
      catalog };
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

    const artists: LibraryArtist[] = response.data.data.map((item) =>
      this.toLibraryArtistResult(item),
    );

    const hasNext =
      response.data.meta?.total !== options.offset + response.data.data.length;

    return { artists,
      hasNext,
      total: response.data.meta?.total ?? 0 };
  }

  async getLibraryAlbum (
    options: GetLibraryAlbumOptions,
  ): Promise<GetLibraryAlbumResult> {
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/library/albums/${options.id}` as const,
      this.relationParams(["tracks"], options.include),
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

  async getLibraryTrack (
    options: GetLibraryTrackOptions,
  ): Promise<GetLibraryTrackResult> {
    let track: LibraryTrack | undefined;
    let artists: LibraryArtist[] | undefined;
    let albums: LibraryAlbum[] | undefined;

    try {
      const params = this.relationParams(
        ["albums", "artists"],
        options.include,
      );
      const fetchUrl = `/v1/me/library/songs/${options.id}` as const;
      const response = await MusicKit.getInstance().api.music(fetchUrl, params);
      const resultTrack = response.data.data[0];

      if (resultTrack) {
        track = this.toLibraryTrackResult(resultTrack);

        // Artists
        if (this.include("artists", options.include)) {
          artists = [];
          resultTrack.relationships.artists?.data.forEach((artist) => {
            artists?.push(this.toLibraryArtistResult(artist));
          });
        }

        // Albums
        if (this.include("albums", options.include)) {
          albums = [];
          resultTrack.relationships.albums?.data.forEach((album) => {
            albums?.push(this.toLibraryAlbumResult(album));
          });
        }
      }
    } catch (error) {
      console.log(error);
    }

    return { albums,
      artists,
      track };
  }

  async getLibraryTracks (
    options: GetMultiDataOptions,
  ): Promise<GetLibraryTracksResult> {
    const idsOption = options.ids ? { ids: options.ids } : {};
    const response = await MusicKit.getInstance().api.music(
      "/v1/me/library/songs",
      {
        limit: options.limit,
        offset: options.offset,
        ...idsOption,
      },
    );

    const tracks: LibraryTrack[] = response.data.data.map((item) =>
      this.toLibraryTrackResult(item),
    );

    const hasNext =
      response.data.meta?.total !== options.offset + response.data.data.length;

    return { hasNext,
      total: response.data.meta?.total ?? 0,
      tracks };
  }

  async getLibraryPlaylist (
    options: GetLibraryPlaylistOptions,
  ): Promise<GetLibraryPlaylistResult> {
    let playlist: LibraryPlaylist | undefined;
    let tracks: LibraryTrack[] | undefined;

    let nextTracksUrl: string | undefined;

    try {
      // Playlist
      const params = this.relationParams(["tracks"], options.include);
      const fetchUrl = `/v1/me/library/playlists/${options.id}` as const;
      const response = await MusicKit.getInstance().api.music(fetchUrl, params);
      const item = response.data.data.find((itm) => itm.id === options.id);
      if (item) {
        playlist = this.toLibraryPlaylist(item);

        // Tracks
        if (this.include("tracks", options.include)) {
          nextTracksUrl = item.relationships.tracks?.next;
          tracks = this.selectionLibraryTracks(item);
        }
      }

      // Next tracks
      if (playlist) {
        tracks = tracks?.concat(await this.nextTracks(options, nextTracksUrl));
      }
    } catch (error) {
      console.log(error);
    }

    return { playlist,
      tracks };
  }

  async getLibraryPlaylists (
    options: GetMultiDataOptions,
  ): Promise<GetLibraryPlaylistsResult> {
    const idsOption = options.ids ? { ids: options.ids } : {};
    const response = await MusicKit.getInstance().api.music(
      "/v1/me/library/albums",
      {
        limit: options.limit,
        offset: options.offset,
        ...idsOption,
      },
    );

    const playlists: LibraryPlaylist[] = response.data.data.map((item) =>
      this.toLibraryAlbumResult(item),
    );

    const hasNext =
      response.data.meta?.total !== options.offset + response.data.data.length;

    return { hasNext,
      playlists,
      total: response.data.meta?.total ?? 0 };
  }

  async getRatings (options: GetRatingsOptions): Promise<ActionRatingsResult> {
    const type = options.type.replace("tracks", "songs");
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/ratings/${type}` as const,
      { ids: options.ids },
    );

    const ratings: RatingsResult = {};
    response.data.data.forEach((rating) => {
      if (rating.attributes?.value) {
        ratings[rating.id] = rating.attributes.value;
      }
    });

    return { ratings };
  }

  async addRating (options: AddRatingOptions): Promise<ActionResult> {
    let result = false;

    const type = options.type.replace("tracks", "songs");
    await MusicKit.getInstance().api.music(
      `/v1/me/ratings/${type}/${options.id}` as const,
      {},
      {
        fetchOptions: {
          body: JSON.stringify({
            attributes: {
              value: options.value,
            },
            type: "ratings",
          }),
          method: "PUT",
        },
      },
    );

    result = true;
    return { result };
  }

  async deleteRating (options: DeleteRatingOptions): Promise<ActionResult> {
    let result = false;

    const type = options.type.replace("tracks", "songs");
    await MusicKit.getInstance().api.music(
      `/v1/me/ratings/${type}/${options.id}` as const,
      {},
      { fetchOptions: { method: "DELETE" } },
    );

    result = true;
    return { result };
  }

  async getCurrentTrack (): Promise<GetCurrentTrackResult> {
    let track: LibraryTrack | undefined;
    try {
      const item = MusicKit.getInstance().queue.currentItem;
      if (item) {
        track = this.toLibraryTrackResult(item);
      }
    } catch (error) {
      console.log(error);
    }
    return { track };
  }

  async getQueueTracks (): Promise<GetQueueTracksResult> {
    const tracks: LibraryTrack[] = [];
    try {
      MusicKit.getInstance().queue.items.map((item) =>
        tracks.push(this.toLibraryTrackResult(item)),
      );
    } catch (error) {
      console.log(error);
    }
    return { tracks };
  }

  async getCurrentIndex (): Promise<GetCurrentIndexResult> {
    let index = -1;
    try {
      index = MusicKit.getInstance().nowPlayingItemIndex;
    } catch (error) {
      console.log(error);
    }
    return { index };
  }

  async getCurrentPlaybackTime (): Promise<GetCurrentPlaybackTimeResult> {
    let time = 0;
    try {
      time = MusicKit.getInstance().currentPlaybackTime;
    } catch (error) {
      console.log(error);
    }
    return { time };
  }

  async getRepeatMode (): Promise<getRepeatModeResult> {
    const modeArray: getRepeatModeResult["mode"][] = ["none", "one", "all"];
    let mode: getRepeatModeResult["mode"] = "none";
    try {
      mode = modeArray[MusicKit.getInstance().repeatMode] ?? "none";
    } catch (error) {
      console.log(error);
    }
    return { mode };
  }

  async setRepeatMode (options: SetRepeatModeOptions): Promise<ActionResult> {
    let result = false;
    const modeMap = { all: 2,
      none: 0,
      one: 1 } as const;
    try {
      MusicKit.getInstance().repeatMode = modeMap[options.mode];
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async setQueue (options: SetQueueOptions): Promise<ActionResult> {
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

  async play (options: PlayOptions): Promise<ActionResult> {
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

  async pause (): Promise<ActionResult> {
    let result = false;
    try {
      await MusicKit.getInstance().pause();
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async stop (): Promise<ActionResult> {
    let result = false;
    try {
      await MusicKit.getInstance().stop();
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async nextPlay (): Promise<ActionResult> {
    let result = false;
    try {
      await MusicKit.getInstance().skipToNextItem();
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async previousPlay (): Promise<ActionResult> {
    let result = false;
    try {
      await MusicKit.getInstance().skipToPreviousItem();
      result = true;
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async seekToTime (options: SeekToTimeOptions): Promise<ActionResult> {
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
