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
          "Origin-Trial":
            "Ag9PgT1yKRnLdOr+XPx4NuhYH5aPB/r8nXQC6K4EgaJBeuQUZKYm5pogVqRtWzR39wxo4sbCljOY+T+w5lMGLggAAACBeyJvcmlnaW4iOiJodHRwczovL2NoZXNzLWxheWVycy52ZXJjZWwuYXBwOjQ0MyIsImZlYXR1cmUiOiJVbnJlc3RyaWN0ZWRTaGFyZWRBcnJheUJ1ZmZlciIsImV4cGlyeSI6MTcwOTg1NTk5OSwiaXNTdWJkb21haW4iOnRydWV9",
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
          "Origin-Trial":
            "Ag9PgT1yKRnLdOr+XPx4NuhYH5aPB/r8nXQC6K4EgaJBeuQUZKYm5pogVqRtWzR39wxo4sbCljOY+T+w5lMGLggAAACBeyJvcmlnaW4iOiJodHRwczovL2NoZXNzLWxheWVycy52ZXJjZWwuYXBwOjQ0MyIsImZlYXR1cmUiOiJVbnJlc3RyaWN0ZWRTaGFyZWRBcnJheUJ1ZmZlciIsImV4cGlyeSI6MTcwOTg1NTk5OSwiaXNTdWJkb21haW4iOnRydWV9",
        },
      },
    };
  }
});
