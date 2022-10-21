# capacitor-plugin-musickit

Requires iOS 16 or higher

## Install

```bash
npm install capacitor-plugin-musickit
npx cap sync
```

## API

<docgen-index>

* [`echo(...)`](#echo)
* [`configure(...)`](#configure)
* [`isAuthorized()`](#isauthorized)
* [`hasMusicSubscription()`](#hasmusicsubscription)
* [`authorize()`](#authorize)
* [`unauthorize()`](#unauthorize)
* [`getLibraryArtist(...)`](#getlibraryartist)
* [`getLibraryArtists(...)`](#getlibraryartists)
* [`getLibraryAlbum(...)`](#getlibraryalbum)
* [`getLibraryAlbums(...)`](#getlibraryalbums)
* [`getLibrarySong(...)`](#getlibrarysong)
* [`getLibrarySongs(...)`](#getlibrarysongs)
* [`getLibraryPlaylist(...)`](#getlibraryplaylist)
* [`getLibraryPlaylists(...)`](#getlibraryplaylists)
* [`getRatings(...)`](#getratings)
* [`addRating(...)`](#addrating)
* [`deleteRating(...)`](#deleterating)
* [`getCurrentSong()`](#getcurrentsong)
* [`getQueueSongs()`](#getqueuesongs)
* [`getCurrentIndex()`](#getcurrentindex)
* [`getCurrentPlaybackTime()`](#getcurrentplaybacktime)
* [`getRepeatMode()`](#getrepeatmode)
* [`setRepeatMode(...)`](#setrepeatmode)
* [`setQueue(...)`](#setqueue)
* [`play(...)`](#play)
* [`pause()`](#pause)
* [`stop()`](#stop)
* [`nextPlay()`](#nextplay)
* [`previousPlay()`](#previousplay)
* [`seekToTime(...)`](#seektotime)
* [`addListener('playbackStateDidChange', ...)`](#addlistenerplaybackstatedidchange)
* [`addListener('nowPlayingItemDidChange', ...)`](#addlistenernowplayingitemdidchange)
* [`addListener('authorizationStatusDidChange', ...)`](#addlistenerauthorizationstatusdidchange)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### echo(...)

```typescript
echo(options: EchoOptions) => Promise<EchoResult>
```

| Param         | Type                                                |
| ------------- | --------------------------------------------------- |
| **`options`** | <code><a href="#echooptions">EchoOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#echoresult">EchoResult</a>&gt;</code>

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


### isAuthorized()

```typescript
isAuthorized() => Promise<ActionResult>
```

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### hasMusicSubscription()

```typescript
hasMusicSubscription() => Promise<ActionResult>
```

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### authorize()

```typescript
authorize() => Promise<void>
```

--------------------


### unauthorize()

```typescript
unauthorize() => Promise<void>
```

--------------------


### getLibraryArtist(...)

```typescript
getLibraryArtist(options: GetSingleDataOptions) => Promise<GetLibraryArtistResult>
```

| Param         | Type                                                                  |
| ------------- | --------------------------------------------------------------------- |
| **`options`** | <code><a href="#getsingledataoptions">GetSingleDataOptions</a></code> |

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


### getLibraryAlbum(...)

```typescript
getLibraryAlbum(options: GetSingleDataOptions) => Promise<GetLibraryAlbumResult>
```

| Param         | Type                                                                  |
| ------------- | --------------------------------------------------------------------- |
| **`options`** | <code><a href="#getsingledataoptions">GetSingleDataOptions</a></code> |

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


### getLibrarySong(...)

```typescript
getLibrarySong(options: GetSingleDataOptions) => Promise<GetLibrarySongResult>
```

| Param         | Type                                                                  |
| ------------- | --------------------------------------------------------------------- |
| **`options`** | <code><a href="#getsingledataoptions">GetSingleDataOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#getlibrarysongresult">GetLibrarySongResult</a>&gt;</code>

--------------------


### getLibrarySongs(...)

```typescript
getLibrarySongs(options: GetMultiDataOptions) => Promise<GetLibrarySongsResult>
```

| Param         | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| **`options`** | <code><a href="#getmultidataoptions">GetMultiDataOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#getlibrarysongsresult">GetLibrarySongsResult</a>&gt;</code>

--------------------


### getLibraryPlaylist(...)

```typescript
getLibraryPlaylist(options: GetSingleDataOptions) => Promise<GetLibraryPlaylistResult>
```

| Param         | Type                                                                  |
| ------------- | --------------------------------------------------------------------- |
| **`options`** | <code><a href="#getsingledataoptions">GetSingleDataOptions</a></code> |

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


### getRatings(...)

```typescript
getRatings(options: GetRatingsOptions) => Promise<ActionRatingsResult>
```

| Param         | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| **`options`** | <code><a href="#getratingsoptions">GetRatingsOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#actionratingsresult">ActionRatingsResult</a>&gt;</code>

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


### deleteRating(...)

```typescript
deleteRating(options: DeleteRatingOptions) => Promise<ActionResult>
```

| Param         | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| **`options`** | <code><a href="#deleteratingoptions">DeleteRatingOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### getCurrentSong()

```typescript
getCurrentSong() => Promise<GetCurrentSongResult>
```

**Returns:** <code>Promise&lt;<a href="#getcurrentsongresult">GetCurrentSongResult</a>&gt;</code>

--------------------


### getQueueSongs()

```typescript
getQueueSongs() => Promise<GetQueueSongsResult>
```

**Returns:** <code>Promise&lt;<a href="#getqueuesongsresult">GetQueueSongsResult</a>&gt;</code>

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


### getRepeatMode()

```typescript
getRepeatMode() => Promise<getRepeatModeResult>
```

**Returns:** <code>Promise&lt;<a href="#getrepeatmoderesult">getRepeatModeResult</a>&gt;</code>

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


### setQueue(...)

```typescript
setQueue(options: SetQueueOptions) => Promise<ActionResult>
```

| Param         | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| **`options`** | <code><a href="#setqueueoptions">SetQueueOptions</a></code> |

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


### pause()

```typescript
pause() => Promise<ActionResult>
```

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### stop()

```typescript
stop() => Promise<ActionResult>
```

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### nextPlay()

```typescript
nextPlay() => Promise<ActionResult>
```

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


### addListener('playbackStateDidChange', ...)

```typescript
addListener(eventName: 'playbackStateDidChange', listenerFunc: PlaybackStateDidChangeListener) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'playbackStateDidChange'</code>                                                     |
| **`listenerFunc`** | <code><a href="#playbackstatedidchangelistener">PlaybackStateDidChangeListener</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### addListener('nowPlayingItemDidChange', ...)

```typescript
addListener(eventName: 'nowPlayingItemDidChange', listenerFunc: NowPlayingItemDidChangeListener) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'nowPlayingItemDidChange'</code>                                                      |
| **`listenerFunc`** | <code><a href="#nowplayingitemdidchangelistener">NowPlayingItemDidChangeListener</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### addListener('authorizationStatusDidChange', ...)

```typescript
addListener(eventName: 'authorizationStatusDidChange', listenerFunc: AuthorizationStatusDidChangeListener) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'authorizationStatusDidChange'</code>                                                           |
| **`listenerFunc`** | <code><a href="#authorizationstatusdidchangelistener">AuthorizationStatusDidChangeListener</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### Interfaces


#### EchoResult

| Prop        | Type                |
| ----------- | ------------------- |
| **`value`** | <code>string</code> |


#### EchoOptions

| Prop        | Type                |
| ----------- | ------------------- |
| **`value`** | <code>string</code> |


#### ActionResult

| Prop         | Type                 |
| ------------ | -------------------- |
| **`result`** | <code>boolean</code> |


#### ConfigureOptions

| Prop         | Type                         |
| ------------ | ---------------------------- |
| **`config`** | <code>MusicKit.Config</code> |


#### GetLibraryArtistResult

| Prop         | Type                                                  |
| ------------ | ----------------------------------------------------- |
| **`artist`** | <code><a href="#artistresult">ArtistResult</a></code> |
| **`albums`** | <code>AlbumResult[]</code>                            |
| **`songs`**  | <code>SongResult[]</code>                             |


#### ArtistResult

| Prop             | Type                |
| ---------------- | ------------------- |
| **`id`**         | <code>string</code> |
| **`name`**       | <code>string</code> |
| **`artworkUrl`** | <code>string</code> |


#### AlbumResult

| Prop             | Type                |
| ---------------- | ------------------- |
| **`id`**         | <code>string</code> |
| **`name`**       | <code>string</code> |
| **`artworkUrl`** | <code>string</code> |


#### SongResult

| Prop              | Type                |
| ----------------- | ------------------- |
| **`id`**          | <code>string</code> |
| **`name`**        | <code>string</code> |
| **`durationMs`**  | <code>number</code> |
| **`discNumber`**  | <code>number</code> |
| **`trackNumber`** | <code>number</code> |
| **`artworkUrl`**  | <code>string</code> |


#### GetSingleDataOptions

| Prop          | Type                    |
| ------------- | ----------------------- |
| **`id`**      | <code>string</code>     |
| **`include`** | <code>Relation[]</code> |


#### GetMultiDataResult

| Prop          | Type                 |
| ------------- | -------------------- |
| **`total`**   | <code>number</code>  |
| **`hasNext`** | <code>boolean</code> |


#### GetMultiDataOptions

| Prop         | Type                  |
| ------------ | --------------------- |
| **`ids`**    | <code>string[]</code> |
| **`limit`**  | <code>number</code>   |
| **`offset`** | <code>number</code>   |


#### GetLibraryAlbumResult

| Prop          | Type                                                |
| ------------- | --------------------------------------------------- |
| **`album`**   | <code><a href="#albumresult">AlbumResult</a></code> |
| **`songs`**   | <code>SongResult[]</code>                           |
| **`artists`** | <code>ArtistResult[]</code>                         |


#### GetLibrarySongResult

| Prop          | Type                                              |
| ------------- | ------------------------------------------------- |
| **`song`**    | <code><a href="#songresult">SongResult</a></code> |
| **`artists`** | <code>ArtistResult[]</code>                       |
| **`albums`**  | <code>AlbumResult[]</code>                        |


#### GetLibraryPlaylistResult

| Prop           | Type                                                      |
| -------------- | --------------------------------------------------------- |
| **`playlist`** | <code><a href="#playlistresult">PlaylistResult</a></code> |
| **`songs`**    | <code>SongResult[]</code>                                 |


#### PlaylistResult

| Prop              | Type                |
| ----------------- | ------------------- |
| **`id`**          | <code>string</code> |
| **`name`**        | <code>string</code> |
| **`description`** | <code>string</code> |
| **`artworkUrl`**  | <code>string</code> |


#### GetCurrentSongResult

| Prop       | Type                                              |
| ---------- | ------------------------------------------------- |
| **`song`** | <code><a href="#songresult">SongResult</a></code> |


#### GetQueueSongsResult

| Prop        | Type                      |
| ----------- | ------------------------- |
| **`songs`** | <code>SongResult[]</code> |


#### GetCurrentIndexResult

| Prop        | Type                |
| ----------- | ------------------- |
| **`index`** | <code>number</code> |


#### GetCurrentPlaybackTimeResult

| Prop       | Type                |
| ---------- | ------------------- |
| **`time`** | <code>number</code> |


#### getRepeatModeResult

| Prop       | Type                                  |
| ---------- | ------------------------------------- |
| **`mode`** | <code>'none' \| 'one' \| 'all'</code> |


#### SetRepeatModeOptions

| Prop       | Type                                  |
| ---------- | ------------------------------------- |
| **`mode`** | <code>'none' \| 'one' \| 'all'</code> |


#### SetQueueOptions

| Prop      | Type                  |
| --------- | --------------------- |
| **`ids`** | <code>string[]</code> |


#### PlayOptions

| Prop        | Type                |
| ----------- | ------------------- |
| **`index`** | <code>number</code> |


#### SeekToTimeOptions

| Prop       | Type                |
| ---------- | ------------------- |
| **`time`** | <code>number</code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


### Type Aliases


#### Relation

<code>'artists' | 'albums' | 'songs'</code>


#### GetLibraryArtistsResult

<code>{ artists: ArtistResult[]; } & <a href="#getmultidataresult">GetMultiDataResult</a></code>


#### GetLibraryAlbumsResult

<code>{ albums: AlbumResult[]; } & <a href="#getmultidataresult">GetMultiDataResult</a></code>


#### GetLibrarySongsResult

<code>{ songs: SongResult[]; } & <a href="#getmultidataresult">GetMultiDataResult</a></code>


#### GetLibraryPlaylistsResult

<code>{ playlists: PlaylistResult[]; } & <a href="#getmultidataresult">GetMultiDataResult</a></code>


#### ActionRatingsResult

<code>{ ratings: <a href="#ratingsresult">RatingsResult</a>; }</code>


#### RatingsResult

<code>{ [key: string]: <a href="#rating">Rating</a>; }</code>


#### Rating

<code>-1 | 1</code>


#### GetRatingsOptions

<code>{ type: <a href="#ratingtype">RatingType</a>; ids: string[]; }</code>


#### RatingType

<code><a href="#categorytype">CategoryType</a> | `library-${<a href="#categorytype">CategoryType</a>}`</code>


#### CategoryType

<code>'artists' | 'albums' | 'songs' | 'playlists'</code>


#### AddRatingOptions

<code>{ type: <a href="#ratingtype">RatingType</a>; id: string; value: -1 | 1; }</code>


#### DeleteRatingOptions

<code>{ type: <a href="#ratingtype">RatingType</a>; id: string; }</code>


#### PlaybackStateDidChangeListener

<code>(data: <a href="#playbackstatedidchangeresult">PlaybackStateDidChangeResult</a>): void</code>


#### PlaybackStateDidChangeResult

<code>{ state: <a href="#playbackstates">PlaybackStates</a>; }</code>


#### PlaybackStates

<code>keyof typeof MusicKit.<a href="#playbackstates">PlaybackStates</a></code>


#### NowPlayingItemDidChangeListener

<code>(data: <a href="#nowplayingitemdidchangeresult">NowPlayingItemDidChangeResult</a>): void</code>


#### NowPlayingItemDidChangeResult

<code>{ song: <a href="#songresult">SongResult</a>; index: number; }</code>


#### AuthorizationStatusDidChangeListener

<code>(data: <a href="#authorizationstatusdidchangeresult">AuthorizationStatusDidChangeResult</a>): void</code>


#### AuthorizationStatusDidChangeResult

<code>{ status: <a href="#authorizationstatus">AuthorizationStatus</a>; }</code>


#### AuthorizationStatus

<code>'unavailable' | 'notDetermined' | 'denied' | 'restricted' | 'authorized'</code>

</docgen-api>
