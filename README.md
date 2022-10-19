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
* [`getLibraryTrack(...)`](#getlibrarytrack)
* [`getLibraryTracks(...)`](#getlibrarytracks)
* [`getLibraryPlaylist(...)`](#getlibraryplaylist)
* [`getLibraryPlaylists(...)`](#getlibraryplaylists)
* [`getCurrentTrack()`](#getcurrenttrack)
* [`getQueueTracks()`](#getqueuetracks)
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

For testing.

| Param         | Type                                                |
| ------------- | --------------------------------------------------- |
| **`options`** | <code><a href="#echooptions">EchoOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#echoresult">EchoResult</a>&gt;</code>

--------------------


### configure(...)

```typescript
configure(options: ConfigureOptions) => Promise<ActionResult>
```

Required for web, if executed outside of web, nothing will be done.

| Param         | Type                                                          |
| ------------- | ------------------------------------------------------------- |
| **`options`** | <code><a href="#configureoptions">ConfigureOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### isAuthorized()

```typescript
isAuthorized() => Promise<ActionResult>
```

True if authenticated.

**Returns:** <code>Promise&lt;<a href="#actionresult">ActionResult</a>&gt;</code>

--------------------


### hasMusicSubscription()

```typescript
hasMusicSubscription() => Promise<ActionResult>
```

True if you have an Apple Music subscription, not true if you have Apple Music Voice.

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


### getLibraryTrack(...)

```typescript
getLibraryTrack(options: GetSingleDataOptions) => Promise<GetLibraryTrackResult>
```

| Param         | Type                                                                  |
| ------------- | --------------------------------------------------------------------- |
| **`options`** | <code><a href="#getsingledataoptions">GetSingleDataOptions</a></code> |

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


### getCurrentTrack()

```typescript
getCurrentTrack() => Promise<GetCurrentTrackResult>
```

**Returns:** <code>Promise&lt;<a href="#getcurrenttrackresult">GetCurrentTrackResult</a>&gt;</code>

--------------------


### getQueueTracks()

```typescript
getQueueTracks() => Promise<GetQueueTracksResult>
```

**Returns:** <code>Promise&lt;<a href="#getqueuetracksresult">GetQueueTracksResult</a>&gt;</code>

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
| **`tracks`** | <code>TrackResult[]</code>                            |


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


#### TrackResult

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
| **`tracks`**  | <code>TrackResult[]</code>                          |
| **`artists`** | <code>ArtistResult[]</code>                         |


#### GetLibraryTrackResult

| Prop          | Type                                                |
| ------------- | --------------------------------------------------- |
| **`track`**   | <code><a href="#trackresult">TrackResult</a></code> |
| **`artists`** | <code>ArtistResult[]</code>                         |
| **`albums`**  | <code>AlbumResult[]</code>                          |


#### GetLibraryPlaylistResult

| Prop           | Type                                                      |
| -------------- | --------------------------------------------------------- |
| **`playlist`** | <code><a href="#playlistresult">PlaylistResult</a></code> |
| **`tracks`**   | <code>TrackResult[]</code>                                |


#### PlaylistResult

| Prop              | Type                |
| ----------------- | ------------------- |
| **`id`**          | <code>string</code> |
| **`name`**        | <code>string</code> |
| **`description`** | <code>string</code> |
| **`artworkUrl`**  | <code>string</code> |


#### GetCurrentTrackResult

| Prop        | Type                                                |
| ----------- | --------------------------------------------------- |
| **`track`** | <code><a href="#trackresult">TrackResult</a></code> |


#### GetQueueTracksResult

| Prop         | Type                       |
| ------------ | -------------------------- |
| **`tracks`** | <code>TrackResult[]</code> |


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

<code>'artists' | 'albums' | 'tracks'</code>


#### GetLibraryArtistsResult

<code>{ artists: ArtistResult[]; } & <a href="#getmultidataresult">GetMultiDataResult</a></code>


#### GetLibraryAlbumsResult

<code>{ albums: AlbumResult[]; } & <a href="#getmultidataresult">GetMultiDataResult</a></code>


#### GetLibraryTracksResult

<code>{ tracks: TrackResult[]; } & <a href="#getmultidataresult">GetMultiDataResult</a></code>


#### GetLibraryPlaylistsResult

<code>{ playlists: PlaylistResult[]; } & <a href="#getmultidataresult">GetMultiDataResult</a></code>


#### PlaybackStateDidChangeListener

<code>(data: <a href="#playbackstatedidchangeresult">PlaybackStateDidChangeResult</a>): void</code>


#### PlaybackStateDidChangeResult

<code>{ state: <a href="#playbackstates">PlaybackStates</a>; }</code>


#### PlaybackStates

<code>keyof typeof MusicKit.<a href="#playbackstates">PlaybackStates</a></code>


#### NowPlayingItemDidChangeListener

<code>(data: <a href="#nowplayingitemdidchangeresult">NowPlayingItemDidChangeResult</a>): void</code>


#### NowPlayingItemDidChangeResult

<code>{ track: <a href="#trackresult">TrackResult</a>; index: number; }</code>


#### AuthorizationStatusDidChangeListener

<code>(data: <a href="#authorizationstatusdidchangeresult">AuthorizationStatusDidChangeResult</a>): void</code>


#### AuthorizationStatusDidChangeResult

<code>{ status: <a href="#authorizationstatus">AuthorizationStatus</a>; }</code>


#### AuthorizationStatus

<code>'unavailable' | 'notDetermined' | 'denied' | 'restricted' | 'authorized'</code>

</docgen-api>
