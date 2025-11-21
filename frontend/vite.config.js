import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // đảm bảo đường dẫn tương đối khi build
  build: {
    outDir: '../backend/frontend', // nơi Wails sẽ lấy giao diện
    emptyOutDir: true              // xoá sạch trước khi build mới
  },
});