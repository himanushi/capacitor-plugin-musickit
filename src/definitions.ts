import type { PluginListenerHandle } from '@capacitor/core';

export interface PlayParameters {
  id: string;
  isLibrary: boolean;
  kind: string;
  catalogId?: string;
  purchasedId?: string;
  globalId?: string;
}

export interface ArtistResult {
  id: string;
  name: string;
  artworkUrl?: string;
}

export interface AlbumResult {
  id: string;
  name: string;
  artworkUrl?: string;
}

export interface TrackResult {
  id: string;
  name: string;
  durationMs: number;
  discNumber: number;
  trackNumber: number;
  artworkUrl?: string;
}

export interface PlaylistResult {
  id: string;
  name: string;
  description?: string;
  artworkUrl?: string;
}

/*
 *  likes (1)
 *  dislikes (-1)
 */
export type RatingsResult = {
  [key: string]: -1 | 1;
};

export type CategoryType = 'artists' | 'albums' | 'songs' | 'playlists';
export type RatingType = CategoryType | `library-${CategoryType}`;

export type Relation = 'artists' | 'albums' | 'tracks';

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

export interface GetSingleDataOptions {
  id: string;
  include?: Relation[];
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

export interface GetLibraryArtistResult {
  artist?: ArtistResult;
  albums?: AlbumResult[];
  tracks?: TrackResult[];
}

export type GetLibraryArtistsResult = {
  artists: ArtistResult[];
} & GetMultiDataResult;

export interface GetLibraryAlbumResult {
  album?: AlbumResult;
  tracks?: TrackResult[];
  artists?: ArtistResult[];
}

export type GetLibraryAlbumsResult = {
  albums: AlbumResult[];
} & GetMultiDataResult;

export interface GetLibraryTrackResult {
  track?: TrackResult;
  artists?: ArtistResult[];
  albums?: AlbumResult[];
}

export type GetLibraryTracksResult = {
  tracks: TrackResult[];
} & GetMultiDataResult;

export interface GetLibraryPlaylistResult {
  playlist?: PlaylistResult;
  tracks?: TrackResult[];
}

export type GetLibraryPlaylistsResult = {
  playlists: PlaylistResult[];
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
  value: -1 | 1;
};

export type DeleteRatingOptions = {
  type: RatingType;
  id: string;
};

export interface GetCurrentTrackResult {
  track?: TrackResult;
}

export interface GetQueueTracksResult {
  tracks: TrackResult[];
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
  track: TrackResult | undefined;
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
  /**
   * For testing.
   */
  echo(options: EchoOptions): Promise<EchoResult>;
  /**
   * Required for web, if executed outside of web, nothing will be done.
   */
  configure(options: ConfigureOptions): Promise<ActionResult>;
  /**
   * True if authenticated.
   */
  isAuthorized(): Promise<ActionResult>;
  /**
   * True if you have an Apple Music subscription, not true if you have Apple Music Voice.
   */
  hasMusicSubscription(): Promise<ActionResult>;
  authorize(): Promise<void>;
  unauthorize(): Promise<void>;
  getLibraryArtist(
    options: GetSingleDataOptions,
  ): Promise<GetLibraryArtistResult>;
  getLibraryArtists(
    options: GetMultiDataOptions,
  ): Promise<GetLibraryArtistsResult>;
  getLibraryAlbum(
    options: GetSingleDataOptions,
  ): Promise<GetLibraryAlbumResult>;
  getLibraryAlbums(
    options: GetMultiDataOptions,
  ): Promise<GetLibraryAlbumsResult>;
  getLibraryTrack(
    options: GetSingleDataOptions,
  ): Promise<GetLibraryTrackResult>;
  getLibraryTracks(
    options: GetMultiDataOptions,
  ): Promise<GetLibraryTracksResult>;
  getLibraryPlaylist(
    options: GetSingleDataOptions,
  ): Promise<GetLibraryPlaylistResult>;
  getLibraryPlaylists(
    options: GetMultiDataOptions,
  ): Promise<GetLibraryPlaylistsResult>;
  getRatings(options: GetRatingsOptions): Promise<ActionRatingsResult>;
  addRating(options: AddRatingOptions): Promise<ActionRatingsResult>;
  deleteRating(options: DeleteRatingOptions): Promise<ActionRatingsResult>;
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
