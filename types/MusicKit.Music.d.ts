/* eslint-disable @typescript-eslint/array-type */
declare namespace MusicKit {
  namespace Music {
    type ID = `/${string}` | "";

    type AlbumsUrl =
      | `/v1/catalog/${string}/albums${ID}`
      | `/v1/me/library/albums/${string}/catalog`;
    type ArtistsUrl =
      | `/v1/catalog/${string}/artists${ID}`
      | `/v1/catalog/${string}/albums/${string}/artists`;
    type SongsUrl =
      | `/v1/catalog/${string}/songs${ID}`
      | `/v1/catalog/${string}/albums/${string}/tracks`;
    type MusicVideosUrl = `/v1/catalog/${string}/music-videos${ID}`;
    type PlaylistsUrl = `/v1/catalog/${string}/playlists${ID}`;
    type StationsUrl = `/v1/catalog/${string}/stations${ID}`;
    type GenresUrl = `/v1/catalog/${string}/albums/${string}/genres`;
    type RecordLabelsUrl =
      `/v1/catalog/${string}/albums/${string}/record-labels`;

    type LibraryAlbumsUrl =
      | `/v1/me/library/albums${ID}`
      | `/v1/me/library/artists/${string}/albums`
      | `/v1/me/library/songs/${string}/albums`
      | `/v1/me/library/music-videos/${string}/albums`
      | `/v1/catalog/${string}/albums/${string}/library`;
    type LibraryArtistsUrl =
      | `/v1/me/library/artists${ID}`
      | `/v1/me/library/albums/${string}/artists`;
    type LibrarySongsUrl = `/v1/me/library/songs${ID}`;
    type LibraryMusicVideosUrl = `/v1/me/library/music-videos${ID}`;
    type LibraryPlaylistsUrl = `/v1/me/library/playlists${ID}`;

    type RatingCategoryType = "artists" | "albums" | "songs" | "playlists";
    type RatingType = RatingCategoryType | `library-${RatingCategoryType}`;

    type RatingsUrl =
      | `/v1/me/ratings/${RatingType}`
      | `/v1/me/ratings/${RatingType}/${string}`;

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
