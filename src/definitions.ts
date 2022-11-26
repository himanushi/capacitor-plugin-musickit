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

export type ApiOptions = {
  options?: MusicKit.AppleMusicAPI.Options;
  params?: MusicKit.AppleMusicAPI.Params;
  url: string;
};

export type ApiResult<T> = MusicKit.Relationship<T>;

export type GetCatalogArtistsOptions = {
  albumId?: string;
  libraryId?: string;
  musicVideoId?: string;
  songId?: string;
  songIdForComposers?: string;
} & GetMultiDataOptions;

export type GetCatalogArtistsResult = MusicKit.Relationship<MusicKit.Artists>;

export type GetCatalogAlbumsOptions = {
  artistId?: string;
  libraryId?: string;
  musicVideoId?: string;
  songId?: string;
} & GetMultiDataOptions;

export type GetCatalogAlbumsResult = MusicKit.Relationship<MusicKit.Albums>;

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
  addRating(options: AddRatingOptions): Promise<void>;
  api<T>(options: ApiOptions): Promise<ApiResult<T>>;
  authorize(): Promise<void>;
  configure(options: ConfigureOptions): Promise<void>;
  deleteRating(options: DeleteRatingOptions): Promise<void>;
  echo(options: EchoOptions): Promise<EchoResult>;
  getCatalogAlbums(
    options: GetCatalogAlbumsOptions
  ): Promise<GetCatalogAlbumsResult>;
  getCatalogArtists(
    options: GetCatalogArtistsOptions
  ): Promise<GetCatalogArtistsResult>;
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
  nextPlay(): Promise<void>;
  pause(): Promise<void>;
  play(options: PlayOptions): Promise<void>;
  previousPlay(): Promise<void>;
  seekToTime(options: SeekToTimeOptions): Promise<void>;
  setQueue(options: SetQueueOptions): Promise<void>;
  setRepeatMode(options: SetRepeatModeOptions): Promise<void>;
  setShuffleMode(options: SetShuffleModeOptions): Promise<void>;
  stop(): Promise<void>;
  unauthorize(): Promise<void>;
}
