import Foundation
import Capacitor
import MediaPlayer
import MusicKit

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@available(iOS 16.0, *)
@objc(CapacitorMusicKitPlugin)
public class CapacitorMusicKitPlugin: CAPPlugin {
    let player = MPMusicPlayerController.applicationMusicPlayer
    var queueTracks: [Song] = []
    
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
        } else if player.playbackState == .paused  {
            result = "paused"
        } else if player.playbackState == .stopped  {
            result = "stopped"
        } else if player.playbackState == .interrupted {
            result = "paused"
        }

        if result != "" {
            notifyListeners("playbackStateDidChange", data: ["result": result])
        }
    }
    
    @objc private func nowPlayingItemDidChange() {
        Task {
            var resultTrack: [String: Any?]? = nil
            let index = player.indexOfNowPlayingItem
            
            if index >= 0 && queueTracks.count >= index {
                let track = queueTracks[index]
                resultTrack = [
                    "id": track.id.rawValue,
                    "name": track.title,
                    "discNumber": track.discNumber,
                    "trackNumber": track.trackNumber,
                    "durationMs": Double(track.duration ?? 0) * 1000,
                    "artworkUrl": await toBase64Image(track.artwork, lSize)
                ]
            }
            
            notifyListeners("nowPlayingItemDidChange", data: ["result": resultTrack])
        }
    }

    @objc private func authorizationStatusDidChange() {
        Task {
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
                notifyListeners("authorizationStatusDidChange", data: ["result": result])
            }
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
            
            let imageRequest = URLRequest (url: url)
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
                    call.resolve(["result": result])
                    return
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
                call.resolve(["result": false])
                return
            }
            await UIApplication.shared.open(settingsURL, options: [:], completionHandler: nil)
            call.resolve(["result": true])
        }
    }
    
    @objc func getLibraryAlbums(_ call: CAPPluginCall) {
        let limit = call.getInt("limit") ?? 0
        let offset = call.getInt("offset") ?? 0
        
        Task {
            var hasNext = false
            var resultAlbums: [[String: String?]] = []
            
            var request = MusicLibraryRequest<Album>()
            request.sort(by: \.title, ascending: true)
            request.limit = limit
            request.offset = offset
            let response = try await request.response()
            
            for album in response.items {
                resultAlbums.append([
                    "id": album.id.rawValue,
                    "name": album.title,
                    "artworkUrl": await toBase64Image(album.artwork, sSize),
                ])
            }

            if response.items.count == limit {
                hasNext = true
            }

            call.resolve([
                "albums": resultAlbums,
                "hasNext": hasNext,
            ])
        }
    }
    
    @objc func getLibraryAlbum(_ call: CAPPluginCall) {
        let id = call.getString("id")

        Task {
            var reason = "開始"
            var resultAlbumId: String? = nil
            var resultAlbumName: String? = nil
            var resultAlbumArtworkUrl: String? = nil
            var resultTracks: [[String: Any?]] = []

            if MusicAuthorization.currentStatus == .authorized {
                reason = reason + ",ログイン済み"
                
                if let albumId = id {
                    var requestAlbum = MusicLibraryRequest<Album>()
                    requestAlbum.filter(matching: \.id, equalTo: MusicItemID(albumId))
                    let responseAlbum = try await requestAlbum.response()
                    if let album = responseAlbum.items.first {
                        reason = reason + ",アルバムあり"
                        
                        var requestSong = MusicLibraryRequest<Track>()
                        requestSong.filter(matching: \.albums, contains: album)
                        requestSong.sort(by: \.discNumber, ascending: true)
                        requestSong.sort(by: \.trackNumber, ascending: true)
                        let responseSong = try await requestSong.response()
                        
                        if responseSong.items.count > 0 {
                            reason = reason + ",曲あり"
                            
                            resultAlbumId = id
                            resultAlbumName = String(album.title)
                            resultAlbumArtworkUrl = await toBase64Image(album.artwork, lSize)
                            let artworkUrl = await toBase64Image(album.artwork, sSize)

                            responseSong.items.forEach {
                                resultTracks.append([
                                    "id": $0.id.rawValue,
                                    "name": $0.title,
                                    "discNumber": $0.discNumber,
                                    "trackNumber": $0.trackNumber,
                                    "durationMs": Double($0.duration ?? 0) * 1000,
                                    "artworkUrl": artworkUrl,
                                ])
                            }
                        } else {
                            reason = reason + ",曲なし"
                        }
                    } else {
                        reason = reason + ",アルバムなし"
                    }
                }
            } else {
                reason = reason + ",未ログイン"
            }

            if(resultAlbumId == nil) {
                call.resolve(["reason": reason, "album": nil])
            } else {
                print(resultTracks)
                call.resolve([
                    "reason": reason,
                    "album": [
                        "id": resultAlbumId,
                        "name": resultAlbumName,
                        "artworkUrl": resultAlbumArtworkUrl,
                        "tracks": resultTracks,
                    ],
                ])
            }
        }
    }
    
    @objc func getCurrentTrack(_ call: CAPPluginCall) {
        Task {
            var resultTrack: [String: Any?]? = nil
            let index = player.indexOfNowPlayingItem
            
            if index >= 0 && queueTracks.count >= index {
                let track = queueTracks[index]
                resultTrack = [
                    "id": track.id.rawValue,
                    "name": track.title,
                    "discNumber": track.discNumber,
                    "trackNumber": track.trackNumber,
                    "durationMs": Double(track.duration ?? 0) * 1000,
                    "artworkUrl": await toBase64Image(track.artwork, lSize)
                ]
            }

            call.resolve(["track": resultTrack])
        }
    }
    
    @objc func getQueueTracks(_ call: CAPPluginCall) {
        Task {
            var resultTracks: [[String: Any?]] = []
            
            for track in queueTracks {
                let artworkUrl = await toBase64Image(track.artwork, sSize)
                resultTracks.append([
                    "id": track.id.rawValue,
                    "name": track.title,
                    "discNumber": track.discNumber,
                    "trackNumber": track.trackNumber,
                    "durationMs": Double(track.duration ?? 0) * 1000,
                    "artworkUrl": artworkUrl
                ])
            }
            call.resolve(["tracks": resultTracks])
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
        if(ApplicationMusicPlayer.shared.state.repeatMode == .all) {
            mode = "all"
        } else if (ApplicationMusicPlayer.shared.state.repeatMode == .one) {
            mode = "one"
        }
        call.resolve(["mode": mode])
    }
    
    @objc func setRepeatMode(_ call: CAPPluginCall) {
        let mode = call.getString("mode") ?? "none"
        if (mode == "none") {
            ApplicationMusicPlayer.shared.state.repeatMode = MusicPlayer.RepeatMode.none
        } else if (mode == "one") {
            ApplicationMusicPlayer.shared.state.repeatMode = MusicPlayer.RepeatMode.none
        } else if (mode == "all") {
            ApplicationMusicPlayer.shared.state.repeatMode = MusicPlayer.RepeatMode.all
        }
        call.resolve(["result": true])
    }
    
    @objc func setQueue(_ call: CAPPluginCall) {
        let ids: [String] = call.getArray("ids", String.self) ?? []

        Task {
            var request = MusicLibraryRequest<Song>()
            request.filter(matching: \.id, memberOf: ids.map {MusicItemID($0)})
            let response = try await request.response()
            // sort tracks
            var tracks: [Song] = []
            ids.forEach { id in
                let item = response.items.first(where: { $0.id.rawValue == id })
                if let track = item {
                    tracks.append(track)
                }
            }
            ApplicationMusicPlayer.shared.queue = .init(for: tracks)
            queueTracks = tracks
            call.resolve(["result": true])
        }
    }
    
    @objc func play(_ call: CAPPluginCall) {
        let index = call.getInt("index")
        
        Task {
            var result = false
            do {
                if let startIndex = index {
                    let trackIndex = queueTracks.count > startIndex ? startIndex : queueTracks.count
                    ApplicationMusicPlayer.shared.queue = .init(for: queueTracks, startingAt: queueTracks[trackIndex])
                }
                try await ApplicationMusicPlayer.shared.play()
                result = true
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
