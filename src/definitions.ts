import type { PluginListenerHandle } from "@capacitor/core";

export interface PlayParameters {
  catalogId?: string;
  globalId?: string;
  id: string;
  isLibrary: boolean;
  kind: string;
  purchasedId?: string;
}

export interface CatalogArtist {
  artworkUrl?: string;
  genreNames: string[];
  id: string;
  name: string;
}

export interface LibraryArtist {
  id: string;
  name: string;
}

export interface CatalogAlbum {
  artistName: string;
  artworkUrl?: string;
  copyright: string;
  genreNames: string[];
  id: string;
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
  artworkUrl?: string;
  id: string;
  name: string;
}

export interface CatalogTrack {
  albumName: string;
  artistName: string;
  artworkUrl?: string;
  composerName: string;
  discNumber: number;
  durationMs: number;
  genreNames: string[];
  hasLyrics: boolean;
  id: string;
  isAppleDigitalMaster: boolean;
  isrc: string;
  name: string;
  previews: string[];
  releaseDate: string;
  trackNumber: number;
}

export interface LibraryTrack {
  artworkUrl?: string;
  discNumber?: number;
  durationMs: number;
  id: string;
  name: string;
  trackNumber?: number;
}

export interface CatalogPlaylist {
  artworkUrl?: string;
  curatorName: string;
  description: string;
  id: string;
  isChart: boolean;
  lastModifiedDate: string;
  name: string;
  playlistType: string;
  shortDescription: string;
}

export interface LibraryPlaylist {
  artworkUrl?: string;
  description?: string;
  id: string;
  name: string;
}

/*
 *  likes (1)
 *  dislikes (-1)
 */
export type Rating = -1 | 1;
export type RatingsResult = {
  [key: string]: Rating;
};
export type RatingCategoryType = "artists" | "albums" | "songs" | "playlists";
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
  hasNext: boolean;
  total: number;
}

export type GetCatalogArtistOptions = GetSingleDataOptions<
  "albums" | "genres" | "music-videos" | "playlists" | "station"
>;

export interface GetCatalogArtistResult {
  albums?: CatalogAlbum[];
  artist?: CatalogArtist;
}

export type GetLibraryArtistOptions = GetSingleDataOptions<
  "albums" | "catalog"
>;

export interface GetLibraryArtistResult {
  albums?: LibraryAlbum[];
  artist?: LibraryArtist;
  catalog?: CatalogArtist[];
}

export type GetLibraryArtistsResult = {
  artists: LibraryArtist[];
} & GetMultiDataResult;

export type GetLibraryAlbumOptions = GetSingleDataOptions<
  "artists" | "catalog" | "tracks"
>;

export type GetLibraryAlbumResult =
  MusicKit.Relationship<MusicKit.LibraryAlbums>;

export type GetLibraryAlbumsResult =
  MusicKit.Relationship<MusicKit.LibraryAlbums>;

export type GetLibraryTrackOptions = GetSingleDataOptions<
  "albums" | "artists" | "catalog"
>;

export interface GetLibraryTrackResult {
  albums?: LibraryAlbum[];
  artists?: LibraryArtist[];
  catalog?: CatalogTrack[];
  track?: LibraryTrack;
}

export type GetLibraryTracksResult = {
  tracks: LibraryTrack[];
} & GetMultiDataResult;

export type GetLibraryPlaylistOptions = GetSingleDataOptions<
  "catalog" | "tracks"
>;

export interface GetLibraryPlaylistResult {
  catalog?: CatalogPlaylist[];
  playlist?: LibraryPlaylist;
  tracks?: LibraryTrack[];
}

export type GetLibraryPlaylistsResult = {
  playlists: LibraryPlaylist[];
} & GetMultiDataResult;

export type GetRatingsOptions = {
  ids: string[];
  type: RatingType;
};

export type ActionRatingsResult = {
  ratings: RatingsResult;
};

export type AddRatingOptions = {
  id: string;
  type: RatingType;
  value: Rating;
};

export type DeleteRatingOptions = {
  id: string;
  type: RatingType;
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
  mode: "none" | "one" | "all";
}

export interface SetRepeatModeOptions {
  mode: "none" | "one" | "all";
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
  track: LibraryTrack | undefined;
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
  addRating(options: AddRatingOptions): Promise<ActionResult>;
  authorize(): Promise<void>;
  configure(options: ConfigureOptions): Promise<ActionResult>;
  deleteRating(options: DeleteRatingOptions): Promise<ActionResult>;
  echo(options: EchoOptions): Promise<EchoResult>;
  getCurrentIndex(): Promise<GetCurrentIndexResult>;
  getCurrentPlaybackTime(): Promise<GetCurrentPlaybackTimeResult>;
  getCurrentTrack(): Promise<GetCurrentTrackResult>;
  getLibraryAlbum(
    options: GetLibraryAlbumOptions
  ): Promise<GetLibraryAlbumResult>;
  getLibraryAlbums(
    options: GetMultiDataOptions
  ): Promise<GetLibraryAlbumsResult>;
  getLibraryArtist(
    options: GetLibraryArtistOptions
  ): Promise<GetLibraryArtistResult>;
  getLibraryArtists(
    options: GetMultiDataOptions
  ): Promise<GetLibraryArtistsResult>;
  getLibraryPlaylist(
    options: GetLibraryPlaylistOptions
  ): Promise<GetLibraryPlaylistResult>;
  getLibraryPlaylists(
    options: GetMultiDataOptions
  ): Promise<GetLibraryPlaylistsResult>;
  getLibraryTrack(
    options: GetLibraryTrackOptions
  ): Promise<GetLibraryTrackResult>;
  getLibraryTracks(
    options: GetMultiDataOptions
  ): Promise<GetLibraryTracksResult>;
  getQueueTracks(): Promise<GetQueueTracksResult>;
  getRatings(options: GetRatingsOptions): Promise<ActionRatingsResult>;
  getRepeatMode(): Promise<getRepeatModeResult>;
  hasMusicSubscription(): Promise<ActionResult>;
  isAuthorized(): Promise<ActionResult>;
  nextPlay(): Promise<ActionResult>;
  pause(): Promise<ActionResult>;
  play(options: PlayOptions): Promise<ActionResult>;
  previousPlay(): Promise<ActionResult>;
  seekToTime(options: SeekToTimeOptions): Promise<ActionResult>;
  setQueue(options: SetQueueOptions): Promise<ActionResult>;
  setRepeatMode(options: SetRepeatModeOptions): Promise<ActionResult>;
  stop(): Promise<ActionResult>;
  unauthorize(): Promise<void>;
}
