import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@noble/hashes/sha256': '../node_modules/@noble/hashes/src/sha256.ts',
      '@noble/hashes/sha3': '../node_modules/@noble/hashes/src/sha3.ts',
      '@noble/hashes/ripemd160':
        '../node_modules/@noble/hashes/src/ripemd160.ts',
      '@noble/hashes/sha512': '../node_modules/@noble/hashes/src/sha512.ts',
      '@noble/hashes/pbkdf2': '../node_modules/@noble/hashes/src/pbkdf2.ts',
      '@noble/hashes/utils': '../node_modules/@noble/hashes/src/utils.ts',
      '@noble/hashes/crypto': '../node_modules/@noble/hashes/src/crypto.ts',
    },
  },
});
