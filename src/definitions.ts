import type { PluginListenerHandle } from '@capacitor/core';

export interface PlayParameters {
  id: string;
  isLibrary: boolean;
  kind: string;
  catalogId?: string;
  purchasedId?: string;
  globalId?: string;
}

export interface CatalogArtist {
  id: string;
  name: string;
  artworkUrl?: string;
  genreNames: string[];
}

export interface LibraryArtist {
  id: string;
  name: string;
}

export interface CatalogAlbum {
  id: string;
  name: string;
  artworkUrl?: string;
}

export interface LibraryAlbum {
  id: string;
  name: string;
  artworkUrl?: string;
}

export interface CatalogTrack {
  id: string;
  name: string;
  durationMs: number;
  discNumber: number;
  trackNumber: number;
  artworkUrl?: string;
}

export interface LibraryTrack {
  id: string;
  name: string;
  durationMs: number;
  discNumber: number;
  trackNumber: number;
  artworkUrl?: string;
}

export interface LibraryPlaylist {
  id: string;
  name: string;
  description?: string;
  artworkUrl?: string;
}

/*
 *  likes (1)
 *  dislikes (-1)
 */
export type Rating = -1 | 1;
export type RatingsResult = {
  [key: string]: Rating;
};

export type CategoryType = 'artists' | 'albums' | 'tracks' | 'playlists';
export type RatingType = CategoryType | `library-${CategoryType}`;

export interface ActionResult {
  result: boolean;
}

export interface EchoOptions {
  value: string;
}

export interface EchoResult {
  value: string;
}

export interface ConfigureOptions {
  config: MusicKit.Config;
}

export interface GetSingleDataOptions<T> {
  id: string;
  include?: T[];
}

export interface GetMultiDataOptions {
  ids?: string[];
  limit: number;
  offset: number;
}

export interface GetMultiDataResult {
  total: number;
  hasNext: boolean;
}

export type GetLibraryArtistOptions = GetSingleDataOptions<
  'albums' | 'catalog'
>;

export interface GetLibraryArtistResult {
  artist?: LibraryArtist;
  albums?: LibraryAlbum[];
}

export type GetLibraryArtistsResult = {
  artists: LibraryArtist[];
} & GetMultiDataResult;

export type GetLibraryAlbumOptions = GetSingleDataOptions<
  'artists' | 'catalog' | 'tracks'
>;

export interface GetLibraryAlbumResult {
  album?: LibraryAlbum;
  tracks?: LibraryTrack[];
  artists?: LibraryArtist[];
}

export type GetLibraryAlbumsResult = {
  albums: LibraryAlbum[];
} & GetMultiDataResult;

export type GetLibraryTrackOptions = GetSingleDataOptions<
  'albums' | 'artists' | 'catalog'
>;

export interface GetLibraryTrackResult {
  track?: LibraryTrack;
  artists?: LibraryArtist[];
  albums?: LibraryAlbum[];
}

export type GetLibraryTracksResult = {
  tracks: LibraryTrack[];
} & GetMultiDataResult;

export type GetLibraryPlaylistOptions = GetSingleDataOptions<
  'albums' | 'artists' | 'catalog'
>;

export interface GetLibraryPlaylistResult {
  playlist?: LibraryPlaylist;
  tracks?: LibraryTrack[];
}

export type GetLibraryPlaylistsResult = {
  playlists: LibraryPlaylist[];
} & GetMultiDataResult;

export type GetRatingsOptions = {
  type: RatingType;
  ids: string[];
};

export type ActionRatingsResult = {
  ratings: RatingsResult;
};

export type AddRatingOptions = {
  type: RatingType;
  id: string;
  value: Rating;
};

export type DeleteRatingOptions = {
  type: RatingType;
  id: string;
};

export interface GetCurrentTrackResult {
  track?: LibraryTrack;
}

export interface GetQueueTracksResult {
  tracks: LibraryTrack[];
}

export interface GetCurrentIndexResult {
  index: number;
}

export interface GetCurrentPlaybackTimeResult {
  time: number;
}

export interface getRepeatModeResult {
  mode: 'none' | 'one' | 'all';
}

export interface SetRepeatModeOptions {
  mode: 'none' | 'one' | 'all';
}

export interface SetQueueOptions {
  ids: string[];
}

export interface PlayOptions {
  index?: number;
}

export interface SeekToTimeOptions {
  time: number;
}

export type PlaybackStates = keyof typeof MusicKit.PlaybackStates;

export type PlaybackStateDidChangeResult = {
  state: PlaybackStates;
};

export type PlaybackStateDidChangeListener = (
  data: PlaybackStateDidChangeResult,
) => void;

export type NowPlayingItemDidChangeResult = {
  track: LibraryTrack | undefined;
  index: number;
};

export type NowPlayingItemDidChangeListener = (
  data: NowPlayingItemDidChangeResult,
) => void;

export type AuthorizationStatus =
  | 'unavailable'
  | 'notDetermined'
  | 'denied'
  | 'restricted'
  | 'authorized';

export type AuthorizationStatusDidChangeResult = {
  status: AuthorizationStatus;
};

export type AuthorizationStatusDidChangeListener = (
  data: AuthorizationStatusDidChangeResult,
) => void;

export interface CapacitorMusicKitPlugin {
  echo(options: EchoOptions): Promise<EchoResult>;
  configure(options: ConfigureOptions): Promise<ActionResult>;
  isAuthorized(): Promise<ActionResult>;
  hasMusicSubscription(): Promise<ActionResult>;
  authorize(): Promise<void>;
  unauthorize(): Promise<void>;
  getLibraryArtist(
    options: GetLibraryArtistOptions,
  ): Promise<GetLibraryArtistResult>;
  getLibraryArtists(
    options: GetMultiDataOptions,
  ): Promise<GetLibraryArtistsResult>;
  getLibraryAlbum(
    options: GetLibraryAlbumOptions,
  ): Promise<GetLibraryAlbumResult>;
  getLibraryAlbums(
    options: GetMultiDataOptions,
  ): Promise<GetLibraryAlbumsResult>;
  getLibraryTrack(
    options: GetLibraryTrackOptions,
  ): Promise<GetLibraryTrackResult>;
  getLibraryTracks(
    options: GetMultiDataOptions,
  ): Promise<GetLibraryTracksResult>;
  getLibraryPlaylist(
    options: GetLibraryPlaylistOptions,
  ): Promise<GetLibraryPlaylistResult>;
  getLibraryPlaylists(
    options: GetMultiDataOptions,
  ): Promise<GetLibraryPlaylistsResult>;
  getRatings(options: GetRatingsOptions): Promise<ActionRatingsResult>;
  addRating(options: AddRatingOptions): Promise<ActionResult>;
  deleteRating(options: DeleteRatingOptions): Promise<ActionResult>;
  getCurrentTrack(): Promise<GetCurrentTrackResult>;
  getQueueTracks(): Promise<GetQueueTracksResult>;
  getCurrentIndex(): Promise<GetCurrentIndexResult>;
  getCurrentPlaybackTime(): Promise<GetCurrentPlaybackTimeResult>;
  getRepeatMode(): Promise<getRepeatModeResult>;
  setRepeatMode(options: SetRepeatModeOptions): Promise<ActionResult>;
  setQueue(options: SetQueueOptions): Promise<ActionResult>;
  play(options: PlayOptions): Promise<ActionResult>;
  pause(): Promise<ActionResult>;
  stop(): Promise<ActionResult>;
  nextPlay(): Promise<ActionResult>;
  previousPlay(): Promise<ActionResult>;
  seekToTime(options: SeekToTimeOptions): Promise<ActionResult>;
  addListener(
    eventName: 'playbackStateDidChange',
    listenerFunc: PlaybackStateDidChangeListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
  addListener(
    eventName: 'nowPlayingItemDidChange',
    listenerFunc: NowPlayingItemDidChangeListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
  addListener(
    eventName: 'authorizationStatusDidChange',
    listenerFunc: AuthorizationStatusDidChangeListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
}
