#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(CapacitorMusicKitPlugin, "CapacitorMusicKit",
           CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(configure, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(isAuthorized, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(hasMusicSubscription, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(authorize, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(unauthorize, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getLibraryArtists, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getLibraryAlbums, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getLibrarySongs, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getLibraryPlaylists, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getCurrentSong, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getQueueSongs, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getCurrentIndex, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getCurrentPlaybackTime, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getRepeatMode, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setRepeatMode, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setQueue, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(play, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(pause, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(stop, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(nextPlay, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(previousPlay, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(seekToTime, CAPPluginReturnPromise);
)
