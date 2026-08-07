import { defineConfig } from 'vite'
// @ts-ignore: plugin may not have type declarations in this environment
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/thesis-project/',
})