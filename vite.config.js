import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'demo'),
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    jsxFactory: 'createElement', 
  },
});