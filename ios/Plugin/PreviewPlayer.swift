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
    var observations = [NSKeyValueObservation]()

    let sSize = 200
    let mSize = 400
    let lSize = 600

    func load() {
        //        let commandCenter = MPRemoteCommandCenter.shared()
        //        commandCenter.playCommand.addTarget(self, action: "play")
        //        commandCenter.playCommand.isEnabled = true
        //        commandCenter.pauseCommand.addTarget(self, action: "pause")
        //        commandCenter.pauseCommand.isEnabled = true
        //        commandCenter.skipForwardCommand.addTarget(self, action: "skipForward")
        //        commandCenter.skipForwardCommand.isEnabled = true
        //        commandCenter.skipBackwardCommand.addTarget(self, action: "skipBackward")
        //        commandCenter.skipBackwardCommand.isEnabled = true
    }

    func queueSongs() async -> [[String: Any?]] {
        var songs: [[String: Any?]?] = []
        var count = 0
        for song in preQueueSongs {
            let artworkUrl = await toBase64Image(song.artwork, sSize)
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
        previewPlayer!.observe(
            \.timeControlStatus, options: .new,
            changeHandler: { object, change in
                print("change")
            })
        //        previewPlayer!.observe(\.currentItem, options: [.new]) {
        //                [weak self] (player, _) in
        //                print("media item changed...")
        //            }
        //        previewPlayer!.currentItem?.observe(\.status, options: [.initial,.new]) {
        //            [weak self] (_, _) in
        //            print("status...-----------------")
        //        }
        //        previewPlayer!.publisher(for: \.currentItem).sink { item in
        //            print("changeeeeeeeeeeee")
        //        }
        print("init----------------")
    }

    func initNowPlayingItemDidChange(
        object: AVQueuePlayer, didChangeItem value: NSKeyValueObservedChange<AVPlayerItem?>
    ) {
        Task {
            //            currentIndex = currentIndex + 1
            print("^------------------------^")
            print(preQueueSongs.count)
            print(object.items().count)
            notifyListeners!(
                "nowPlayingItemDidChange",
                ["item": await currentSong() as Any, "index": currentIndex])
        }
    }

    func nowPlayingItemDidChange(
        object: AVQueuePlayer, didChangeItem value: NSKeyValueObservedChange<AVPlayerItem?>
    ) {
        Task {
            currentIndex = currentIndex + 1
            print("^------------------------^")
            print(preQueueSongs.count)
            print(object.items().count)
            notifyListeners!(
                "nowPlayingItemDidChange",
                ["item": await currentSong() as Any, "index": currentIndex])
        }
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
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
    }

    @objc func play(_ call: CAPPluginCall) async throws {
        let optIndex = call.getInt("index")

        if let pPlayer = previewPlayer {
            if let index = optIndex {
                currentIndex = index
            }
            await pPlayer.play()
            await setNowPlayingInfo()
            MPNowPlayingInfoCenter.default().playbackState = .playing
            notifyListeners!("playbackStateDidChange", ["state": "playing"])
            call.resolve(["result": true])
            return
        }
    }

    @objc func pause() {
        if let pPlayer = previewPlayer {
            pPlayer.pause()
            MPNowPlayingInfoCenter.default().playbackState = .paused
            notifyListeners!("playbackStateDidChange", ["state": "paused"])
        }
    }

    @objc func stop() {
        if let pPlayer = previewPlayer {
            pPlayer.pause()
            MPNowPlayingInfoCenter.default().playbackState = .stopped
            notifyListeners!("playbackStateDidChange", ["state": "stopped"])
        }
    }

    @objc func nextPlay() async throws {
        if let pPlayer = previewPlayer {
            currentIndex = currentIndex + 1
            pPlayer.advanceToNextItem()
            notifyListeners!(
                "nowPlayingItemDidChange",
                ["item": await currentSong() as Any, "index": currentIndex])
        }
    }

    @objc func previousPlay() async throws {
        try await ApplicationMusicPlayer.shared.skipToPreviousEntry()
    }

    @objc func seekToTime(_ call: CAPPluginCall) {
        let playbackTime = call.getDouble("time") ?? 0.0
        ApplicationMusicPlayer.shared.playbackTime = playbackTime
    }
}
