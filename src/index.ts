import RollupPluginNodePolyfill from 'rollup-plugin-polyfill-node'
import type { NodePolyfillsOptions } from 'rollup-plugin-polyfill-node'
import { polyfillNode } from 'esbuild-plugin-polyfill-node'
import type { PolyfillNodeOptions } from 'esbuild-plugin-polyfill-node'
import type { Plugin } from 'vite'

export const PLUGIN_NAME = 'vite-plugin-ngmi-polyfill'

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
  /**
   * transformed files
   */
  files?: NodePolyfillsOptions
}

export function NgmiPolyfill({
  globals = {
    buffer: false,
    global: true,
    process: false,
  },
  polyfills = {},
  files = {},
}: NgmiPolyfillConfig = {}): Plugin {
  return {
    name: PLUGIN_NAME,
    config: () => ({
      build: {
        rollupOptions: {
          plugins: [RollupPluginNodePolyfill(files) as any],
        },
      },
      optimizeDeps: {
        esbuildOptions: {
          plugins: [
            polyfillNode({
              globals,
              polyfills,
            }) as any,
          ],
        },
      },
    }),
  }
}
