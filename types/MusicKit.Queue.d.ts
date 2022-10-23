declare namespace MusicKit {

  /**
   * An array of media items to be played.
   */
  interface Queue {

    /**
     * Add an event listener for a MusicKit queue by name.
     *
     * @param name The name of the event.
     * @param callback The callback function to remove.
     */
    addEventListener(name: string, callback: () => any): void;

    /**
     * Inserts the media items defined by the queue descriptor after the last
     * media item in the current queue.
     */
    append(descriptor: Descriptor): void;
    readonly currentItem: MediaItem;

    /**
     * Returns the index in the playback queue for a media item descriptor.
     *
     * @param descriptor A descriptor can be an instance of the MusicKit.MediaItem
     * class, or a string identifier.
     */
    indexForItem(descriptor: Descriptor): number;

    /**
     * A Boolean value indicating whether the queue has no items.
     */
    readonly isEmpty: boolean;

    /**
     * Returns the media item located in the indicated array index.
     */
    item(index: number): MediaItem | null | undefined;

    /**
     * An array of all the media items in the queue.
     */
    readonly items: MediaItem[];

    /**
     * The number of items in the queue.
     */
    readonly length: number;

    /**
     * The next playable media item in the queue.
     */
    readonly nextPlayableItem?: MediaItem | undefined;

    /**
     * The current queue position.
     */
    readonly position: number;

    /**
     * Inserts the media items defined by the queue descriptor into the current
     * queue immediately after the currently playing media item.
     */
    prepend(descriptor: any): void;

    /**
     * The previous playable media item in the queue.
     */
    readonly previousPlayableItem?: MediaItem | undefined;

    /**
     * Removes an event listener for a MusicKit queue by name.
     *
     * @param name The name of the event.
     * @param callback The callback function to remove.
     */
    removeEventListener(name: string, callback: () => any): void;
  }
}
