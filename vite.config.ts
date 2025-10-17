import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    host: true,  // écoute toutes les interfaces
    port: 5173,  // port du dev server
    hmr: {
      host: 'unspeakable-agonizingly-zachery.ngrok-free.dev', // ton URL publique Cloudflare
      protocol: 'wss'
      
    },
    
  },

})



