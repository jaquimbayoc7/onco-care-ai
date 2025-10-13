import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://oncoapp-239j.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/patients-api': {
        target: 'https://patientoncoassist.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/patients-api/, ''),
      },
      '/model-api': {
        target: 'https://oncoai-4rec.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/model-api/, ''),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
