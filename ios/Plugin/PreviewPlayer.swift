import Capacitor
import Foundation
import MediaPlayer
import MusicKit

@available(iOS 16.0, *)
@objc public class PreviewPlayer: NSObject {
    let player = MPMusicPlayerController.applicationMusicPlayer
    var preQueueSongs: [Song] = []
    var previewPlayer: AVQueuePlayer? = nil
    var currentIndex = 0
    var notifyListeners: NotifyListeners?

    let sSize = 200
    let mSize = 400
    let lSize = 600

    func queueSongs() async -> [[String: Any?]] {
        var songs: [[String: Any?]?] = []
        var count = 0
        for song in preQueueSongs {
            let artwrokUrl = await toBase64Image(song.artwork, sSize)
            songs.append(await Convertor.toMediaItem(item: song, artworkUrl: artwrokUrl))
            count += 1
        }
        return songs.compactMap { $0 }
    }

    func currentSong() async -> [String: Any?]? {
        return await Convertor.toMediaItem(item: preQueueSongs[currentIndex], size: lSize)
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

    @objc func getCurrentIndex() -> Int {
        return player.indexOfNowPlayingItem
    }

    @objc func getCurrentPlaybackTime() -> Double {
        if let player = previewPlayer {
            return Double(CMTimeGetSeconds(player.currentTime()))
        }
        return 0.0
    }

    @objc func getRepeatMode() -> String {
        var mode = "none"
        if ApplicationMusicPlayer.shared.state.repeatMode == .all {
            mode = "all"
        } else if ApplicationMusicPlayer.shared.state.repeatMode == .one {
            mode = "one"
        }
        return mode
    }

    @objc func setRepeatMode(_ call: CAPPluginCall) {
        let mode = call.getString("mode") ?? "none"
        if mode == "none" {
            ApplicationMusicPlayer.shared.state.repeatMode = MusicPlayer.RepeatMode.none
        } else if mode == "one" {
            ApplicationMusicPlayer.shared.state.repeatMode = MusicPlayer.RepeatMode.one
        } else if mode == "all" {
            ApplicationMusicPlayer.shared.state.repeatMode = MusicPlayer.RepeatMode.all
        }
    }

    func setQueue(_ songs: [Song]) async throws {
        currentIndex = 0
        preQueueSongs = songs
        let urls = songs.map { $0.previewAssets?.first?.url }.compactMap { $0 }
        let playerItems = urls.map { AVPlayerItem(url: $0) }
        previewPlayer = AVQueuePlayer(items: playerItems)
    }

    @objc func play(_ call: CAPPluginCall) async throws {
        let optIndex = call.getInt("index")

        if let pPlayer = previewPlayer, let index = optIndex {
            currentIndex = index
            await pPlayer.play()
            notifyListeners!("playbackStateDidChange", ["state": "playing"])
            call.resolve(["result": true])
            return
        }
    }

    @objc func pause() {
        ApplicationMusicPlayer.shared.pause()
    }

    @objc func stop() {

        ApplicationMusicPlayer.shared.stop()
    }

    @objc func nextPlay() async throws {
        try await ApplicationMusicPlayer.shared.skipToNextEntry()
    }

    @objc func previousPlay() async throws {
        try await ApplicationMusicPlayer.shared.skipToPreviousEntry()
    }

    @objc func seekToTime(_ call: CAPPluginCall) {
        let playbackTime = call.getDouble("time") ?? 0.0
        ApplicationMusicPlayer.shared.playbackTime = playbackTime
    }
}
