import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Robustly define process.env.API_KEY. 
      // Vercel/Vite replaces this string literal with the actual value at build time.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || ''),
      
      // Polyfill process.env to prevent "process is not defined" crashes in 3rd party libs
      'process.env': JSON.stringify({}), 
    },
    build: {
      outDir: 'dist',
      sourcemap: false, // Disable sourcemaps in production for security/performance
    }
  };
});