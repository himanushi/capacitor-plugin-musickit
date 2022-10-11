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

export interface GetLibraryAlbumsResult {
  albums: {
    id: string;
    title: string;
    artworkUrl?: string;
  }[];
  hasNext: boolean;
}

export interface GetLibraryAlbumOptions {
  id: string;
}

export interface TrackResult {
  title: string;
  id: string;
  durationMs: number;
  discNumber: number;
  trackNumber: number;
  artworkUrl?: string;
}

export interface GetLibraryAlbumResult {
  album?: {
    id: string;
    title: string;
    artworkUrl?: string;
    tracks: TrackResult[];
  };
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

export type PlaybackStateDidChangeListener = (data: {
  result: PlaybackStates;
}) => void;

export type NowPlayingItemDidChangeListener = (data: {
  result: TrackResult | undefined;
}) => void;

export type AuthorizationStatus =
  | 'unavailable'
  | 'notDetermined'
  | 'denied'
  | 'restricted'
  | 'authorized';

export type AuthorizationStatusDidChangeListener = (data: {
  result: AuthorizationStatus;
}) => void;

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
  getCurrentTrack(): Promise<GetCurrentTrackResult>;
  getQueueTracks(): Promise<GetQueueTracksResult>;
  getCurrentIndex(): Promise<GetCurrentIndexResult>;
  getCurrentPlaybackTime(): Promise<GetCurrentPlaybackTimeResult>;
  setQueue(options: SetQueueOptions): Promise<ActionResult>;
  play(options: PlayOptions): Promise<ActionResult>;
  pause(): Promise<ActionResult>;
  stop(): Promise<ActionResult>;
  nextPlay(): Promise<ActionResult>;
  previousPlay(): Promise<ActionResult>;
  seekToTime(options: SeekToTimeOptions): Promise<ActionResult>;
  addListener(
    eventName: MusicKit.PlaybackStateDidChange['eventName'],
    listenerFunc: PlaybackStateDidChangeListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
  addListener(
    eventName: MusicKit.NowPlayingItemDidChange['eventName'],
    listenerFunc: NowPlayingItemDidChangeListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
  addListener(
    eventName: MusicKit.AuthorizationStatusDidChange['eventName'],
    listenerFunc: AuthorizationStatusDidChangeListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
}
