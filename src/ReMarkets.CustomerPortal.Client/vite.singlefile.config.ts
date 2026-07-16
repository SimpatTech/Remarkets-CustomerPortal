import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Demo build: bundles the entire prototype (JS, CSS, fonts) into ONE
 * self-contained dist/index.html that runs from a double-click — no server,
 * no repo checkout. Pairs with VITE_SINGLE_FILE=1, which switches the router
 * to hash-based URLs (file:// cannot serve /home-style paths).
 *
 *   npm run build:demo
 */
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  // Set here (not via shell env) so the build works the same on any OS.
  define: { 'import.meta.env.VITE_SINGLE_FILE': JSON.stringify('1') },
  build: {
    // Inline every asset (Inter woff files included) as data URIs.
    assetsInlineLimit: 100_000_000,
    chunkSizeWarningLimit: 100_000_000,
    outDir: 'dist-demo',
  },
});
