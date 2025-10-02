import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["styled-jsx/babel"],
      },
    }),
  ],
  resolve: {
    alias: [
      { find: "next/dynamic", replacement: fileURLToPath(new URL("./src/next-compat/dynamic.tsx", import.meta.url)) },
      { find: "next/router", replacement: fileURLToPath(new URL("./src/next-compat/router.tsx", import.meta.url)) },
      { find: "next/link", replacement: fileURLToPath(new URL("./src/next-compat/link.tsx", import.meta.url)) },
      { find: "next/image", replacement: fileURLToPath(new URL("./src/next-compat/image.tsx", import.meta.url)) },
      { find: "next/head", replacement: fileURLToPath(new URL("./src/next-compat/head.tsx", import.meta.url)) },
      { find: "next", replacement: fileURLToPath(new URL("./src/next-compat/next.ts", import.meta.url)) },
      { find: "@", replacement: fileURLToPath(new URL("./", import.meta.url)) },
    ],
  },
  define: {
    "process.env": {},
    "process.env.NEXT_PUBLIC_API_URL": "import.meta.env.VITE_API_URL",
    "process.env.NEXT_PUBLIC_API_BASE": "import.meta.env.VITE_API_BASE",
  },
  server: {
    proxy: {
      "/arcgis": {
        target: "https://js.arcgis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/arcgis/, ""),
      },
      "/portal": {
        target: "https://sig.anam.dz",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    exclude: ["@arcgis/core"], // ❌ exclude it, don't include it
  },
  build: {
    target: "esnext",
  },
});
