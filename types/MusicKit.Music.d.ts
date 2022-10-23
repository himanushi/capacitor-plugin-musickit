/* eslint-disable @typescript-eslint/array-type */
declare namespace MusicKit {
  namespace Music {
    type ID = string;

    type AlbumsUrl = `/v1/catalog/${string}/albums${`/${ID}` | ""}`;
    type ArtistsUrl = `/v1/catalog/${string}/artists${`/${ID}` | ""}`;
    type SongsUrl = `/v1/catalog/${string}/songs${`/${ID}` | ""}`;
    type MusicVideosUrl = `/v1/catalog/${string}/music-videos${`/${ID}` | ""}`;
    type PlaylistsUrl = `/v1/catalog/${string}/playlists${`/${ID}` | ""}`;
    type StationsUrl = `/v1/catalog/${string}/stations${`/${ID}` | ""}`;
    type LibraryAlbumsUrl = `/v1/me/library/albums${`/${ID}` | ""}`;
    type LibraryArtistsUrl = `/v1/me/library/artists${`/${ID}` | ""}`;
    type LibrarySongsUrl = `/v1/me/library/songs${`/${ID}` | ""}`;
    type LibraryMusicVideosUrl = `/v1/me/library/music-videos${`/${ID}` | ""}`;
    type LibraryPlaylistsUrl = `/v1/me/library/playlists${`/${ID}` | ""}`;
    type RatingsUrl =
      | `/v1/me/ratings/${string}`
      | `/v1/me/ratings/${string}/${string}`;

    type CatalogUrls =
      | AlbumsUrl
      | ArtistsUrl
      | SongsUrl
      | MusicVideosUrl
      | PlaylistsUrl
      | StationsUrl;

    type LibraryUrls =
      | LibraryAlbumsUrl
      | LibraryArtistsUrl
      | LibraryArtistsUrl
      | LibrarySongsUrl
      | LibraryMusicVideosUrl
      | LibraryPlaylistsUrl;

    type AllUrls = CatalogUrls | LibraryUrls | RatingsUrl;

    type Params = Record<string, any>;
    type Options = Record<string, any>;

    function music(
      url: AlbumsUrl,
      params?: Params,
      options?: Options
    ): Promise<Response<Albums>>;

    function music(
      url: ArtistsUrl,
      params?: Params,
      options?: Options
    ): Promise<Response<Artists>>;

    function music(
      url: SongsUrl,
      params?: Params,
      options?: Options
    ): Promise<Response<Songs>>;

    function music(
      url: MusicVideosUrl,
      params?: Params,
      options?: Options
    ): Promise<Response<MusicVideos>>;

    function music(
      url: PlaylistsUrl,
      params?: Params,
      options?: Options
    ): Promise<Response<Playlists>>;

    function music(
      url: StationsUrl,
      params?: Params,
      options?: Options
    ): Promise<Response<Stations>>;

    function music(
      url: LibraryAlbumsUrl,
      params?: Params,
      options?: Options
    ): Promise<Response<LibraryAlbums>>;

    function music(
      url: LibraryArtistsUrl,
      params?: Params,
      options?: Options
    ): Promise<Response<LibraryArtists>>;

    function music(
      url: LibrarySongsUrl,
      params?: Params,
      options?: Options
    ): Promise<Response<LibrarySongs>>;

    function music(
      url: LibraryMusicVideosUrl,
      params?: Params,
      options?: Options
    ): Promise<Response<MusicVideos>>;

    function music(
      url: LibraryPlaylistsUrl,
      params?: Params,
      options?: Options
    ): Promise<Response<LibraryPlaylists>>;

    function music(
      url: RatingsUrl,
      params?: Params,
      options?: Options
    ): Promise<Response<Ratings>>;
  }
}
