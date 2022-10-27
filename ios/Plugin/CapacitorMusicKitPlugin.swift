import Capacitor
import Foundation
import MediaPlayer
import MusicKit

/// Please read the Capacitor iOS Plugin Development Guide
/// here: https://capacitorjs.com/docs/plugins/ios
@available(iOS 16.0, *)
@objc(CapacitorMusicKitPlugin)
public class CapacitorMusicKitPlugin: CAPPlugin {
    let baseUrl = "https://api.music.apple.com"
    let storefront = "jp"
    let player = MPMusicPlayerController.applicationMusicPlayer
    var preQueueSongs: [Song] = []

    let sSize = 200
    let mSize = 400
    let lSize = 600

    override public func load() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.playbackStateDidChange),
            name: .MPMusicPlayerControllerPlaybackStateDidChange,
            object: nil)

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.nowPlayingItemDidChange),
            name: .MPMusicPlayerControllerNowPlayingItemDidChange,
            object: nil)

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.authorizationStatusDidChange),
            name: UIApplication.didBecomeActiveNotification,
            object: nil
        )
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    @objc private func playbackStateDidChange() {
        var result = ""

        if player.playbackState == .playing {
            result = "playing"
        } else if player.playbackState == .paused {
            result = "paused"
        } else if player.playbackState == .stopped {
            result = "stopped"
        } else if player.playbackState == .interrupted {
            result = "paused"
        }

        if result != "" {
            notifyListeners("playbackStateDidChange", data: ["state": result])
        }
    }

    @objc private func nowPlayingItemDidChange() {
        Task {
            notifyListeners(
                "nowPlayingItemDidChange",
                data: ["item": await currentSong() as Any, "index": player.indexOfNowPlayingItem])
        }
    }

    @objc private func authorizationStatusDidChange() {
        var result = ""
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

        if result != "" {
            notifyListeners("authorizationStatusDidChange", data: ["status": result])
        }
    }

    func formatISOString(_ optDate: Date?) -> String? {
        guard let date = optDate else {
            return nil
        }
        return ISO8601DateFormatter().string(from: date)
    }

    func toMediaItem(_ item: MusicKit.MusicPlayer.Queue.Entry.Item?, _ size: Int) async -> [String:
        Any?]?
    {
        switch item {
        case let .song(song):
            let artworkUrl = await toBase64Image(song.artwork, size)
            return [
                "albumInfo": song.albumTitle,
                "albumName": song.albumTitle,
                "artistName": song.artistName,
                "artwork": ["url": artworkUrl],
                "artworkURL": artworkUrl,
                "attributes": nil,
                "contentRating": song.contentRating == .clean ? "clean" : "explicit",
                "discNumber": song.discNumber,
                "id": song.id.rawValue,
                "info": song.title,
                "isExplicitItem": song.contentRating == .explicit,
                "isPlayable": true,
                "isPreparedToPlay": nil,
                "isrc": song.isrc,
                "playbackDuration": Double(song.duration ?? 0) * 1000,
                "playlistArtworkURL": artworkUrl,
                "playlistName": song.albumTitle,
                "previewURL": song.previewAssets?.first?.url,
                "releaseDate": formatISOString(song.releaseDate),
                "title": song.title,
                "trackNumber": song.trackNumber,
                "type": "songs",
            ]
        default: return nil
        }
    }

    func queueSongs() async -> [[String: Any?]] {
        var songs: [[String: Any?]?] = []
        for entry in ApplicationMusicPlayer.shared.queue.entries {
            songs.append(await toMediaItem(entry.item, sSize))
        }
        return songs.compactMap { $0 }
    }

    func currentSong() async -> [String: Any?]? {
        return await toMediaItem(ApplicationMusicPlayer.shared.queue.currentEntry?.item, lSize)
    }

    func buildParams(_ optIds: [String]?, _ optLimit: Int?, _ optOffset: Int?) -> String {
        var params = ""
        if let ids = optIds {
            params = "?ids=\(ids.joined(separator: "%2C"))"
        } else {
            if let limit = optLimit {
                params = "?limit=\(limit)&"
            }
            if let offset = optOffset {
                params += "offset=\(offset)&"
            }
        }
        return params
    }

    func getDataRequestJSON(_ url: String) async -> [String: Any] {
        do {
            guard let url = URL(string: "\(baseUrl)\(url)") else {
                return [:]
            }
            let data = try await MusicDataRequest(urlRequest: URLRequest(url: url)).response().data
            return try JSONSerialization.jsonObject(with: data, options: []) as! [String: Any]
        } catch {
            return [:]
        }
    }

    func toBase64Image(_ artwork: MPMediaItemArtwork?, _ size: Int) -> String? {
        if let artworkItem = artwork {
            let image = artworkItem.image(at: CGSize(width: size, height: size))
            if let data = image?.jpegData(compressionQuality: 0.1) {
                return data.base64EncodedString()
            }
        }
        return nil
    }

    func toBase64Image(_ artwork: Artwork?, _ size: Int) async -> String? {
        do {
            guard let url = artwork?.url(width: size, height: size) else {
                return nil
            }

            let imageRequest = URLRequest(url: url)
            let (data, _) = try await URLSession.shared.data(for: imageRequest)
            guard let image = UIImage(data: data) else {
                return nil
            }

            if let imageData = image.jpegData(compressionQuality: 0.1) {
                return imageData.base64EncodedString()
            }
        } catch {
            return nil
        }
        return nil
    }

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        print(value)
        call.resolve(["value": value])
    }

    @objc func configure(_ call: CAPPluginCall) {
        call.resolve(["result": true])
    }

    @objc func isAuthorized(_ call: CAPPluginCall) {
        var result = false
        if MusicAuthorization.currentStatus == .authorized {
            result = true
        }
        call.resolve(["result": result])
    }

    @objc func hasMusicSubscription(_ call: CAPPluginCall) {
        Task {
            var result = false
            do {
                let subscription = try await MusicSubscription.current
                result = subscription.canPlayCatalogContent
            } catch {

            }
            call.resolve(["result": result])
        }
    }

    @objc func authorize(_ call: CAPPluginCall) {
        Task {
            var result = false
            let status = await MusicAuthorization.request()
            if status == .authorized {
                result = true
            } else {
                guard let settingsURL = await URL(string: UIApplication.openSettingsURLString)
                else {
                    return call.resolve(["result": result])
                }
                await UIApplication.shared.open(settingsURL, options: [:], completionHandler: nil)
            }
            call.resolve(["result": result])
        }
    }

    @objc func unauthorize(_ call: CAPPluginCall) {
        Task {
            // 設定アプリに遷移するだけなので authorizationStatusDidChange は発火させない
            guard let settingsURL = await URL(string: UIApplication.openSettingsURLString) else {
                return call.resolve(["result": false])
            }
            await UIApplication.shared.open(settingsURL, options: [:], completionHandler: nil)
            call.resolve(["result": true])
        }
    }

    @objc func getLibraryArtists(_ call: CAPPluginCall) {
        let limit = call.getInt("limit") ?? 1
        let offset = call.getInt("offset") ?? 0
        let ids = call.getArray("ids", String.self)

        let optAlbumId = call.getString("albumId")
        let optSongId = call.getString("songId")
        let optMusicVideoId = call.getString("musicVideoId")

        Task {
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
            let json = await getDataRequestJSON(url)
            call.resolve(json)
        }
    }

    @objc func getLibraryAlbums(_ call: CAPPluginCall) {
        let limit = call.getInt("limit") ?? 1
        let offset = call.getInt("offset") ?? 0
        let ids = call.getArray("ids", String.self)

        let optCatalogId = call.getString("catalogId")
        let optArtistId = call.getString("artistId")
        let optSongId = call.getString("songId")
        let optMusicVideoId = call.getString("musicVideoId")

        Task {
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
            let json = await getDataRequestJSON(url)
            call.resolve(json)
        }
    }

    @objc func getLibrarySongs(_ call: CAPPluginCall) {
        let limit = call.getInt("limit") ?? 1
        let offset = call.getInt("offset") ?? 0
        let ids = call.getArray("ids", String.self)

        let optCatalogId = call.getString("catalogId")
        let optAlbumId = call.getString("albumId")
        let optPlaylistId = call.getString("playlistId")

        Task {
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
            let json = await getDataRequestJSON(url)
            call.resolve(json)
        }
    }

    @objc func getCurrentSong(_ call: CAPPluginCall) {
        Task {
            call.resolve(["item": await currentSong()])
        }
    }

    @objc func getQueueSongs(_ call: CAPPluginCall) {
        Task {
            call.resolve(["items": await queueSongs()])
        }
    }

    @objc func getCurrentIndex(_ call: CAPPluginCall) {
        call.resolve(["index": player.indexOfNowPlayingItem])
    }

    @objc func getCurrentPlaybackTime(_ call: CAPPluginCall) {
        call.resolve(["time": ApplicationMusicPlayer.shared.playbackTime])
    }

    @objc func getRepeatMode(_ call: CAPPluginCall) {
        var mode = "none"
        if ApplicationMusicPlayer.shared.state.repeatMode == .all {
            mode = "all"
        } else if ApplicationMusicPlayer.shared.state.repeatMode == .one {
            mode = "one"
        }
        call.resolve(["mode": mode])
    }

    @objc func setRepeatMode(_ call: CAPPluginCall) {
        let mode = call.getString("mode") ?? "none"
        if mode == "none" {
            ApplicationMusicPlayer.shared.state.repeatMode = MusicPlayer.RepeatMode.none
        } else if mode == "one" {
            ApplicationMusicPlayer.shared.state.repeatMode = MusicPlayer.RepeatMode.none
        } else if mode == "all" {
            ApplicationMusicPlayer.shared.state.repeatMode = MusicPlayer.RepeatMode.all
        }
        call.resolve(["result": true])
    }

    @objc func setQueue(_ call: CAPPluginCall) {
        let ids: [String] = call.getArray("ids", String.self) ?? []

        Task {
            var requestLibrary = MusicLibraryRequest<Song>()
            requestLibrary.filter(matching: \.id, memberOf: ids.map { MusicItemID($0) })
            let responseLibrary = try await requestLibrary.response()

            let libraryIds = responseLibrary.items.map { $0.id.rawValue }
            let catalogIds = ids.filter { !libraryIds.contains($0) }

            var responseCatalog: MusicCatalogResourceResponse<Song>? = nil
            if catalogIds.count > 0 {
                let requestCatalog = MusicCatalogResourceRequest<Song>(
                    matching: \.id, memberOf: catalogIds.map { MusicItemID($0) })
                responseCatalog = try await requestCatalog.response()
            }

            // sort songs
            var songs: [Song] = []
            ids.forEach { id in
                let libraryItem = responseLibrary.items.first(where: { $0.id.rawValue == id })
                if let track = libraryItem {
                    songs.append(track)
                }

                if let catalog = responseCatalog {
                    if let track = catalog.items.first(where: { $0.id.rawValue == id }) {
                        songs.append(track)
                    }
                }
            }
            ApplicationMusicPlayer.shared.queue = .init(for: songs)
            try await ApplicationMusicPlayer.shared.prepareToPlay()
            preQueueSongs = songs
            call.resolve(["result": true])
        }
    }

    @objc func play(_ call: CAPPluginCall) {
        let index = call.getInt("index")

        Task {
            var result = false
            do {
                if let startIndex = index {
                    // Use preQueueSongs because there is no data in the ApplicationMusicPlayer.shared.queue before playback.
                    let songs = preQueueSongs
                    let trackIndex = songs.count > startIndex ? startIndex : songs.count
                    ApplicationMusicPlayer.shared.queue = .init(
                        for: songs, startingAt: songs[trackIndex])

                    // Await prepare
                    for time in [1, 1, 1] {
                        sleep(UInt32(time))
                        try await ApplicationMusicPlayer.shared.prepareToPlay()
                        if ApplicationMusicPlayer.shared.isPreparedToPlay {
                            try await ApplicationMusicPlayer.shared.play()
                            result = true
                            break
                        }
                    }
                } else {

                    // Await prepare
                    for time in [0, 1, 1] {
                        sleep(UInt32(time))
                        if ApplicationMusicPlayer.shared.isPreparedToPlay {
                            try await ApplicationMusicPlayer.shared.play()
                            result = true
                            break
                        }
                    }
                }
            } catch {
                print(error)
            }
            call.resolve(["result": result])
        }
    }

    @objc func pause(_ call: CAPPluginCall) {
        Task {
            ApplicationMusicPlayer.shared.pause()
            call.resolve(["result": true])
        }
    }

    @objc func stop(_ call: CAPPluginCall) {
        Task {
            ApplicationMusicPlayer.shared.stop()
            call.resolve(["result": true])
        }
    }

    @objc func nextPlay(_ call: CAPPluginCall) {
        Task {
            var result = false
            do {
                try await ApplicationMusicPlayer.shared.skipToNextEntry()
                result = true
            } catch {
                print(error)
            }
            call.resolve(["result": result])
        }
    }

    @objc func previousPlay(_ call: CAPPluginCall) {
        Task {
            var result = false
            do {
                try await ApplicationMusicPlayer.shared.skipToPreviousEntry()
                result = true
            } catch {
                print(error)
            }
            call.resolve(["result": result])
        }
    }

    @objc func seekToTime(_ call: CAPPluginCall) {
        let playbackTime = call.getDouble("time") ?? 0.0
        ApplicationMusicPlayer.shared.playbackTime = playbackTime
        call.resolve(["result": true])
    }
}
