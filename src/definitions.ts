import type { PluginListenerHandle } from '@capacitor/core';

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

export interface GetLibraryAlbumsOptions {
  limit: number;
  offset: number;
}

export interface AlbumResult {
  id: string;
  name: string;
  artworkUrl?: string;
}

export interface TrackResult {
  id: string;
  catalogId?: string;
  purchasedId?: string;
  name: string;
  durationMs: number;
  discNumber: number;
  trackNumber: number;
  artworkUrl?: string;
}

export interface GetLibraryAlbumsResult {
  albums: AlbumResult[];
  hasNext: boolean;
}

export interface GetLibraryAlbumOptions {
  id: string;
}

export interface GetLibraryTrackOptions {
  id: string;
}

export interface GetLibraryAlbumResult {
  album?: AlbumResult & {
    tracks: TrackResult[];
  };
}

export interface GetLibraryTrackResult {
  track?: TrackResult;
}

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
  getLibraryAlbums(
    options: GetLibraryAlbumsOptions,
  ): Promise<GetLibraryAlbumsResult>;
  getLibraryAlbum(
    options: GetLibraryAlbumOptions,
  ): Promise<GetLibraryAlbumResult>;
  getLibraryTrack(
    options: GetLibraryTrackOptions,
  ): Promise<GetLibraryTrackResult>;
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
