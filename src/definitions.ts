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
  artistName: string;
  artworkUrl?: string;
  copyright: string;
  genreNames: string[];
  isCompilation: boolean;
  isComplete: boolean;
  isMasteredForItunes: boolean;
  isSingle: boolean;
  name: string;
  recordLabel: string;
  releaseDate: string;
  trackCount: number;
  upc: string;
}

export interface LibraryAlbum {
  id: string;
  name: string;
  artworkUrl?: string;
}

export interface CatalogTrack {
  id: string;
  albumName: string;
  artistName: string;
  artworkUrl?: string;
  composerName: string;
  discNumber: number;
  durationMs: number;
  genreNames: string[];
  hasLyrics: boolean;
  isAppleDigitalMaster: boolean;
  isrc: string;
  name: string;
  previews: string[];
  releaseDate: string;
  trackNumber: number;
}

export interface LibraryTrack {
  id: string;
  name: string;
  durationMs: number;
  discNumber?: number;
  trackNumber?: number;
  artworkUrl?: string;
}

export interface CatalogPlaylist {
  id: string;
  artworkUrl?: string;
  curatorName: string;
  description: string;
  shortDescription: string;
  isChart: boolean;
  lastModifiedDate: string;
  name: string;
  playlistType: string;
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
export type RatingCategoryType = 'artists' | 'albums' | 'songs' | 'playlists';
export type RatingType = RatingCategoryType | `library-${RatingCategoryType}`;

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
  config: MusicKit.Configuration;
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

export type GetCatalogArtistOptions = GetSingleDataOptions<
  'albums' | 'genres' | 'music-videos' | 'playlists' | 'station'
>;

export interface GetCatalogArtistResult {
  artist?: CatalogArtist;
  albums?: CatalogAlbum[];
}

export type GetLibraryArtistOptions = GetSingleDataOptions<
  'albums' | 'catalog'
>;

export interface GetLibraryArtistResult {
  artist?: LibraryArtist;
  albums?: LibraryAlbum[];
  catalog?: CatalogArtist[];
}

export type GetLibraryArtistsResult = {
  artists: LibraryArtist[];
} & GetMultiDataResult;

export type GetLibraryAlbumOptions = GetSingleDataOptions<
  'artists' | 'catalog' | 'tracks'
>;

export interface GetLibraryAlbumResult {
  albums: MusicKit.LibraryAlbums[];
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
  catalog?: CatalogTrack[];
}

export type GetLibraryTracksResult = {
  tracks: LibraryTrack[];
} & GetMultiDataResult;

export type GetLibraryPlaylistOptions = GetSingleDataOptions<
  'catalog' | 'tracks'
>;

export interface GetLibraryPlaylistResult {
  playlist?: LibraryPlaylist;
  tracks?: LibraryTrack[];
  catalog?: CatalogPlaylist[];
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

export type PlaybackState = keyof typeof MusicKit.PlaybackStates;

export type PlaybackStateDidChangeResult = {
  state: PlaybackState;
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
