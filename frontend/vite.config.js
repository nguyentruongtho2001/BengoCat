import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        '@pixi/core',
        '@pixi/display',
        '@pixi/interaction',
        '@pixi/math',
        '@pixi/runner',
        '@pixi/graphics',
      ],
    },
  },
});