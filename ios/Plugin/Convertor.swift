import MediaPlayer
import MusicKit

@available(iOS 16.0, *)
class Convertor {
    static let baseUrl = "https://api.music.apple.com"

    static func getDataRequestJSON(_ url: String) async -> [String: Any] {
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

    static func isPlayable(_ song: Song) -> Bool {
        do {
            let data = try JSONEncoder().encode(song.playParameters)
            let playParameters = try JSONSerialization.jsonObject(with: data, options: [])
            print(playParameters)
            return true
        } catch {
            return false
        }
    }

    static func formatISOString(_ optDate: Date?) -> String? {
        guard let date = optDate else {
            return nil
        }
        return ISO8601DateFormatter().string(from: date)
    }

    static func toMediaItem(
        item: MusicKit.MusicPlayer.Queue.Entry.Item?,
        artworkUrl optArtworkUrl: String? = nil,
        size optSize: Int? = nil
    ) async -> [String: Any?]? {
        switch item {
        case let .song(song):
            return await toMediaItem(item: song, artworkUrl: optArtworkUrl, size: optSize)
        default: return nil
        }
    }

    static func toMediaItem(
        item optSong: Song?,
        artworkUrl optArtworkUrl: String? = nil,
        size optSize: Int? = nil,
        isPlayable: Bool = true
    ) async -> [String: Any?]? {
        guard let song = optSong else {
            return nil
        }

        var artworkUrl: String? = optArtworkUrl
        if let size = optSize {
            artworkUrl = await toBase64Image(song.artwork, size)
        }

        let duration = Double(song.duration ?? 0) * 1000
        var playbackDuration = 0.0
        if isPlayable {
            playbackDuration = duration
        } else {
            playbackDuration = duration > 30000 ? 30000 : duration
        }

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
            "playbackDuration": playbackDuration,
            "playlistArtworkURL": artworkUrl,
            "playlistName": song.albumTitle,
            "previewURL": song.previewAssets?.first?.url?.absoluteString,
            "releaseDate": formatISOString(song.releaseDate),
            "title": song.title,
            "trackNumber": song.trackNumber,
            "type": "songs",
        ]
    }

    static func toBase64Image(_ artwork: MPMediaItemArtwork?, _ size: Int) -> String? {
        if let artworkItem = artwork {
            let image = artworkItem.image(at: CGSize(width: size, height: size))
            if let data = image?.jpegData(compressionQuality: 0.1) {
                return data.base64EncodedString()
            }
        }
        return nil
    }

    static func toBase64Image(_ artwork: Artwork?, _ size: Int) async -> String? {
        let image = await toImage(artwork, size)
        if let imageData = image?.jpegData(compressionQuality: 0.1) {
            return imageData.base64EncodedString()
        }

        return nil
    }

    static func toMPMediaItemArtwork(_ artwork: Artwork?, _ size: Int) async -> MPMediaItemArtwork?
    {
        let image = await toImage(artwork, size)
        if let imageData = image {
            return MPMediaItemArtwork(
                boundsSize: CGSize(width: size, height: size),
                requestHandler: { _ in
                    return imageData
                })
        }
        return nil
    }

    static func toImage(_ artwork: Artwork?, _ size: Int) async -> UIImage? {
        do {
            guard let url = artwork?.url(width: size, height: size) else {
                return nil
            }

            let imageRequest = URLRequest(url: url)
            let (data, _) = try await URLSession.shared.data(for: imageRequest)
            guard let image = UIImage(data: data) else {
                return nil
            }
            return image
        } catch {
            return nil
        }
    }
}
