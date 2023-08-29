# vite-plugin-ngmi-polyfill

Vite plugin for polyfilling Node.js built-in globals and modules ⚡️

using [`node-stdlib-browser`](https://github.com/niksy/node-stdlib-browser)

## Installing

```sh
npm install vite @subframe7536/vite-plugin-ngmi-polyfill
```

```sh
yarn add vite @subframe7536/vite-plugin-ngmi-polyfill
```

```sh
pnpm add vite @subframe7536/vite-plugin-ngmi-polyfill
```

## Usage

```ts
import { defineConfig } from 'vite'
import { NgmiPolyfill } from '@subframe7536/vite-plugin-ngmi-polyfill'

export default defineConfig({
  plugins: [NgmiPolyfill({
    /* options */
  })],
})
```

### Options

```ts
type GlobalNames = 'process' | 'global' | 'Buffer'
/**
 * node polyfill config
 */
export type NgmiPolyfillOptions = {
  /**
   * global modules, enable all if absent
   */
  globals?: Partial<Record<GlobalNames, boolean>>
  /**
   * polyfill modules, enable all if absent
   */
  polyfills?: Partial<Record<PackageNames, boolean>>
}
```

## Examples

[`playground/`](./playground)

## License

[MIT License, Copyright (c) 2023 subframe7536](./LICENSE)
