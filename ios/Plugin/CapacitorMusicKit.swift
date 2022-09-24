import Foundation

@objc public class CapacitorMusicKit: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
