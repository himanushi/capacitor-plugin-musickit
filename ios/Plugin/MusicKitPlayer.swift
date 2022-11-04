import Capacitor
import Foundation
import MediaPlayer
import MusicKit

@available(iOS 16.0, *)
@objc public class MusicKitPlayer: NSObject {
    let player = MPMusicPlayerController.applicationMusicPlayer
    var preQueueSongs: [Song] = []
    var notifyListeners: NotifyListeners?

    let sSize = 200
    let mSize = 400
    let lSize = 600

    func queueSongs() async -> [[String: Any?]] {
        var songs: [[String: Any?]?] = []
        var count = 0
        for entry in ApplicationMusicPlayer.shared.queue.entries {
            let artwrokUrl = await Convertor.toBase64Image(preQueueSongs[count].artwork, sSize)
            songs.append(await Convertor.toMediaItem(item: entry.item, artworkUrl: artwrokUrl))
            count += 1
        }
        return songs.compactMap { $0 }
    }

    func currentSong() async -> [String: Any?]? {
        return await Convertor.toMediaItem(
            item: ApplicationMusicPlayer.shared.queue.currentEntry?.item, size: lSize)
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
        return ApplicationMusicPlayer.shared.playbackTime
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
        preQueueSongs = songs
        ApplicationMusicPlayer.shared.queue = .init(for: songs)
        try await ApplicationMusicPlayer.shared.prepareToPlay()
    }

    @objc func play(_ call: CAPPluginCall) async throws {
        let index = call.getInt("index")

        if let startIndex = index {
            // Use preQueueSongs because there is no data in the ApplicationMusicPlayer.shared.queue before playback.
            let songs = preQueueSongs
            let trackIndex = songs.count > startIndex ? startIndex : songs.count
            ApplicationMusicPlayer.shared.queue = .init(
                for: songs,
                startingAt: songs[trackIndex]
            )

            // Await prepare
            for time in [1, 1, 1] {
                sleep(UInt32(time))
                try await ApplicationMusicPlayer.shared.prepareToPlay()
                if ApplicationMusicPlayer.shared.isPreparedToPlay {
                    try await ApplicationMusicPlayer.shared.play()
                    break
                }
            }
        } else {

            // Await prepare
            for time in [0, 1, 1] {
                sleep(UInt32(time))
                if ApplicationMusicPlayer.shared.isPreparedToPlay {
                    try await ApplicationMusicPlayer.shared.play()
                    break
                }
            }
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
