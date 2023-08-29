import { polyfillNode } from 'esbuild-plugin-polyfill-node'
import type { PolyfillNodeOptions } from 'esbuild-plugin-polyfill-node'
import type { Plugin } from 'vite'
import inject from '@rollup/plugin-inject'
import { handleCircularDependancyWarning } from 'node-stdlib-browser/helpers/rollup/plugin'

/**
 * node polyfill config, {@link https://github.com/cyco130/esbuild-plugin-polyfill-node source}
 */
export type NgmiPolyfillConfig = {
  /**
   * global modules
   * @default {
   *   buffer: false,
   *   global: true,
   *   process: false
   * },
   */
  globals?: PolyfillNodeOptions['globals']
  /**
   * polyfill modules
   */
  polyfills?: PolyfillNodeOptions['polyfills']
}

export function generatePlugin(shim: string | Promise<string>) {
  return ({
    globals = {
      buffer: false,
      global: true,
      process: false,
    },
    polyfills = {},
  }: NgmiPolyfillConfig = {}): Plugin => {
    const PLUGIN_NAME = 'vite-plugin-ngmi-polyfill'
    return {
      name: PLUGIN_NAME,
      async config() {
        const { default: stdLibBrowser } = await import('node-stdlib-browser')
        return {
          resolve: {
            alias: stdLibBrowser,
          },
          build: {
            rollupOptions: {
              onwarn(warn, handler) {
                handleCircularDependancyWarning(warn, handler)
              },
              plugins: [
                {
                  ...inject({
                    global: [await shim, 'global'],
                    process: [await shim, 'process'],
                    Buffer: [await shim, 'Buffer'],
                  }),
                },
              ],
            },
          },
          optimizeDeps: {
            include: ['buffer', 'process'],
            esbuildOptions: {
              plugins: [
                polyfillNode({
                  globals,
                  polyfills,
                }) as any,
              ],
            },
          },
        }
      },
    }
  }
}