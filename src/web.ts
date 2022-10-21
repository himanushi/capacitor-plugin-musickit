import { WebPlugin } from '@capacitor/core';

import type {
  Relation,
  CapacitorMusicKitPlugin,
  PlaybackStates,
  AuthorizationStatus,
  EchoOptions,
  EchoResult,
  ConfigureOptions,
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
  PlaybackStateDidChangeResult,
  NowPlayingItemDidChangeResult,
  AuthorizationStatusDidChangeResult,
  GetMultiDataOptions,
  GetSingleDataOptions,
  ArtistResult,
  AlbumResult,
  GetLibraryTracksResult,
  GetLibraryArtistResult,
  GetLibraryArtistsResult,
  GetLibraryPlaylistResult,
  PlaylistResult,
  GetLibraryPlaylistsResult,
  RatingsResult,
  GetRatingsOptions,
  AddRatingOptions,
  ActionRatingsResult,
  DeleteRatingOptions,
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
    const state = MusicKit.PlaybackStates[data.state] as PlaybackStates;
    const result: PlaybackStateDidChangeResult = { state };
    this.notifyListeners('playbackStateDidChange', result);
  };

  private nowPlayingItemDidChange = (
    data: Parameters<MusicKit.NowPlayingItemDidChange['callback']>[0],
  ) => {
    let track: TrackResult | undefined;
    const item = data.item;
    if (item) {
      track = this.toResultTrack(item);
    }
    const index = MusicKit.getInstance().nowPlayingItemIndex;
    const result: NowPlayingItemDidChangeResult = { track, index };
    this.notifyListeners('nowPlayingItemDidChange', result);
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
    const result: AuthorizationStatusDidChangeResult = { status };
    this.notifyListeners('authorizationStatusDidChange', result);
  };

  toResultArtist = (artist: MusicKit.APIResultData): ArtistResult => ({
    id: artist.id,
    name: artist.attributes.name,
    artworkUrl: artist.attributes.artwork?.url,
  });

  toResultAlbum = (album: MusicKit.APIResultData): AlbumResult => ({
    id: album.id,
    name: album.attributes.name,
    artworkUrl: album.attributes.artwork?.url,
  });

  toResultTrack = (track: MusicKit.APIResultData): TrackResult => ({
    id: track.id,
    name: track.attributes.name,
    durationMs: track.attributes.durationInMillis,
    discNumber: track.attributes.discNumber,
    trackNumber: track.attributes.trackNumber,
    artworkUrl: track.attributes.artwork?.url,
  });

  toResultPlaylist = (playlist: MusicKit.APIResultData): PlaylistResult => ({
    id: playlist.id,
    name: playlist.attributes.name,
    description: playlist.attributes.description?.standard,
    artworkUrl: playlist.attributes.artwork?.url,
  });

  include = (options: { include?: Relation[] }, relation: Relation): boolean =>
    options.include?.includes(relation) ?? false;

  relationParams(
    options: { include?: Relation[] },
    relations: Relation[],
  ): { include: Relation[] } {
    const include: Relation[] = [];
    relations.forEach(relation => {
      this.include(options, relation) && include.push(relation);
    });
    return { include };
  }

  selectionArtists(item: MusicKit.APIResultData): ArtistResult[] {
    const items: ArtistResult[] = [];
    item.relationships.artists?.data.forEach(artist => {
      items.push(this.toResultArtist(artist));
    });
    return items;
  }

  selectionAlbums(item: MusicKit.APIResultData): AlbumResult[] {
    const items: AlbumResult[] = [];
    item.relationships.albums?.data.forEach(album => {
      items.push(this.toResultAlbum(album));
    });
    return items;
  }

  selectionTracks(item: MusicKit.APIResultData): TrackResult[] {
    const items: TrackResult[] = [];
    item.relationships.tracks?.data.forEach(track => {
      items.push(this.toResultTrack(track));
    });
    return items;
  }

  async nextTracks(
    options: { include?: Relation[] },
    nextTrackUrl: string | undefined,
  ): Promise<TrackResult[]> {
    const tracks: TrackResult[] = [];

    if (options.include?.includes('tracks') && nextTrackUrl) {
      let hasNext = false;
      let fetchUrl = `${nextTrackUrl}&limit=100`;

      do {
        hasNext = false;
        const response = await MusicKit.getInstance().api.music(fetchUrl);
        const data = response.data;
        if (data) {
          data.data.forEach(track => {
            tracks.push(this.toResultTrack(track));
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

  async getLibraryArtist(
    options: GetSingleDataOptions,
  ): Promise<GetLibraryArtistResult> {
    let artist: ArtistResult | undefined;
    let albums: AlbumResult[] | undefined;
    let tracks: TrackResult[] | undefined;

    let nextTrackUrl: string | undefined;
    const fetchUrl = `/v1/me/library/artists/${options.id}`;
    const params = this.relationParams(options, ['albums', 'tracks']);

    try {
      // Artist
      const response = await MusicKit.getInstance().api.music(fetchUrl, params);
      const item = response.data.data.find(itm => itm.id === options.id);
      if (item) {
        artist = this.toResultArtist(item);

        // Albums
        if (this.include(options, 'albums')) {
          albums = this.selectionAlbums(item);
        }

        // Tracks
        if (this.include(options, 'tracks')) {
          nextTrackUrl = item.relationships.tracks?.next;
          tracks = this.selectionTracks(item);
        }
      }

      // Next tracks
      if (artist && tracks) {
        tracks = tracks.concat(await this.nextTracks(options, nextTrackUrl));
      }
    } catch (error) {
      console.log(error);
    }

    return { artist, albums, tracks };
  }

  async getLibraryArtists(
    options: GetMultiDataOptions,
  ): Promise<GetLibraryArtistsResult> {
    const idsOption = options.ids ? { ids: options.ids } : {};
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/library/artists`,
      {
        limit: options.limit,
        offset: options.offset,
        ...idsOption,
      },
    );

    const artists: ArtistResult[] = response.data.data.map(item =>
      this.toResultArtist(item),
    );

    const hasNext =
      response.data.meta.total !== options.offset + response.data.data.length;

    return { artists, hasNext, total: response.data.meta.total };
  }

  async getLibraryAlbum(
    options: GetSingleDataOptions,
  ): Promise<GetLibraryAlbumResult> {
    let album: AlbumResult | undefined;
    let artists: ArtistResult[] | undefined;
    let tracks: TrackResult[] | undefined;

    let nextTracksUrl: string | undefined;
    const fetchUrl = `/v1/me/library/albums/${options.id}`;
    const params = this.relationParams(options, ['artists', 'tracks']);

    try {
      // Album
      const response = await MusicKit.getInstance().api.music(fetchUrl, params);
      const item = response.data.data.find(itm => itm.id === options.id);
      if (item) {
        album = this.toResultAlbum(item);

        // Tracks
        if (options.include?.includes('tracks')) {
          nextTracksUrl = item.relationships.tracks?.next;
          tracks = this.selectionTracks(item);
        }

        // Artists
        if (options.include?.includes('artists')) {
          artists = this.selectionArtists(item);
        }
      }

      // Next tracks
      if (album) {
        tracks = tracks?.concat(await this.nextTracks(options, nextTracksUrl));
      }
    } catch (error) {
      console.log(error);
    }

    return { album, artists, tracks };
  }

  async getLibraryAlbums(
    options: GetMultiDataOptions,
  ): Promise<GetLibraryAlbumsResult> {
    const idsOption = options.ids ? { ids: options.ids } : {};
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/library/albums`,
      {
        limit: options.limit,
        offset: options.offset,
        ...idsOption,
      },
    );

    const albums: AlbumResult[] = response.data.data.map(item =>
      this.toResultAlbum(item),
    );

    const hasNext =
      response.data.meta.total !== options.offset + response.data.data.length;

    return { albums, hasNext, total: response.data.meta.total };
  }

  async getLibraryTrack(
    options: GetSingleDataOptions,
  ): Promise<GetLibraryTrackResult> {
    let track: TrackResult | undefined;
    let artists: ArtistResult[] | undefined;
    let albums: AlbumResult[] | undefined;

    try {
      const fetchUrl = `/v1/me/library/songs/${options.id}`;
      const params = this.relationParams(options, ['albums', 'artists']);
      const response = await MusicKit.getInstance().api.music(fetchUrl, params);
      const resultTrack = response.data.data[0];

      if (resultTrack) {
        track = this.toResultTrack(resultTrack);

        // Artists
        if (options.include?.includes('artists')) {
          artists = [];
          resultTrack.relationships.artists?.data.forEach(artist => {
            artists?.push(this.toResultArtist(artist));
          });
        }

        // Albums
        if (options.include?.includes('albums')) {
          albums = [];
          resultTrack.relationships.albums?.data.forEach(album => {
            albums?.push(this.toResultAlbum(album));
          });
        }
      }
    } catch (error) {
      console.log(error);
    }

    return { track, artists, albums };
  }

  async getLibraryTracks(
    options: GetMultiDataOptions,
  ): Promise<GetLibraryTracksResult> {
    const idsOption = options.ids ? { ids: options.ids } : {};
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/library/tracks`,
      {
        limit: options.limit,
        offset: options.offset,
        ...idsOption,
      },
    );

    const tracks: TrackResult[] = response.data.data.map(item =>
      this.toResultTrack(item),
    );

    const hasNext =
      response.data.meta.total !== options.offset + response.data.data.length;

    return { tracks, hasNext, total: response.data.meta.total };
  }

  async getLibraryPlaylist(
    options: GetSingleDataOptions,
  ): Promise<GetLibraryPlaylistResult> {
    let playlist: PlaylistResult | undefined;
    let tracks: TrackResult[] | undefined;

    let nextTracksUrl: string | undefined;
    const fetchUrl = `/v1/me/library/playlists/${options.id}`;
    const params = this.relationParams(options, ['tracks']);

    try {
      // Playlist
      const response = await MusicKit.getInstance().api.music(fetchUrl, params);
      const item = response.data.data.find(itm => itm.id === options.id);
      if (item) {
        playlist = this.toResultPlaylist(item);

        // Tracks
        if (options.include?.includes('tracks')) {
          nextTracksUrl = item.relationships.tracks?.next;
          tracks = this.selectionTracks(item);
        }
      }

      // Next tracks
      if (playlist) {
        tracks = tracks?.concat(await this.nextTracks(options, nextTracksUrl));
      }
    } catch (error) {
      console.log(error);
    }

    return { playlist, tracks };
  }

  async getLibraryPlaylists(
    options: GetMultiDataOptions,
  ): Promise<GetLibraryPlaylistsResult> {
    const idsOption = options.ids ? { ids: options.ids } : {};
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/library/albums`,
      {
        limit: options.limit,
        offset: options.offset,
        ...idsOption,
      },
    );

    const playlists: PlaylistResult[] = response.data.data.map(item =>
      this.toResultAlbum(item),
    );

    const hasNext =
      response.data.meta.total !== options.offset + response.data.data.length;

    return { playlists, hasNext, total: response.data.meta.total };
  }

  async getRatings(options: GetRatingsOptions): Promise<ActionRatingsResult> {
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/ratings/${options.type}`,
      { ids: options.ids },
    );

    const ratings: RatingsResult = {};
    response.data.data.forEach(rating => {
      ratings[rating.id] = rating.attributes.value;
    });

    return { ratings };
  }

  async addRating(options: AddRatingOptions): Promise<ActionRatingsResult> {
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/ratings/${options.type}/${options.id}`,
      {},
      {
        fetchOptions: {
          method: 'PUT',
          body: JSON.stringify({
            attributes: {
              value: options.value,
            },
            type: 'ratings',
          }),
        },
      },
    );

    const ratings: RatingsResult = {};
    response.data.data.forEach(rating => {
      ratings[rating.id] = rating.attributes.value;
    });

    return { ratings };
  }

  async deleteRating(
    options: DeleteRatingOptions,
  ): Promise<ActionRatingsResult> {
    const response = await MusicKit.getInstance().api.music(
      `/v1/me/ratings/${options.type}/${options.id}`,
      {},
      { fetchOptions: { method: 'DELETE' } },
    );

    const ratings: RatingsResult = {};
    response.data.data.forEach(rating => {
      ratings[rating.id] = rating.attributes.value;
    });

    return { ratings };
  }

  async getCurrentTrack(): Promise<GetCurrentTrackResult> {
    let track: TrackResult | undefined;
    try {
      const item = MusicKit.getInstance().queue.currentItem;
      if (item) {
        track = this.toResultTrack(item);
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
        tracks.push(this.toResultTrack(item)),
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
