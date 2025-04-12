import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    // https: {
    //   // key: fs.readFileSync('localhost-key.pem'),
    //   // cert: fs.readFileSync('localhost.pem'),
    //   key: fs.readFileSync("192.168.1.17-key.pem"),
    //   cert: fs.readFileSync("192.168.1.17.pem"),
    // },
    port: 8080
  }
})
