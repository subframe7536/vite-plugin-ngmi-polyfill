import { defineConfig } from 'tsup'

export default defineConfig([
  {
    clean: true,
    dts: true,
    entry: { index: './src/cjs.ts' },
    format: ['cjs'],
  },
  {
    dts: true,
    entry: { index: './src/esm.ts' },
    format: ['esm'],
  },
])
