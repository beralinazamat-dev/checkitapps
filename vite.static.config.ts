// Static SPA build config for Cloudflare Pages "Upload static files".
// This bypasses tanstack-start (which produces a server bundle) and outputs
// a plain client-side React app.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  root: path.resolve(__dirname, ".static-export"),
  publicDir: path.resolve(__dirname, "public"),
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  plugins: [
    tailwindcss(),
    react(),
    tsconfigPaths({ root: __dirname }),
  ],
  build: {
    outDir: path.resolve(__dirname, "dist-static"),
    emptyOutDir: true,
    target: "es2020",
    rollupOptions: {
      input: path.resolve(__dirname, ".static-export/index.html"),
    },
  },
});