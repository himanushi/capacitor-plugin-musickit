import Capacitor
import Foundation
import MediaPlayer
import MusicKit

@available(iOS 16.0, *)
@objc public class CapacitorMusicKit: NSObject {
    let musicKitPlayer = MusicKitPlayer()
    var isPreview = false

    @objc public func playbackStateDidChange() -> String? {
        var result: String? = nil

        if player.playbackState == .playing {
            result = "playing"
        } else if player.playbackState == .paused {
            result = "paused"
        } else if player.playbackState == .stopped {
            result = "stopped"
        } else if player.playbackState == .interrupted {
            result = "paused"
        }

        return result
    }

    @objc public func nowPlayingItemDidChange() async -> [String: Any]? {
        return ["item": await currentSong() as Any, "index": player.indexOfNowPlayingItem]
    }

    @objc public func authorizationStatusDidChange() -> String? {
        var result: String? = nil
        let status = MusicAuthorization.currentStatus

        if status == .notDetermined {
            result = "notDetermined"
        } else if status == .denied {
            result = "denied"
        } else if status == .restricted {
            result = "restricted"
        } else if status == .authorized {
            result = "authorized"
        }

        return result
    }

    @objc func isAuthorized() -> Bool {
        var result = false
        if MusicAuthorization.currentStatus == .authorized {
            result = true
        }
        return result
    }

    @objc func hasMusicSubscription() async -> Bool {
        var result = false
        do {
            let subscription = try await MusicSubscription.current
            result = subscription.canPlayCatalogContent
        } catch {

        }
        return result
    }

    @objc func authorize() async -> Bool {
        var result = false
        let status = await MusicAuthorization.request()
        if status == .authorized {
            result = true
        } else {
            guard let settingsURL = await URL(string: UIApplication.openSettingsURLString)
            else {
                return result
            }
            await UIApplication.shared.open(settingsURL, options: [:], completionHandler: nil)
        }
        return result
    }

    @objc func unauthorize() async {
        // 設定アプリに遷移するだけなので authorizationStatusDidChange は発火させない
        guard let settingsURL = await URL(string: UIApplication.openSettingsURLString) else {
            return
        }
        await UIApplication.shared.open(settingsURL, options: [:], completionHandler: nil)
    }

    @objc func getLibraryArtists(_ call: CAPPluginCall) async -> [String: Any] {
        let limit = call.getInt("limit") ?? 1
        let offset = call.getInt("offset") ?? 0
        let ids = call.getArray("ids", String.self)

        let optAlbumId = call.getString("albumId")
        let optSongId = call.getString("songId")
        let optMusicVideoId = call.getString("musicVideoId")

        var url = "/v1/me/library/artists"
        let params = buildParams(ids, limit, offset)

        if let albumId = optAlbumId {
            url = "/v1/me/library/albums/\(albumId)/artists"
        } else if let songId = optSongId {
            url = "/v1/me/library/songs/\(songId)/artists"
        } else if let musicVideoId = optMusicVideoId {
            url = "/v1/me/library/music-videos/\(musicVideoId)/artists"
        }

        url = "\(url)\(params)"
        return await getDataRequestJSON(url)
    }

    @objc func getLibraryAlbums(_ call: CAPPluginCall) async -> [String: Any] {
        let limit = call.getInt("limit") ?? 1
        let offset = call.getInt("offset") ?? 0
        let ids = call.getArray("ids", String.self)

        let optCatalogId = call.getString("catalogId")
        let optArtistId = call.getString("artistId")
        let optSongId = call.getString("songId")
        let optMusicVideoId = call.getString("musicVideoId")

        var url = "/v1/me/library/albums"
        let params = buildParams(ids, limit, offset)

        if let catalogId = optCatalogId {
            url = "/v1/catalog/\(storefront)/albums/\(catalogId)/library"
        } else if let artistId = optArtistId {
            url = "/v1/me/library/artists/\(artistId)/albums"
        } else if let songId = optSongId {
            url = "/v1/me/library/songs/\(songId)/albums"
        } else if let musicVideoId = optMusicVideoId {
            url = "/v1/me/library/music-videos/\(musicVideoId)/albums"
        }

        url = "\(url)\(params)"
        return await getDataRequestJSON(url)
    }

    @objc func getLibrarySongs(_ call: CAPPluginCall) async -> [String: Any] {
        let limit = call.getInt("limit") ?? 1
        let offset = call.getInt("offset") ?? 0
        let ids = call.getArray("ids", String.self)

        let optCatalogId = call.getString("catalogId")
        let optAlbumId = call.getString("albumId")
        let optPlaylistId = call.getString("playlistId")

        var url = "/v1/me/library/songs"
        let params = buildParams(ids, limit, offset)

        if let catalogId = optCatalogId {
            url = "/v1/catalog/\(storefront)/songs/\(catalogId)/library"
        } else if let albumId = optAlbumId {
            url = "/v1/me/library/albums/\(albumId)/tracks"
        } else if let playlistId = optPlaylistId {
            url = "/v1/me/library/playlists/\(playlistId)/tracks"
        }

        url = "\(url)\(params)"
        return await getDataRequestJSON(url)
    }

    @objc func getCurrentIndex() -> Int {
        return musicKitPlayer.getCurrentIndex()
    }

    @objc func getCurrentPlaybackTime() -> Double {
        return musicKitPlayer.getCurrentPlaybackTime()
    }

    @objc func getRepeatMode() -> String {
        return musicKitPlayer.getRepeatMode()
    }

    @objc func setRepeatMode(_ call: CAPPluginCall) {
        musicKitPlayer.setRepeatMode(call)
    }

    @objc func setQueue(_ call: CAPPluginCall) async throws {
        musicKitPlayer.setQueue(call)
    }

    @objc func play(_ call: CAPPluginCall) async throws {
        musicKitPlayer.play(call)
    }

    @objc func pause() {
        musicKitPlayer.pause()
    }

    @objc func stop() {
        musicKitPlayer.stop()
    }

    @objc func nextPlay() async throws {
        musicKitPlayer.nextPlay()
    }

    @objc func previousPlay() async throws {
        musicKitPlayer.previousPlay()
    }

    @objc func seekToTime(_ call: CAPPluginCall) {
        musicKitPlayer.seekToTime(call)
    }
}
