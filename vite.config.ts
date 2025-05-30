import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  // Cargar las variables de entorno
  const env = loadEnv('', process.cwd(), 'VITE_');

  return {
    plugins: [react()],
    server: {
      watch: {
        usePolling: true,
      },
      host: true, // Necesario para el mapeo de puertos en Docker
      strictPort: true,
      port: Number(env.VITE_PORT) || 3000,  // Usa la variable de entorno o el valor por defecto 3000
    }
  };
});