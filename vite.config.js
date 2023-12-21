import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === "serve") {
    return {
      // Dev config
      plugins: [
        react(),
        svgr({
          svgrOptions: {
            // svgr options
          },
        }),
      ],
      server: {
        host: "0.0.0.0",
        port: 9000,
        headers: {
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Embedder-Policy": "require-corp",
        },
      },
    };
  } else {
    // command === build
    return {
      build: {
        outDir: "build",
      },
      // prod config
      plugins: [
        react(),
        svgr({
          svgrOptions: {
            // svgr options
          },
        }),
      ],
      server: {
        host: "0.0.0.0",
        port: 80,
        headers: {
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Embedder-Policy": "require-corp",
        },
      },
    };
  }
});
