declare namespace MusicKit {

  /**
   * The playback states of the music player.
   */
  // eslint-disable-next-line no-shadow
  enum PlaybackStates {
    none,
    loading,
    playing,
    paused,
    stopped,
    ended,
    seeking,
    waiting,
    stalled,
    completed,
  }

  /**
   * The playback bit rate of the music player.
   */
  // eslint-disable-next-line no-shadow
  enum PlaybackBitrate {
    HIGH = 256,
    STANDARD = 64,
  }

  type PlayerRepeatMode = 0 | 1 | 2;
  type PlayerShuffleMode = 0 | 1;
  type MediaItemPosition = number;

  /**
   * A media player that represents the media player for a MusicKit instance.
   */
  interface Player {

    /**
     * Adds an event listener as a callback for an event name.
     *
     * @param name The name of the event.
     * @param callback The callback function to invoke when the event occurs.
     */
    addEventListener(name: string, callback: () => any): void;

    /**
     * The current bit rate of the music player.
     */
    readonly bitrate: number;

    /**
     * Begins playing the media item at the specified index in the queue immediately.
     *
     * @param The queue index to begin playing media.
     */
    changeToMediaAtIndex(index: number): Promise<MediaItemPosition>;

    /**
     * Begins playing the media item in the queue immediately.
     *
     * @param descriptor descriptor can be a MusicKit.MediaItem instance or a
     * string identifier.
     */
    changeToMediaItem(descriptor: Descriptor): Promise<MediaItemPosition>;

    /**
     * The current playback duration.
     */
    readonly currentPlaybackDuration: number;

    /**
     * The current playback progress.
     */
    readonly currentPlaybackProgress: number;

    /**
     * The current position of the playhead.
     */
    readonly currentPlaybackTime: number;

    /**
     * No description available.
     */
    readonly currentPlaybackTimeRemaining: number;

    /**
     * A Boolean value indicating whether the player is currently playing.
     */
    readonly isPlaying: boolean;

    /**
     * Sets the volume to 0.
     */
    mute(): void;

    /**
     * The index of the now playing item in the current playback queue.
     */
    readonly nowPlayingItemIndex: number;

    /**
     * Pauses playback of the current item.
     */
    pause(): void;

    /**
     * Initiates playback of the current item.
     */
    play(): Promise<MediaItemPosition>;

    /**
     * No description available.
     */
    playLater(options: SetQueueOptions): Promise<void>;

    /**
     * No description available.
     */
    playNext(options: SetQueueOptions): Promise<void>;

    /**
     * The current playback rate for the player.
     */
    readonly playbackRate: number;

    /**
     * The current playback state of the music player.
     */
    readonly playbackState: PlaybackStates;

    /**
     * A Boolean value that indicates whether a playback target is available.
     */
    readonly playbackTargetAvailable?: boolean | undefined;

    /**
     * Prepares a music player for playback.
     *
     * @param descriptor descriptor can be a MusicKit.MediaItem instance or a
     * string identifier.
     */
    prepareToPlay(descriptor: Descriptor): Promise<void>;

    /**
     * The current playback queue of the music player.
     */
    readonly queue: Queue;

    /**
     * No description available.
     *
     * @param name The name of the event.
     * @param callback The callback function to remove.
     */
    removeEventListener(name: string, callback: () => any): void;

    /**
     * The current repeat mode of the music player.
     */
    repeatMode: PlayerRepeatMode;

    /**
     * Sets the playback point to a specified time.
     *
     * @param time The time to set as the playback point.
     */
    seekToTime(time: number): Promise<void>;

    /**
     * Displays the playback target picker if a playback target is available.
     */
    showPlaybackTargetPicker(): void;

    /**
     * The current shuffle mode of the music player.
     */
    shuffleMode: PlayerShuffleMode;

    /**
     * Starts playback of the next media item in the playback queue.
     */
    skipToNextItem(): Promise<MediaItemPosition>;

    /**
     * Starts playback of the previous media item in the playback queue.
     */
    skipToPreviousItem(): Promise<MediaItemPosition>;

    /**
     * Stops the currently playing media item.
     */
    stop(): void;

    /**
     * A number indicating the current volume of the music player.
     */
    volume: number;
  }
}
