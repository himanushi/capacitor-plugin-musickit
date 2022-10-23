# capacitor-plugin-musickit

Requires iOS 16 or higher

## Install

```bash
npm install capacitor-plugin-musickit
npx cap sync
```

## API

<docgen-index>

* [`addListener('playbackStateDidChange', ...)`](#addlistenerplaybackstatedidchange)
* [`addListener('nowPlayingItemDidChange', ...)`](#addlistenernowplayingitemdidchange)
* [`addListener('authorizationStatusDidChange', ...)`](#addlistenerauthorizationstatusdidchange)
* [`addRating(...)`](#addrating)
* [`authorize()`](#authorize)
* [`configure(...)`](#configure)
* [`deleteRating(...)`](#deleterating)
* [`echo(...)`](#echo)
* [`getCurrentIndex()`](#getcurrentindex)
* [`getCurrentPlaybackTime()`](#getcurrentplaybacktime)
* [`getCurrentTrack()`](#getcurrenttrack)
* [`getLibraryAlbum(...)`](#getlibraryalbum)
* [`getLibraryAlbums(...)`](#getlibraryalbums)
* [`getLibraryArtist(...)`](#getlibraryartist)
* [`getLibraryArtists(...)`](#getlibraryartists)
* [`getLibraryPlaylist(...)`](#getlibraryplaylist)
* [`getLibraryPlaylists(...)`](#getlibraryplaylists)
* [`getLibraryTrack(...)`](#getlibrarytrack)
* [`getLibraryTracks(...)`](#getlibrarytracks)
* [`getQueueTracks()`](#getqueuetracks)
* [`getRatings(...)`](#getratings)
* [`getRepeatMode()`](#getrepeatmode)
* [`hasMusicSubscription()`](#hasmusicsubscription)
* [`isAuthorized()`](#isauthorized)
* [`nextPlay()`](#nextplay)
* [`pause()`](#pause)
* [`play(...)`](#play)
* [`previousPlay()`](#previousplay)
* [`seekToTime(...)`](#seektotime)
* [`setQueue(...)`](#setqueue)
* [`setRepeatMode(...)`](#setrepeatmode)
* [`stop()`](#stop)
* [`unauthorize()`](#unauthorize)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### addListener('playbackStateDidChange', ...)

```typescript
addListener(eventName: "playbackStateDidChange", listenerFunc: PlaybackStateDidChangeListener) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'playbackStateDidChange'</code>                                                     |
| **`listenerFunc`** | <code><a href="#playbackstatedidchangelistener">PlaybackStateDidChangeListener</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### addListener('nowPlayingItemDidChange', ...)

```typescript
addListener(eventName: "nowPlayingItemDidChange", listenerFunc: NowPlayingItemDidChangeListener) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'nowPlayingItemDidChange'</code>                                                      |
| **`listenerFunc`** | <code><a href="#nowplayingitemdidchangelistener">NowPlayingItemDidChangeListener</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### addListener('authorizationStatusDidChange', ...)

```typescript
addListener(eventName: "authorizationStatusDidChange", listenerFunc: AuthorizationStatusDidChangeListener) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'authorizationStatusDidChange'</code>                                                           |
| **`listenerFunc`** | <code><a href="#authorizationstatusdidchangelistener">AuthorizationStatusDidChangeListener</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### addRating(...)

```typescript
addRating(options: AddRatingOptions) => Promise<ActionResult>
```

| Param         | Type                                                          |
| ------------- | ------------------------------------------------------------- |
| **`options`** | <code><a href="#addratingoptions">AddRatingOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### authorize()

```typescript
authorize() => Promise<void>
```

--------------------


### configure(...)

```typescript
configure(options: ConfigureOptions) => Promise<ActionResult>
```

| Param         | Type                                                          |
| ------------- | ------------------------------------------------------------- |
| **`options`** | <code><a href="#configureoptions">ConfigureOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### deleteRating(...)

```typescript
deleteRating(options: DeleteRatingOptions) => Promise<ActionResult>
```

| Param         | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| **`options`** | <code><a href="#deleteratingoptions">DeleteRatingOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### echo(...)

```typescript
echo(options: EchoOptions) => Promise<EchoResult>
```

| Param         | Type                                                |
| ------------- | --------------------------------------------------- |
| **`options`** | <code><a href="#echooptions">EchoOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#echoresult">EchoResult</a>&gt;</code>

--------------------


### getCurrentIndex()

```typescript
getCurrentIndex() => Promise<GetCurrentIndexResult>
```

**Returns:** <code>Promise&lt;<a href="#getcurrentindexresult">GetCurrentIndexResult</a>&gt;</code>

--------------------


### getCurrentPlaybackTime()

```typescript
getCurrentPlaybackTime() => Promise<GetCurrentPlaybackTimeResult>
```

**Returns:** <code>Promise&lt;<a href="#getcurrentplaybacktimeresult">GetCurrentPlaybackTimeResult</a>&gt;</code>

--------------------


### getCurrentTrack()

```typescript
getCurrentTrack() => Promise<GetCurrentTrackResult>
```

**Returns:** <code>Promise&lt;<a href="#getcurrenttrackresult">GetCurrentTrackResult</a>&gt;</code>

--------------------


### getLibraryAlbum(...)

```typescript
getLibraryAlbum(options: GetLibraryAlbumOptions) => Promise<GetLibraryAlbumResult>
```

| Param         | Type                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| **`options`** | <code><a href="#getlibraryalbumoptions">GetLibraryAlbumOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#getlibraryalbumresult">GetLibraryAlbumResult</a>&gt;</code>

--------------------


### getLibraryAlbums(...)

```typescript
getLibraryAlbums(options: GetMultiDataOptions) => Promise<GetLibraryAlbumsResult>
```

| Param         | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| **`options`** | <code><a href="#getmultidataoptions">GetMultiDataOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#getlibraryalbumsresult">GetLibraryAlbumsResult</a>&gt;</code>

--------------------


### getLibraryArtist(...)

```typescript
getLibraryArtist(options: GetLibraryArtistOptions) => Promise<GetLibraryArtistResult>
```

| Param         | Type                                                                        |
| ------------- | --------------------------------------------------------------------------- |
| **`options`** | <code><a href="#getlibraryartistoptions">GetLibraryArtistOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#getlibraryartistresult">GetLibraryArtistResult</a>&gt;</code>

--------------------


### getLibraryArtists(...)

```typescript
getLibraryArtists(options: GetMultiDataOptions) => Promise<GetLibraryArtistsResult>
```

| Param         | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| **`options`** | <code><a href="#getmultidataoptions">GetMultiDataOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#getlibraryartistsresult">GetLibraryArtistsResult</a>&gt;</code>

--------------------


### getLibraryPlaylist(...)

```typescript
getLibraryPlaylist(options: GetLibraryPlaylistOptions) => Promise<GetLibraryPlaylistResult>
```

| Param         | Type                                                                            |
| ------------- | ------------------------------------------------------------------------------- |
| **`options`** | <code><a href="#getlibraryplaylistoptions">GetLibraryPlaylistOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#getlibraryplaylistresult">GetLibraryPlaylistResult</a>&gt;</code>

--------------------


### getLibraryPlaylists(...)

```typescript
getLibraryPlaylists(options: GetMultiDataOptions) => Promise<GetLibraryPlaylistsResult>
```

| Param         | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| **`options`** | <code><a href="#getmultidataoptions">GetMultiDataOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#getlibraryplaylistsresult">GetLibraryPlaylistsResult</a>&gt;</code>

--------------------


### getLibraryTrack(...)

```typescript
getLibraryTrack(options: GetLibraryTrackOptions) => Promise<GetLibraryTrackResult>
```

| Param         | Type                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| **`options`** | <code><a href="#getlibrarytrackoptions">GetLibraryTrackOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#getlibrarytrackresult">GetLibraryTrackResult</a>&gt;</code>

--------------------


### getLibraryTracks(...)

```typescript
getLibraryTracks(options: GetMultiDataOptions) => Promise<GetLibraryTracksResult>
```

| Param         | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| **`options`** | <code><a href="#getmultidataoptions">GetMultiDataOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#getlibrarytracksresult">GetLibraryTracksResult</a>&gt;</code>

--------------------


### getQueueTracks()

```typescript
getQueueTracks() => Promise<GetQueueTracksResult>
```

**Returns:** <code>Promise&lt;<a href="#getqueuetracksresult">GetQueueTracksResult</a>&gt;</code>

--------------------


### getRatings(...)

```typescript
getRatings(options: GetRatingsOptions) => Promise<ActionRatingsResult>
```

| Param         | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| **`options`** | <code><a href="#getratingsoptions">GetRatingsOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#actionratingsresult">ActionRatingsResult</a>&gt;</code>

--------------------


### getRepeatMode()

```typescript
getRepeatMode() => Promise<getRepeatModeResult>
```

**Returns:** <code>Promise&lt;<a href="#getrepeatmoderesult">getRepeatModeResult</a>&gt;</code>

--------------------


### hasMusicSubscription()

```typescript
hasMusicSubscription() => Promise<ActionResult>
```

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### isAuthorized()

```typescript
isAuthorized() => Promise<ActionResult>
```

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### nextPlay()

```typescript
nextPlay() => Promise<ActionResult>
```

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### pause()

```typescript
pause() => Promise<ActionResult>
```

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### play(...)

```typescript
play(options: PlayOptions) => Promise<ActionResult>
```

| Param         | Type                                                |
| ------------- | --------------------------------------------------- |
| **`options`** | <code><a href="#playoptions">PlayOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### previousPlay()

```typescript
previousPlay() => Promise<ActionResult>
```

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### seekToTime(...)

```typescript
seekToTime(options: SeekToTimeOptions) => Promise<ActionResult>
```

| Param         | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| **`options`** | <code><a href="#seektotimeoptions">SeekToTimeOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### setQueue(...)

```typescript
setQueue(options: SetQueueOptions) => Promise<ActionResult>
```

| Param         | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| **`options`** | <code><a href="#setqueueoptions">SetQueueOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### setRepeatMode(...)

```typescript
setRepeatMode(options: SetRepeatModeOptions) => Promise<ActionResult>
```

| Param         | Type                                                                  |
| ------------- | --------------------------------------------------------------------- |
| **`options`** | <code><a href="#setrepeatmodeoptions">SetRepeatModeOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### stop()

```typescript
stop() => Promise<ActionResult>
```

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### unauthorize()

```typescript
unauthorize() => Promise<void>
```

--------------------


### Interfaces


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### LibraryTrack

| Prop              | Type                |
| ----------------- | ------------------- |
| **`artworkUrl`**  | <code>string</code> |
| **`discNumber`**  | <code>number</code> |
| **`durationMs`**  | <code>number</code> |
| **`id`**          | <code>string</code> |
| **`name`**        | <code>string</code> |
| **`trackNumber`** | <code>number</code> |


#### ActionResult

| Prop         | Type                 |
| ------------ | -------------------- |
| **`result`** | <code>boolean</code> |


#### ConfigureOptions

| Prop         | Type                                |
| ------------ | ----------------------------------- |
| **`config`** | <code>MusicKit.Configuration</code> |


#### EchoResult

| Prop        | Type                |
| ----------- | ------------------- |
| **`value`** | <code>string</code> |


#### EchoOptions

| Prop        | Type                |
| ----------- | ------------------- |
| **`value`** | <code>string</code> |


#### GetCurrentIndexResult

| Prop        | Type                |
| ----------- | ------------------- |
| **`index`** | <code>number</code> |


#### GetCurrentPlaybackTimeResult

| Prop       | Type                |
| ---------- | ------------------- |
| **`time`** | <code>number</code> |


#### GetCurrentTrackResult

| Prop        | Type                                                  |
| ----------- | ----------------------------------------------------- |
| **`track`** | <code><a href="#librarytrack">LibraryTrack</a></code> |


#### GetSingleDataOptions

| Prop          | Type                |
| ------------- | ------------------- |
| **`id`**      | <code>string</code> |
| **`include`** | <code>T[]</code>    |


#### GetMultiDataOptions

| Prop         | Type                  |
| ------------ | --------------------- |
| **`ids`**    | <code>string[]</code> |
| **`limit`**  | <code>number</code>   |
| **`offset`** | <code>number</code>   |


#### GetLibraryArtistResult

| Prop          | Type                                                    |
| ------------- | ------------------------------------------------------- |
| **`albums`**  | <code>LibraryAlbum[]</code>                             |
| **`artist`**  | <code><a href="#libraryartist">LibraryArtist</a></code> |
| **`catalog`** | <code>CatalogArtist[]</code>                            |


#### LibraryAlbum

| Prop             | Type                |
| ---------------- | ------------------- |
| **`artworkUrl`** | <code>string</code> |
| **`id`**         | <code>string</code> |
| **`name`**       | <code>string</code> |


#### LibraryArtist

| Prop       | Type                |
| ---------- | ------------------- |
| **`id`**   | <code>string</code> |
| **`name`** | <code>string</code> |


#### CatalogArtist

| Prop             | Type                  |
| ---------------- | --------------------- |
| **`artworkUrl`** | <code>string</code>   |
| **`genreNames`** | <code>string[]</code> |
| **`id`**         | <code>string</code>   |
| **`name`**       | <code>string</code>   |


#### GetMultiDataResult

| Prop          | Type                 |
| ------------- | -------------------- |
| **`hasNext`** | <code>boolean</code> |
| **`total`**   | <code>number</code>  |


#### GetLibraryPlaylistResult

| Prop           | Type                                                        |
| -------------- | ----------------------------------------------------------- |
| **`catalog`**  | <code>CatalogPlaylist[]</code>                              |
| **`playlist`** | <code><a href="#libraryplaylist">LibraryPlaylist</a></code> |
| **`tracks`**   | <code>LibraryTrack[]</code>                                 |


#### CatalogPlaylist

| Prop                   | Type                 |
| ---------------------- | -------------------- |
| **`artworkUrl`**       | <code>string</code>  |
| **`curatorName`**      | <code>string</code>  |
| **`description`**      | <code>string</code>  |
| **`id`**               | <code>string</code>  |
| **`isChart`**          | <code>boolean</code> |
| **`lastModifiedDate`** | <code>string</code>  |
| **`name`**             | <code>string</code>  |
| **`playlistType`**     | <code>string</code>  |
| **`shortDescription`** | <code>string</code>  |


#### LibraryPlaylist

| Prop              | Type                |
| ----------------- | ------------------- |
| **`artworkUrl`**  | <code>string</code> |
| **`description`** | <code>string</code> |
| **`id`**          | <code>string</code> |
| **`name`**        | <code>string</code> |


#### GetLibraryTrackResult

| Prop          | Type                                                  |
| ------------- | ----------------------------------------------------- |
| **`albums`**  | <code>LibraryAlbum[]</code>                           |
| **`artists`** | <code>LibraryArtist[]</code>                          |
| **`catalog`** | <code>CatalogTrack[]</code>                           |
| **`track`**   | <code><a href="#librarytrack">LibraryTrack</a></code> |


#### CatalogTrack

| Prop                       | Type                  |
| -------------------------- | --------------------- |
| **`albumName`**            | <code>string</code>   |
| **`artistName`**           | <code>string</code>   |
| **`artworkUrl`**           | <code>string</code>   |
| **`composerName`**         | <code>string</code>   |
| **`discNumber`**           | <code>number</code>   |
| **`durationMs`**           | <code>number</code>   |
| **`genreNames`**           | <code>string[]</code> |
| **`hasLyrics`**            | <code>boolean</code>  |
| **`id`**                   | <code>string</code>   |
| **`isAppleDigitalMaster`** | <code>boolean</code>  |
| **`isrc`**                 | <code>string</code>   |
| **`name`**                 | <code>string</code>   |
| **`previews`**             | <code>string[]</code> |
| **`releaseDate`**          | <code>string</code>   |
| **`trackNumber`**          | <code>number</code>   |


#### GetQueueTracksResult

| Prop         | Type                        |
| ------------ | --------------------------- |
| **`tracks`** | <code>LibraryTrack[]</code> |


#### getRepeatModeResult

| Prop       | Type                                  |
| ---------- | ------------------------------------- |
| **`mode`** | <code>'none' \| 'one' \| 'all'</code> |


#### PlayOptions

| Prop        | Type                |
| ----------- | ------------------- |
| **`index`** | <code>number</code> |


#### SeekToTimeOptions

| Prop       | Type                |
| ---------- | ------------------- |
| **`time`** | <code>number</code> |


#### SetQueueOptions

| Prop      | Type                  |
| --------- | --------------------- |
| **`ids`** | <code>string[]</code> |


#### SetRepeatModeOptions

| Prop       | Type                                  |
| ---------- | ------------------------------------- |
| **`mode`** | <code>'none' \| 'one' \| 'all'</code> |


### Type Aliases


#### PlaybackStateDidChangeListener

<code>(data: <a href="#playbackstatedidchangeresult">PlaybackStateDidChangeResult</a>): void</code>


#### PlaybackStateDidChangeResult

<code>{ state: <a href="#playbackstate">PlaybackState</a>; }</code>


#### PlaybackState

<code>keyof typeof MusicKit.PlaybackStates</code>


#### NowPlayingItemDidChangeListener

<code>(data: <a href="#nowplayingitemdidchangeresult">NowPlayingItemDidChangeResult</a>): void</code>


#### NowPlayingItemDidChangeResult

<code>{ index: number; track: <a href="#librarytrack">LibraryTrack</a>; }</code>


#### AuthorizationStatusDidChangeListener

<code>(data: <a href="#authorizationstatusdidchangeresult">AuthorizationStatusDidChangeResult</a>): void</code>


#### AuthorizationStatusDidChangeResult

<code>{ status: <a href="#authorizationstatus">AuthorizationStatus</a>; }</code>


#### AuthorizationStatus

<code>"unavailable" | "notDetermined" | "denied" | "restricted" | "authorized"</code>


#### AddRatingOptions

<code>{ id: string; type: <a href="#ratingtype">RatingType</a>; value: <a href="#rating">Rating</a>; }</code>


#### RatingType

<code><a href="#ratingcategorytype">RatingCategoryType</a> | `library-${<a href="#ratingcategorytype">RatingCategoryType</a>}`</code>


#### RatingCategoryType

<code>"artists" | "albums" | "songs" | "playlists"</code>


#### Rating

<code>-1 | 1</code>


#### DeleteRatingOptions

<code>{ id: string; type: <a href="#ratingtype">RatingType</a>; }</code>


#### GetLibraryAlbumResult

<code>MusicKit.Relationship&lt;MusicKit.LibraryAlbums&gt;</code>


#### GetLibraryAlbumOptions

<code><a href="#getsingledataoptions">GetSingleDataOptions</a>&lt; "artists" | "catalog" | "tracks" &gt;</code>


#### GetLibraryAlbumsResult

<code>MusicKit.Relationship&lt;MusicKit.LibraryAlbums&gt;</code>


#### GetLibraryArtistOptions

<code><a href="#getsingledataoptions">GetSingleDataOptions</a>&lt; "albums" | "catalog" &gt;</code>


#### GetLibraryArtistsResult

<code>{ artists: LibraryArtist[]; } & <a href="#getmultidataresult">GetMultiDataResult</a></code>


#### GetLibraryPlaylistOptions

<code><a href="#getsingledataoptions">GetSingleDataOptions</a>&lt; "catalog" | "tracks" &gt;</code>


#### GetLibraryPlaylistsResult

<code>{ playlists: LibraryPlaylist[]; } & <a href="#getmultidataresult">GetMultiDataResult</a></code>


#### GetLibraryTrackOptions

<code><a href="#getsingledataoptions">GetSingleDataOptions</a>&lt; "albums" | "artists" | "catalog" &gt;</code>


#### GetLibraryTracksResult

<code>{ tracks: LibraryTrack[]; } & <a href="#getmultidataresult">GetMultiDataResult</a></code>


#### ActionRatingsResult

<code>{ ratings: <a href="#ratingsresult">RatingsResult</a>; }</code>


#### RatingsResult

<code>{ [key: string]: <a href="#rating">Rating</a>; }</code>


#### GetRatingsOptions

<code>{ ids: string[]; type: <a href="#ratingtype">RatingType</a>; }</code>

</docgen-api>
