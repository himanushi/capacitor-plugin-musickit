export default {
  external: ["@capacitor/core"],
  input: "dist/index.js",
  output: [
    {
      file: "dist/plugin.js",
      format: "iife",
      globals: {
        "@capacitor/core": "capacitorExports",
      },
      inlineDynamicImports: true,
      name: "capacitorCapacitorMusicKit",
      sourcemap: true,
    },
  ],
};
