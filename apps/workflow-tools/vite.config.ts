import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base './' agar hasil build (dist/) bisa disajikan dari path apa pun,
// termasuk GitHub Pages di /workflow-tools/ maupun /workflow-tools/demo-hub/.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
