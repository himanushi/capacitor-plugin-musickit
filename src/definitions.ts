export interface CapacitorMusicKitPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
