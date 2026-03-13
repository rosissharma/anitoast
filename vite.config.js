import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'anitoast',
      fileName: 'anitoast',
    },
    rollupOptions: {
      external: [],
      output: {
        exports: "named",
      },
    },
  },
});
