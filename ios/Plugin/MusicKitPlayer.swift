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
        for song in preQueueSongs {
            let artworkUrl = await Convertor.toBase64Image(song.artwork, sSize)
            songs.append(await Convertor.toMediaItem(item: song, artworkUrl: artworkUrl))
            count += 1
        }
        return songs.compactMap { $0 }
    }

    func currentSong() async -> [String: Any?]? {
        guard preQueueSongs.count > 0 else {
            return nil
        }
        return await Convertor.toMediaItem(
            item: ApplicationMusicPlayer.shared.queue.currentEntry?.item, size: lSize)
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

    @objc func getShuffleMode() -> String {
        var mode = "off"
        if ApplicationMusicPlayer.shared.state.shuffleMode == .songs {
            mode = "songs"
        }
        return mode
    }

    @objc func setShuffleMode(_ call: CAPPluginCall) {
        let mode = call.getString("mode") ?? "none"
        if mode == "off" {
            ApplicationMusicPlayer.shared.state.shuffleMode = .off
        } else if mode == "songs" {
            ApplicationMusicPlayer.shared.state.shuffleMode = .songs
        }
    }

    func setQueue(_ songs: [Song]) async throws {
        preQueueSongs = songs
        ApplicationMusicPlayer.shared.queue = .init(for: songs)
        guard songs.count > 0 else {
            return
        }
        try await ApplicationMusicPlayer.shared.prepareToPlay()
    }

    func play(_ index: Int?) async throws {
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
                do {
                    try await ApplicationMusicPlayer.shared.prepareToPlay()
                } catch {}
                if ApplicationMusicPlayer.shared.isPreparedToPlay {
                    do {
                        try await ApplicationMusicPlayer.shared.play()
                        break
                    } catch {}
                }
            }
        } else {

            // Await prepare
            for time in [0, 1, 1] {
                sleep(UInt32(time))
                if ApplicationMusicPlayer.shared.isPreparedToPlay {
                    do {
                        try await ApplicationMusicPlayer.shared.play()
                        break
                    } catch {}
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

    @objc func seekToTime(_ playbackTime: Double) {
        ApplicationMusicPlayer.shared.playbackTime = playbackTime
    }
}
