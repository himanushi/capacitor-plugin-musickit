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

export interface GetLibraryAlbumTrackResult {
  title: string;
  id: string;
  discNumber: string;
  trackNumber: string;
}

export interface GetLibraryAlbumResult {
  album?: {
    id: string;
    title: string;
    artworkUrl?: string;
    tracks: GetLibraryAlbumTrackResult[];
  };
}

export interface SetQueueOptions {
  ids: string[];
}

export type PlaybackStates = keyof typeof MusicKit.PlaybackStates;

export type PlaybackStateDidChangeListener = (state: {
  result: PlaybackStates;
}) => void;

export type AuthorizationStatus =
  | 'unavailable'
  | 'notDetermined'
  | 'denied'
  | 'restricted'
  | 'authorized';

export type AuthorizationStatusDidChangeListener = (state: {
  result: AuthorizationStatus;
}) => void;

export interface CapacitorMusicKitPlugin {
  echo(options: EchoOptions): Promise<EchoResult>;
  configure(options: ConfigureOptions): Promise<ActionResult>;
  isAuthorized(): Promise<ActionResult>;
  hasMusicSubscription(): Promise<ActionResult>;
  authorize(): Promise<void>;
  unauthorize(): Promise<void>;
  getLibraryAlbums(
    options: GetLibraryAlbumsOptions,
  ): Promise<GetLibraryAlbumsResult>;
  getLibraryAlbum(
    options: GetLibraryAlbumOptions,
  ): Promise<GetLibraryAlbumResult>;
  setQueue(options: SetQueueOptions): Promise<ActionResult>;
  play(): Promise<ActionResult>;
  addListener(
    eventName: MusicKit.PlaybackStateDidChange['eventName'],
    listenerFunc: PlaybackStateDidChangeListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
  addListener(
    eventName: MusicKit.AuthorizationStatusDidChange['eventName'],
    listenerFunc: AuthorizationStatusDidChangeListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
}
