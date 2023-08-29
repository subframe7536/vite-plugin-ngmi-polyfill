import { createRequire } from 'node:module'
import { generatePlugin } from './plugin'

const require = createRequire(import.meta.url)
const esbuildShim = require.resolve('node-stdlib-browser/helpers/esbuild/shim')

export const NgmiPolyfill = generatePlugin(esbuildShim)
export type { NgmiPolyfillOption as NgmiPolyfillConfig } from './plugin'