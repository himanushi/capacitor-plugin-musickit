import Capacitor
import Foundation
import MediaPlayer
import MusicKit

/// Please read the Capacitor iOS Plugin Development Guide
/// here: https://capacitorjs.com/docs/plugins/ios
@available(iOS 16.0, *)
@objc(CapacitorMusicKitPlugin)
public class CapacitorMusicKitPlugin: CAPPlugin {
    private let musicKit = CapacitorMusicKit()

    override public func load() {
        musicKit.notifyListeners = notifyListeners
        musicKit.load()

        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(.playback, mode: .default)
            try audioSession.setActive(true)
        } catch {
            print(error)
        }

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
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(playerDidFinishPlaying),
            name: .AVPlayerItemDidPlayToEndTime,
            object: nil
        )
    }

    @objc func playerDidFinishPlaying(note: NSNotification) {
        MPNowPlayingInfoCenter.default().playbackState = .paused
        notifyListeners("playbackStateDidChange", data: ["result": "completed"])
    }

    @objc private func playbackStateDidChange() {
        if let result = musicKit.playbackStateDidChange() {
            notifyListeners("playbackStateDidChange", data: ["state": result])
        }
    }

    @objc private func nowPlayingItemDidChange() {
        Task {
            notifyListeners(
                "nowPlayingItemDidChange", data: await musicKit.nowPlayingItemDidChange())
        }
    }

    @objc private func authorizationStatusDidChange() {
        if let result = musicKit.authorizationStatusDidChange() {
            notifyListeners("authorizationStatusDidChange", data: ["status": result])
        }
    }

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        print(value)
        call.resolve(["value": value])
    }

    @objc func configure(_ call: CAPPluginCall) {
        call.resolve()
    }

    @objc func isAuthorized(_ call: CAPPluginCall) {
        call.resolve(["result": musicKit.isAuthorized()])
    }

    @objc func hasMusicSubscription(_ call: CAPPluginCall) {
        Task {
            call.resolve(["result": await musicKit.hasMusicSubscription()])
        }
    }

    @objc func authorize(_ call: CAPPluginCall) {
        Task {
            await musicKit.authorize()
            call.resolve()
        }
    }

    @objc func unauthorize(_ call: CAPPluginCall) {
        Task {
            await musicKit.unauthorize()
            call.resolve()
        }
    }
    
    @objc func api(_ call: CAPPluginCall) {
        Task {
            do {
                call.resolve(try await musicKit.api(call))
            } catch {
                call.reject("error")
            }
        }
    }

    @objc func getLibraryArtists(_ call: CAPPluginCall) {
        Task {
            call.resolve(try await musicKit.getLibraryArtists(call))
        }
    }

    @objc func getLibraryAlbums(_ call: CAPPluginCall) {
        Task {
            call.resolve(try await musicKit.getLibraryAlbums(call))
        }
    }

    @objc func getLibrarySongs(_ call: CAPPluginCall) {
        Task {
            call.resolve(try await musicKit.getLibrarySongs(call))
        }
    }

    @objc func getCurrentSong(_ call: CAPPluginCall) {
        Task {
            call.resolve(["item": await musicKit.currentSong() as Any])
        }
    }

    @objc func getQueueSongs(_ call: CAPPluginCall) {
        Task {
            call.resolve(["items": await musicKit.queueSongs()])
        }
    }

    @objc func getCurrentIndex(_ call: CAPPluginCall) {
        call.resolve(["index": musicKit.getCurrentIndex()])
    }

    @objc func getCurrentPlaybackTime(_ call: CAPPluginCall) {
        call.resolve(["time": musicKit.getCurrentPlaybackTime()])
    }

    @objc func getRepeatMode(_ call: CAPPluginCall) {
        call.resolve(["mode": musicKit.getRepeatMode()])
    }

    @objc func setRepeatMode(_ call: CAPPluginCall) {
        musicKit.setRepeatMode(call)
        call.resolve()
    }

    @objc func getShuffleMode(_ call: CAPPluginCall) {
        call.resolve(["mode": musicKit.getRepeatMode()])
    }

    @objc func setShuffleMode(_ call: CAPPluginCall) {
        musicKit.setRepeatMode(call)
        call.resolve()
    }

    @objc func setQueue(_ call: CAPPluginCall) {
        Task {
            try await musicKit.setQueue(call)
            call.resolve()
        }
    }

    @objc func getRatings(_ call: CAPPluginCall) {
        Task {
            let type = call.getString("type")!
            let ids = call.getArray("ids", String.self)!
            call.resolve(
                try await Convertor.getDataRequestJSON(
                    "/v1/me/ratings/\(type)",
                    params: ["ids": ids.joined(separator: "%2C")]
                ))
        }
    }

    @objc func addRating(_ call: CAPPluginCall) {
        Task {
            let type = call.getString("type")!
            let id = call.getString("id")!
            let value = call.getInt("value")!
            let url = URL(string: "https://api.music.apple.com/v1/me/ratings/\(type)/\(id)")!
            var request = URLRequest(url: url)
            request.httpMethod = "PUT"
            let body = [
                "attributes": [
                    "value": value
                ],
                "type": "ratings",
            ]
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
            try await MusicDataRequest(urlRequest: request).response()
            call.resolve()
        }
    }

    @objc func deleteRating(_ call: CAPPluginCall) {
        Task {
            let type = call.getString("type")!
            let id = call.getString("id")!
            let url = URL(string: "https://api.music.apple.com/v1/me/ratings/\(type)/\(id)")!
            var request = URLRequest(url: url)
            request.httpMethod = "DELETE"
            try await MusicDataRequest(urlRequest: request).response()
            call.resolve()
        }
    }

    @objc func play(_ call: CAPPluginCall) {
        Task {
            try await musicKit.play(call)
            call.resolve()
        }
    }

    @objc func pause(_ call: CAPPluginCall) {
        musicKit.pause()
        call.resolve()
    }

    @objc func stop(_ call: CAPPluginCall) {
        musicKit.stop()
        call.resolve()
    }

    @objc func nextPlay(_ call: CAPPluginCall) {
        Task {
            try await musicKit.nextPlay()
            call.resolve()
        }
    }

    @objc func previousPlay(_ call: CAPPluginCall) {
        Task {
            try await musicKit.previousPlay()
            call.resolve()
        }
    }

    @objc func seekToTime(_ call: CAPPluginCall) {
        musicKit.seekToTime(call)
        call.resolve()
    }
}
