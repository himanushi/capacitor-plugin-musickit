/* eslint-disable @typescript-eslint/array-type */
declare namespace MusicKit {
  namespace AppleMusicAPI {
    type ID = `/${string}` | "";

    type AlbumsUrl =
      | `/v1/me/library/albums/${string}/catalog`
      | `/v1/catalog/${string}/albums`
      | `/v1/catalog/${string}/artists/${string}/albums`
      | `/v1/catalog/${string}/songs/${string}/albums`
      | `/v1/catalog/${string}/music-videos/${string}/albums`;
    type ArtistsUrl =
      | `/v1/me/library/artists/${string}/catalog`
      | `/v1/catalog/${string}/artists`
      | `/v1/catalog/${string}/albums/${string}/artists`
      | `/v1/catalog/${string}/songs/${string}/artists`
      | `/v1/catalog/${string}/songs/${string}/composers`
      | `/v1/catalog/${string}/music-videos/${string}/artists`;
    type SongsUrl =
      | `/v1/me/library/songs/${string}/catalog`
      | `/v1/catalog/${string}/songs`
      | `/v1/catalog/${string}/albums/${string}/tracks`
      | `/v1/catalog/${string}/music-videos/${string}/songs`
      | `/v1/catalog/${string}/playlists/${string}/tracks`;
    type MusicVideosUrl =
      | `/v1/me/library/music-videos/${string}/catalog`
      | `/v1/catalog/${string}/music-videos`
      | `/v1/catalog/${string}/artists/${string}/music-videos`
      | `/v1/catalog/${string}/songs/${string}/music-videos`;
    type PlaylistsUrl =
      | `/v1/me/library/playlists/${string}/catalog`
      | `/v1/catalog/${string}/playlists`
      | `/v1/catalog/${string}/artists/${string}/playlists`;
    //  `/v1/catalog/${string}/playlists/${string}/curator`
    type StationsUrl =
      | `/v1/catalog/${string}/stations`
      | `/v1/catalog/${string}/artists/${string}/station`
      | `/v1/catalog/${string}/songs/${string}/station`;
    type GenresUrl =
      | `/v1/catalog/${string}/albums/${string}/genres`
      | `/v1/catalog/${string}/artists/${string}/genres`
      | `/v1/catalog/${string}/songs/${string}/genres`
      | `/v1/catalog/${string}/music-videos/${string}/genres`;
    type RecordLabelsUrl =
      `/v1/catalog/${string}/albums/${string}/record-labels`;

    type LibraryAlbumsUrl =
      | `/v1/catalog/${string}/albums/${string}/library`
      | "/v1/me/library/albums"
      | `/v1/me/library/artists/${string}/albums`
      | `/v1/me/library/songs/${string}/albums`
      | `/v1/me/library/music-videos/${string}/albums`;
    type LibraryArtistsUrl =
      | "/v1/me/library/artists"
      | `/v1/me/library/albums/${string}/artists`
      | `/v1/me/library/songs/${string}/artists`
      | `/v1/me/library/music-videos/${string}/artists`;
    type LibrarySongsUrl =
      | `/v1/catalog/${string}/songs/${string}/library`
      | "/v1/me/library/songs"
      | `/v1/me/library/albums/${string}/tracks`
      | `/v1/me/library/playlists/${string}/tracks`;
    type LibraryMusicVideosUrl =
      | `/v1/catalog/${string}/music-videos/${string}/library`
      | "/v1/me/library/music-videos";
    type LibraryPlaylistsUrl =
      | `/v1/catalog/${string}/playlists/${string}/library`
      | "/v1/me/library/playlists";

    type SearchLibrarySongsUrl = "/v1/me/library/search?types=library-songs";

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

    function music(
      url: SearchLibrarySongsUrl,
      params?: Params,
      options?: Options
    ): Promise<SearchLibrarySongsResponse>;

    interface SearchLibrarySongsResponse {
      data: { results: { "library-songs": Relationship<LibrarySongs> } };
    }
  }
}
