import Capacitor
import Foundation
import MediaPlayer
import MusicKit

@available(iOS 16.0, *)
@objc public class PreviewPlayer: NSObject {
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
            let artworkUrl = await Convertor.toBase64Image(song.artwork, sSize)
            songs.append(
                await Convertor.toMediaItem(item: song, artworkUrl: artworkUrl, isPlayable: false))
            count += 1
        }
        return songs.compactMap { $0 }
    }

    func currentSong() async -> [String: Any?]? {
        return await Convertor.toMediaItem(
            item: preQueueSongs[currentIndex], size: lSize, isPlayable: false)
    }

    @objc func getCurrentIndex() -> Int {
        return currentIndex
    }
    
    @objc func getCurrentPlaybackTime() -> Double {
        if let player = previewPlayer {
            return Double(CMTimeGetSeconds(player.currentTime()))
        }
        return 0.0
    }
    
    @objc func getCurrentPlaybackDuration() -> Double {
        if let player = previewPlayer {
            return Double(CMTimeGetSeconds(player.currentItem?.duration))
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

    public override func observeValue(
        forKeyPath keyPath: String?,
        of object: Any?,
        change: [NSKeyValueChangeKey: Any]?,
        context: UnsafeMutableRawPointer?
    ) {
        if keyPath == "rate", let player = object as? AVPlayer, let item = player.currentItem {
            MPNowPlayingInfoCenter.default().nowPlayingInfo?[MPNowPlayingInfoPropertyElapsedPlaybackTime] = player.currentTime().seconds
            if player.rate == 1 {
                MPNowPlayingInfoCenter.default().playbackState = .playing
                notifyListeners!("playbackStateDidChange", ["state": "playing"])
            } else {
                MPNowPlayingInfoCenter.default().playbackState = .paused
                notifyListeners!("playbackStateDidChange", ["state": "paused"])
            }
        }
        if keyPath == "currentItem" {
            guard change?[NSKeyValueChangeKey.newKey] is AVPlayerItem else {
                Task {
                    try await setQueue(preQueueSongs)
                    if getRepeatMode() == "all" {
                        try await play(nil)
                    } else {
                        seekToTime(0.0)
                        notifyListeners!("playbackStateDidChange", ["state": "paused"])
                    }
                }
                return
            }
            if change?[NSKeyValueChangeKey.oldKey] != nil {
                currentIndex = currentIndex + 1
            }
            Task {
                await setNowPlayingInfo()
                notifyListeners!(
                    "nowPlayingItemDidChange",
                    ["item": await currentSong() as Any, "index": currentIndex])
            }
        }
    }

    func setQueue(_ songs: [Song], _ index: Int = 0) async throws {
        previewPlayer = nil

        guard songs.count > 0 else {
            return
        }

        currentIndex = index
        preQueueSongs = songs
        let urls = songs.dropFirst(index).map { $0.previewAssets?.first?.url }.compactMap { $0 }

        guard urls.count > 0 else {
            return
        }

        let playerItems = urls.map { AVPlayerItem(url: $0) }
        previewPlayer = AVQueuePlayer(items: playerItems)
        previewPlayer!.addObserver(
            self, forKeyPath: "currentItem", options: [.initial, .new, .old], context: nil)
        previewPlayer!.addObserver(
            self, forKeyPath: "rate", options: [.initial, .new, .old], context: nil)
    }

    func setNowPlayingInfo() async {
        let song = preQueueSongs[currentIndex]
        var nowPlayingInfo = [String: Any]()
        let duration = song.duration ?? 0.0
        nowPlayingInfo[MPMediaItemPropertyTitle] = song.title
        nowPlayingInfo[MPMediaItemPropertyAlbumTitle] = song.albumTitle
        nowPlayingInfo[MPMediaItemPropertyArtist] = song.artistName
        nowPlayingInfo[MPMediaItemPropertyArtwork] = await Convertor.toMPMediaItemArtwork(
            song.artwork, lSize)
        nowPlayingInfo[MPMediaItemPropertyPlaybackDuration] = duration > 30 ? 30 : duration
        nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = 0.0
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
    }

    @objc func playOrPause() async throws {
        if let pPlayer = previewPlayer {
            if await pPlayer.rate == 1 {
                await pPlayer.pause()
            } else {
                await pPlayer.play()
            }
            return
        }
    }

    func play(_ optIndex: Int?) async throws {
        if let index = optIndex {
            try await setQueue(preQueueSongs, index)
        }
        if let pPlayer = previewPlayer {
            await pPlayer.play()
        } else {
            notifyListeners!("playbackStateDidChange", ["state": "completed"])
        }
        return
    }

    @objc func pause() {
        if let pPlayer = previewPlayer {
            pPlayer.pause()
        }
    }

    @objc func stop() {
        if let pPlayer = previewPlayer {
            pPlayer.pause()
        }
    }

    @objc func nextPlay() async throws {
        if let pPlayer = previewPlayer {
            pPlayer.advanceToNextItem()
            notifyListeners!(
                "nowPlayingItemDidChange",
                ["item": await currentSong() as Any, "index": currentIndex])
        }
    }

    @objc func previousPlay() async throws {
        if currentIndex > 0 {
            try await setQueue(preQueueSongs, currentIndex - 1)
            try await play(nil)
            notifyListeners!(
                "nowPlayingItemDidChange",
                ["item": await currentSong() as Any, "index": currentIndex])
        } else {
            try await setQueue(preQueueSongs, 0)
            stop()
            notifyListeners!(
                "nowPlayingItemDidChange",
                ["item": await currentSong() as Any, "index": currentIndex])
        }
    }

    @objc func seekToTime(_ playbackTime: Double) {
        if let pPlayer = previewPlayer {
            let cmTime = CMTimeMakeWithSeconds(
                playbackTime, preferredTimescale: Int32(NSEC_PER_SEC))
            pPlayer.seek(to: cmTime, toleranceBefore: CMTime.zero, toleranceAfter: CMTime.zero)
        }
    }
}
