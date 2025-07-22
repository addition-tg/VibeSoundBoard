
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // IMPORTANT: Change this to the name of your GitHub repository.
  base: '/VibeSoundBoard/',
  plugins: [react()],
})
