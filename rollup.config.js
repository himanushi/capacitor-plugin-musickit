export default {
  external: ["@capacitor/core"],
  input: "dist/index.js",
  output: [
    {
      file: "dist/plugin.js",
      format: "iife",
      inlineDynamicImports: true,
      name: "capacitorCapacitorMusicKit",
      sourcemap: true,
    },
  ],
};
