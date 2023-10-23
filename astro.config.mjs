import { defineConfig } from "astro/config"
import react from "@astrojs/react"

import tailwind from "@astrojs/tailwind"

// https://astro.build/config
export default defineConfig({
<<<<<<< HEAD
  //  output: "hybrid",
  integrations: [react(), tailwind()],
})
=======
  integrations: [react(), tailwind()]
});
>>>>>>> parent of 031190c (dynamic rendering with id and changes in test ui)
