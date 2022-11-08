import type { PluginListenerHandle } from "@capacitor/core";

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

export interface GetMultiDataOptions {
  ids?: string[];
  limit?: number;
  offset?: number;
}

export type GetLibraryArtistsOptions = {
  albumId?: string;
  musicVideoId?: string;
  songId?: string;
} & GetMultiDataOptions;

export type GetLibraryArtistsResult =
  MusicKit.Relationship<MusicKit.LibraryArtists>;

export type GetLibraryAlbumsOptions = {
  artistId?: string;
  catalogId?: string;
  musicVideoId?: string;
  songId?: string;
} & GetMultiDataOptions;

export type GetLibraryAlbumsResult =
  MusicKit.Relationship<MusicKit.LibraryAlbums>;

export type GetLibrarySongsOptions = {
  albumId?: string;
  catalogId?: string;
  playlistId?: string;
} & GetMultiDataOptions;

export type GetLibrarySongsResult =
  MusicKit.Relationship<MusicKit.LibrarySongs>;

export type GetLibraryPlaylistsOptions = {
  catalogId?: string;
} & GetMultiDataOptions;

export type GetLibraryPlaylistsResult =
  MusicKit.Relationship<MusicKit.LibraryPlaylists>;

export type GetRatingsOptions = {
  ids: string[];
  type: MusicKit.AppleMusicAPI.RatingType;
};

export type RatingsResult = MusicKit.Relationship<MusicKit.Ratings>;

export type AddRatingOptions = {
  id: string;
  type: MusicKit.AppleMusicAPI.RatingType;
  value: MusicKit.Rating;
};

export type DeleteRatingOptions = {
  id: string;
  type: MusicKit.AppleMusicAPI.RatingType;
};

export interface GetCurrentSongResult {
  item?: MusicKit.MediaItem;
}

export interface GetQueueSongsResult {
  items: MusicKit.MediaItem[];
}

export interface GetCurrentIndexResult {
  index: number;
}

export interface GetCurrentPlaybackTimeResult {
  time: number;
}

export type RepeatMode = "none" | "one" | "all";

export interface GetRepeatModeResult {
  mode: RepeatMode;
}

export interface SetRepeatModeOptions {
  mode: RepeatMode;
}

export type ShuffleMode = "off" | "songs";

export interface GetShuffleModeResult {
  mode: ShuffleMode;
}

export interface SetShuffleModeOptions {
  mode: ShuffleMode;
}

export interface SetQueueOptions {
  ids: string[];
}

export interface SetQueueResult {
  items: MusicKit.MediaItem[];
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
  data: PlaybackStateDidChangeResult
) => void;

export type NowPlayingItemDidChangeResult = {
  index: number;
  item: MusicKit.MediaItem | undefined;
};

export type NowPlayingItemDidChangeListener = (
  data: NowPlayingItemDidChangeResult
) => void;

export type AuthorizationStatus =
  | "unavailable"
  | "notDetermined"
  | "denied"
  | "restricted"
  | "authorized";

export type AuthorizationStatusDidChangeResult = {
  status: AuthorizationStatus;
};

export type AuthorizationStatusDidChangeListener = (
  data: AuthorizationStatusDidChangeResult
) => void;

export interface CapacitorMusicKitPlugin {
  addListener(
    eventName: "playbackStateDidChange",
    listenerFunc: PlaybackStateDidChangeListener
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
  addListener(
    eventName: "nowPlayingItemDidChange",
    listenerFunc: NowPlayingItemDidChangeListener
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
  addListener(
    eventName: "authorizationStatusDidChange",
    listenerFunc: AuthorizationStatusDidChangeListener
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
  addRating(options: AddRatingOptions): Promise<RatingsResult>;
  authorize(): Promise<void>;
  configure(options: ConfigureOptions): Promise<ActionResult>;
  deleteRating(options: DeleteRatingOptions): Promise<RatingsResult>;
  echo(options: EchoOptions): Promise<EchoResult>;
  getCurrentIndex(): Promise<GetCurrentIndexResult>;
  getCurrentPlaybackTime(): Promise<GetCurrentPlaybackTimeResult>;
  getCurrentSong(): Promise<GetCurrentSongResult>;
  getLibraryAlbums(
    options: GetLibraryAlbumsOptions
  ): Promise<GetLibraryAlbumsResult>;
  getLibraryArtists(
    options: GetLibraryArtistsOptions
  ): Promise<GetLibraryArtistsResult>;
  getLibraryPlaylists(
    options: GetLibraryPlaylistsOptions
  ): Promise<GetLibraryPlaylistsResult>;
  getLibrarySongs(
    options: GetLibrarySongsOptions
  ): Promise<GetLibrarySongsResult>;
  getQueueSongs(): Promise<GetQueueSongsResult>;
  getRatings(options: GetRatingsOptions): Promise<RatingsResult>;
  getRepeatMode(): Promise<GetRepeatModeResult>;
  getShuffleMode(): Promise<GetShuffleModeResult>;
  hasMusicSubscription(): Promise<ActionResult>;
  isAuthorized(): Promise<ActionResult>;
  nextPlay(): Promise<ActionResult>;
  pause(): Promise<ActionResult>;
  play(options: PlayOptions): Promise<ActionResult>;
  previousPlay(): Promise<ActionResult>;
  seekToTime(options: SeekToTimeOptions): Promise<ActionResult>;
  setQueue(options: SetQueueOptions): Promise<SetQueueResult>;
  setRepeatMode(options: SetRepeatModeOptions): Promise<ActionResult>;
  setShuffleMode(options: SetShuffleModeOptions): Promise<ActionResult>;
  stop(): Promise<ActionResult>;
  unauthorize(): Promise<void>;
}
