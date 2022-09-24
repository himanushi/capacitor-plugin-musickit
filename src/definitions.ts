export interface CapacitorMusicKitPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  configure(options: { config: MusicKit.Config }): Promise<{ result: boolean }>;
  isAuthorized(): Promise<{ result: boolean }>;
  hasMusicSubscription(): Promise<{ result: boolean }>;
  authorize(): Promise<void>;
  unauthorize():  Promise<void>;
}
