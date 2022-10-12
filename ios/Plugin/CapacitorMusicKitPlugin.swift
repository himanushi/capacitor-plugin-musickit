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
                
                let query = MPMediaQuery.songs()
                query.filterPredicates = [MPMediaPropertyPredicate(
                    value: id,
                    forProperty: MPMediaItemPropertyAlbumPersistentID,
                    comparisonType: .equalTo)]
                
                if let tracks = query.items {
                    if tracks.count > 0 {
                        reason = reason + ",アルバムあり"
                        tracks.forEach {
                            resultAlbumId = String($0.albumPersistentID)
                            resultAlbumTitle = $0.albumTitle
                            let artworkUrl = toBase64Image($0.artwork)
                            resultAlbumArtworkUrl = artworkUrl
                            
                            resultTracks.append([
                                "id": String($0.persistentID),
                                "title": $0.title,
                                "discNumber": $0.discNumber,
                                "trackNumber": $0.albumTrackNumber,
                                "durationMs": $0.playbackDuration,
                                "artworkUrl": artworkUrl
                            ])
                        }
                    } else {
                        reason = reason + ",アルバムなし"
                    }
                } else {
                    reason = reason + ",アルバムなし"
                }
            } else {
                reason = reason + ",未ログイン"
            }

            if(resultAlbumId == nil) {
                call.resolve(["reason": reason, "album": nil])
            } else {
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
        call.resolve(["tracks": []])
    }
    
    @objc func getCurrentIndex(_ call: CAPPluginCall) {
        call.resolve(["index": -1])
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
        call.resolve(["result": true])
    }
    
    @objc func play(_ call: CAPPluginCall) {
        Task {
            var result = false
            do {
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
        call.resolve(["result": true])
    }
    
    @objc func previousPlay(_ call: CAPPluginCall) {
        call.resolve(["result": true])
    }
    
    @objc func seekToTime(_ call: CAPPluginCall) {
        let playbackTime = call.getDouble("time") ?? 0.0
        ApplicationMusicPlayer.shared.playbackTime = playbackTime
        call.resolve(["result": true])
    }
}
