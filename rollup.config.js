import copy from 'rollup-plugin-copy';

export default {
  input: 'dist/esm/index.js',
  output: [
    {
      file: 'dist/plugin.js',
      format: 'iife',
      name: 'capacitorCapacitorMusicKit',
      globals: {
        '@capacitor/core': 'capacitorExports',
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/plugin.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  plugins: [
    copy({
      targets: [{ src: 'src/@types/**/*', dest: 'dist/@types' }],
    }),
  ],
  external: ['@capacitor/core'],
};
