import { defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';
import path from "path";
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/__tests__/setup.ts',
      include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}'], // __tests__ 폴더 인식
    },
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@styles": path.resolve(__dirname, "./src/styles"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@": path.resolve(__dirname, "./src"),
      },
    },
  })
);