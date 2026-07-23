import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('plotly')) return 'plotly';
          if (id.includes('ag-grid')) return 'aggrid';
          if (id.includes('jspdf')) return 'pdf';
          if (id.includes('xlsx')) return 'xlsx';
        },
      },
    },
  },
})
