# README

## TODO
* [x] Build tool investigation
   - https://zenn.dev/righttouch/articles/86457bf2908379
   - https://zenn.dev/ssssota/articles/e59cf5adaf97ce#rspack
* [x] Quick start : https://www.electronjs.org/docs/latest/tutorial/quick-start
* [x] vite-plugin-node-polyfills : fir for 'Module "node:path" has been externalized for browser compatibility'
* [x] build into ./out
* [x] await import("electron")
* [x] build:unpack
* [x] IPC.
  - [x] main -> renderer
  - [x] renderer -> main
* [x] reload on change.
  - [x] renderer: by vite dev. already.
  - [x] preload: by reload (if code changes).
  - [x] main: by relauching (if code changes).
* [x] use local URL as renderer for development. (RENDERER_URL=http://localhost:3000)
* [x] auto detect listening port.
* [x] save/restore window position and size.
* [ ] rebuild main and preload on change.
* [x] environment variables are available in main with global.process.env.
* [ ] configure electron paths like appData.
* [ ] support .env, .env.local, .env.development, ...
* [x] remix
  - [x] dev-server works.
  - [x] vte:build works.
  - [x] build:unpack works.
  - [x] SPA
  - [ ] SSR?


## Development
```
# Launch vite-dev-server for renderer internally.
[0]$ pnpm dev
```
```
# Launch vite-dev-server for renderer independently.
[0]$ pnpm dev:renderer
[1]$ port=5173         # the port shown in the console above.
[1]$ pnpm build:main && pnpm build:preload && RENDERER_URL=http://localhost:${port} pnpm exec electron .
```
