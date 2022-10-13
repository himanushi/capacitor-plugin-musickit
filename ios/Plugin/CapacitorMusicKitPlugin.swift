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
    
    override public func load() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.playbackStateDidChange),
            name: .MPMusicPlayerControllerPlaybackStateDidChange,
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
    
    func toBase64Image(_ artwork: MPMediaItemArtwork?) -> String? {
        if let artworkItem = artwork {
            let image = artworkItem.image(at: CGSize(width: 100, height: 100))
            if let data = image?.jpegData(compressionQuality: 0.1) {
                return data.base64EncodedString()
            }
        }
        return nil
    }
    
    func toBase64Image(_ artwork: Artwork?) async -> String? {
        do {
            guard let url = artwork?.url(width: 600, height: 600) else {
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
        var hasNext = false
        var resultAlbums: [[String: String?]] = []

        let query = MPMediaQuery.albums()
        if let collections = query.collections {
            let rangeEnd = collections.count > offset + limit ? offset + limit : collections.count
            for collection in collections[offset..<rangeEnd] {
                if let album = collection.representativeItem {
                    resultAlbums.append([
                        "title": album.albumTitle,
                        "id": String(album.albumPersistentID),
                        "artworkUrl": toBase64Image(album.artwork),
                    ])
                }
            }
            hasNext = collections.count != rangeEnd
        }

        call.resolve([
            "albums": resultAlbums,
            "hasNext": hasNext,
        ])
    }
    
    @objc func getLibraryAlbum(_ call: CAPPluginCall) {
        let id = call.getString("id")

        Task {
            var reason = "開始"
            var resultAlbumId: String? = nil
            var resultAlbumTitle: String? = nil
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
                            resultAlbumTitle = String(album.title)
                            resultAlbumArtworkUrl = await toBase64Image(album.artwork)

                            responseSong.items.forEach {
                                resultTracks.append([
                                    "id": $0.id.rawValue,
                                    "title": $0.title,
                                    "discNumber": $0.discNumber,
                                    "trackNumber": $0.trackNumber,
                                    "durationMs": $0.duration,
                                    "artworkUrl": resultAlbumArtworkUrl
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
                        "title": resultAlbumTitle,
                        "artworkUrl": resultAlbumArtworkUrl,
                        "tracks": resultTracks,
                    ],
                ])
            }
        }
    }
    
    @objc func getCurrentTrack(_ call: CAPPluginCall) {
        call.resolve(["track": nil])
    }
    
    @objc func getQueueTracks(_ call: CAPPluginCall) {
        
        Task {
            var resultTracks: [[String: Any?]] = []
            
            for track in queueTracks {
                let artworkUrl = await toBase64Image(track.artwork)
                resultTracks.append([
                    "id": track.id.rawValue,
                    "title": track.title,
                    "discNumber": track.discNumber,
                    "trackNumber": track.trackNumber,
                    "durationMs": track.duration,
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
        call.resolve(["time": 0])
    }
    
    @objc func getRepeatMode(_ call: CAPPluginCall) {
        call.resolve(["mode": "none"])
    }
    
    @objc func setRepeatMode(_ call: CAPPluginCall) {
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
