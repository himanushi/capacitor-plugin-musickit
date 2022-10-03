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
* [`getLibraryAlbums(...)`](#getlibraryalbums)
* [`getLibraryAlbum(...)`](#getlibraryalbum)
* [`addListener(any, ...)`](#addlistenerany)
* [`addListener(any, ...)`](#addlistenerany)
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
configure(options: ConfigureOptions) => Promise<ConfigureResult>
```

| Param         | Type                                                          |
| ------------- | ------------------------------------------------------------- |
| **`options`** | <code><a href="#configureoptions">ConfigureOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#configureresult">ConfigureResult</a>&gt;</code>

--------------------


### isAuthorized()

```typescript
isAuthorized() => Promise<IsAuthorizedResult>
```

**Returns:** <code>Promise&lt;<a href="#isauthorizedresult">IsAuthorizedResult</a>&gt;</code>

--------------------


### hasMusicSubscription()

```typescript
hasMusicSubscription() => Promise<HasMusicSubscriptionResult>
```

**Returns:** <code>Promise&lt;<a href="#hasmusicsubscriptionresult">HasMusicSubscriptionResult</a>&gt;</code>

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


### getLibraryAlbums(...)

```typescript
getLibraryAlbums(options: GetLibraryAlbumsOptions) => Promise<GetLibraryAlbumsResult>
```

| Param         | Type                                                                        |
| ------------- | --------------------------------------------------------------------------- |
| **`options`** | <code><a href="#getlibraryalbumsoptions">GetLibraryAlbumsOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#getlibraryalbumsresult">GetLibraryAlbumsResult</a>&gt;</code>

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


### addListener(any, ...)

```typescript
addListener(eventName: any, listenerFunc: PlaybackStateDidChangeListener) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>any</code>                                                                          |
| **`listenerFunc`** | <code><a href="#playbackstatedidchangelistener">PlaybackStateDidChangeListener</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### addListener(any, ...)

```typescript
addListener(eventName: any, listenerFunc: AuthorizationStatusDidChangeListener) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>any</code>                                                                                      |
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


#### ConfigureResult

| Prop         | Type                 |
| ------------ | -------------------- |
| **`result`** | <code>boolean</code> |


#### ConfigureOptions

| Prop         | Type                         |
| ------------ | ---------------------------- |
| **`config`** | <code>MusicKit.Config</code> |


#### IsAuthorizedResult

| Prop         | Type                 |
| ------------ | -------------------- |
| **`result`** | <code>boolean</code> |


#### HasMusicSubscriptionResult

| Prop         | Type                 |
| ------------ | -------------------- |
| **`result`** | <code>boolean</code> |


#### GetLibraryAlbumsResult

| Prop          | Type                                                               |
| ------------- | ------------------------------------------------------------------ |
| **`albums`**  | <code>{ id: string; title: string; artworkUrl?: string; }[]</code> |
| **`hasNext`** | <code>boolean</code>                                               |


#### GetLibraryAlbumsOptions

| Prop         | Type                |
| ------------ | ------------------- |
| **`limit`**  | <code>number</code> |
| **`offset`** | <code>number</code> |


#### GetLibraryAlbumResult

| Prop        | Type                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| **`album`** | <code>{ id: string; title: string; artworkUrl?: string; tracks: GetLibraryAlbumTrackResult[]; }</code> |


#### GetLibraryAlbumTrackResult

| Prop              | Type                |
| ----------------- | ------------------- |
| **`title`**       | <code>string</code> |
| **`id`**          | <code>string</code> |
| **`discNumber`**  | <code>string</code> |
| **`trackNumber`** | <code>string</code> |


#### GetLibraryAlbumOptions

| Prop     | Type                |
| -------- | ------------------- |
| **`id`** | <code>string</code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


### Type Aliases


#### PlaybackStateDidChangeListener

<code>(state: { result: string | number | symbol; }): void</code>


#### PlaybackStates

<code>keyof typeof MusicKit.<a href="#playbackstates">PlaybackStates</a></code>


#### AuthorizationStatusDidChangeListener

<code>(state: { result: <a href="#authorizationstatus">AuthorizationStatus</a>; }): void</code>


#### AuthorizationStatus

<code>'unavailable' | 'notDetermined' | 'denied' | 'restricted' | 'authorized'</code>

</docgen-api>
