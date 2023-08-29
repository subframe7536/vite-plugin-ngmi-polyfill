import type { Plugin } from 'vite'
import inject from '@rollup/plugin-inject'
import { handleCircularDependancyWarning } from 'node-stdlib-browser/helpers/rollup/plugin'
import esbuildPlugin from 'node-stdlib-browser/helpers/esbuild/plugin'
import type { PackageNames } from 'node-stdlib-browser'

type GlobalNames = 'process' | 'global' | 'Buffer'
/**
 * node polyfill config
 */
export type NgmiPolyfillOption = {
  /**
   * global modules, enable all if absent
   */
  globals?: Partial<Record<GlobalNames, boolean>>
  /**
   * polyfill modules, enable all if absent
   */
  polyfills?: Partial<Record<PackageNames, boolean>>
}
async function getStdLib(polyfills: Partial<Record<PackageNames, boolean>>) {
  const { default: stdLibBrowser } = await import('node-stdlib-browser')
  let lib = {}
  if (polyfills) {
    for (const [name, enable] of Object.entries(polyfills)) {
      const moduleName = `node:${name}`
      if (enable && stdLibBrowser[moduleName]) {
        lib[moduleName] = stdLibBrowser[moduleName]
      }
    }
  } else {
    lib = stdLibBrowser
  }
  return lib
}
export function generatePlugin(shim: string | Promise<string>) {
  return ({
    globals = {
      Buffer: true,
      global: true,
      process: true,
    },
    polyfills,
  }: NgmiPolyfillOption = {}): Plugin => {
    const PLUGIN_NAME = 'vite-plugin-ngmi-polyfill'
    return {
      name: PLUGIN_NAME,
      async config() {
        const lib = await getStdLib(polyfills)
        return {
          resolve: {
            alias: lib,
          },
          build: {
            rollupOptions: {
              onwarn(warn, handler) {
                handleCircularDependancyWarning(warn, handler)
              },
              plugins: [
                {
                  ...inject({
                    ...globals.global ? { global: [await shim, 'global'] } : {},
                    ...globals.process ? { process: [await shim, 'process'] } : {},
                    ...globals.Buffer ? { Buffer: [await shim, 'Buffer'] } : {},
                  }),
                },
              ],
            },
          },
          optimizeDeps: {
            include: ['buffer', 'process'],
            esbuildOptions: {
              inject: [await shim],
              define: {
                ...globals.global ? { global: 'global' } : {},
                ...globals.process ? { process: 'process' } : {},
                ...globals.Buffer ? { Buffer: 'Buffer' } : {},
              },
              plugins: [
                esbuildPlugin(lib),
              ],
            },
          },
        }
      },
    }
  }
}
