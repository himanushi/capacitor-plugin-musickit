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
* [`addListener('playbackStateDidChange', ...)`](#addlistenerplaybackstatedidchange)
* [`addListener('authorizationStatusDidChange', ...)`](#addlistenerauthorizationstatusdidchange)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### echo(...)

```typescript
echo(options: { value: string; }) => Promise<{ value: string; }>
```

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------


### configure(...)

```typescript
configure(options: { config: MusicKit.Config; }) => Promise<{ result: boolean; }>
```

| Param         | Type                          |
| ------------- | ----------------------------- |
| **`options`** | <code>{ config: any; }</code> |

**Returns:** <code>Promise&lt;{ result: boolean; }&gt;</code>

--------------------


### isAuthorized()

```typescript
isAuthorized() => Promise<{ result: boolean; }>
```

**Returns:** <code>Promise&lt;{ result: boolean; }&gt;</code>

--------------------


### hasMusicSubscription()

```typescript
hasMusicSubscription() => Promise<{ result: boolean; }>
```

**Returns:** <code>Promise&lt;{ result: boolean; }&gt;</code>

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
