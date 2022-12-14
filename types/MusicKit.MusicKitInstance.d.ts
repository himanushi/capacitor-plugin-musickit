declare namespace MusicKit {

  /**
   * This object provides access to a player instance, and through the player
   * instance, access to control playback.
   */
  interface MusicKitInstance extends Player {

    /**
     * Add an event listener for a MusicKit instance by name.
     *
     * @param name The name of the event.
     * @param callback The callback function to invoke when the event occurs.
     */
    addEventListener<T extends keyof Events>(
      name: T,
      callback: (event: Events[T]) => any
    ): void;

    /**
     * No description available.
     */
    addToLibrary(id: any, type: any): Promise<any>;

    /**
     * An instance of the MusicKit API.
     */
    readonly api: API;

    /**
     * Returns a promise containing a music user token when a user has
     * authenticated and authorized the app.
     */
    authorize(): Promise<string>;

    /**
     * An instance of the MusicKit API.
     */
    readonly bitrate: PlaybackBitrate;

    clearQueue(): Promise<void>;

    /**
     * The developer token to identify yourself as a trusted developer and
     * member of the Apple Developer Program.
     */
    readonly developerToken: string;

    /**
     *
     */
    hasMusicSubscription(): Promise<boolean>;

    /**
     * A Boolean value indicating whether the user has authenticated and
     * authorized the application for use.
     */
    readonly isAuthorized: boolean;

    /**
     * A user token used to access personalized Apple Music content.
     */
    readonly musicUserToken: string;

    /**
     * The current playback state of the music player.
     */
    readonly playbackState: PlaybackStates;

    /**
     * A Boolean value that indicates if a playback target is available.
     */
    readonly playbackTargetAvailable: boolean;

    /**
     * Removes an event listener for a MusicKit instance by name.
     *
     * @param name The name of the event.
     * @param callback The callback function to remove.
     */
    removeEventListener(name: string, callback?: () => any): void;

    /**
     * Sets a music player's playback queue using queue options.
     *
     * @param options The option used to set the playback queue.
     */
    setQueue(options: SetQueueOptions): Promise<Queue>;

    /**
     * The current storefront for the configured MusicKit instance.
     */
    readonly storefrontId: string;

    /**
     * Unauthorizes the app for the current user.
     */
    unauthorize(): Promise<any>;
  }
}
