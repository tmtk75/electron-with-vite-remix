>[!NOTE]
> The repository name ends with remix but this now supports react-router v7
> by https://github.com/tmtk75/electron-with-vite-remix/pull/2

# README
A boilerplate for Electron + Vite + React Router v7 (framework mode).
You can use electron API through TRPC.

SSR version is on the [main branch](https://github.com/tmtk75/electron-with-vite-remix/).


## Getting Started
You'll see a window by electron if you run the following commands.
```
$ pnpm install
$ pnpm dev:main
```


## Variations
There are some variations of this boilerplate.
* [shadcn/ui.sidebar-09](https://github.com/tmtk75/electron-with-vite-remix/tree/shadcn/ui.sidebar-09): [shadcn/ui sidebar-09](https://ui.shadcn.com/blocks/sidebar) is installed with react-router v7.
* [shadcn/ui.sidebar-10](https://github.com/tmtk75/electron-with-vite-remix/tree/shadcn/ui.sidebar-10): [shadcn/ui sidebar-10](https://ui.shadcn.com/blocks/sidebar) is installed with react-router v7.
* [shadcn/ui.sidebar-15.no-ssr](https://github.com/tmtk75/electron-with-vite-remix/tree/shadcn/ui.sidebar-15.no-ssr): [shadcn/ui sidebar-15](https://ui.shadcn.com/blocks/sidebar) is installed with react-router v7.



## Development
There are three script tasks for development.
* `dev:renderer`
* `dev:main`
* `build:unpack`

From top to bottom, these tasks are intended for developing the renderer process, developing the main process, and checking the app behavior after building, respectively.

&nbsp; | `dev:renderer` | `dev:main` | `build:unpack`
--- | --- | --- | ---
purpose | develop renderer process | develop main process | check built app
electron | available | available | available
NODE_ENV | development | development | production
interface | browser | electron window  | electron window

### `dev:renderer`
This task is intended for developing the renderer process.

`dev:renderer` launches the vite-dev-server inside Electron. A URL will be displayed, which you can open in your browser. Its purpose is similar to `remix vite:dev`.
```
$ pnpm dev:renderer
...
  ➜  Local:   http://localhost:5173/
```


### `dev:main`
This task is intended for developing the main process.

`dev:main` builds the main and preload processes and launches them in Electron. The generated files are output to `./out`.

Like `dev:renderer`, it also starts the vite-dev-server.

* main process : `out/main/index.mjs`
* renderer process : `out/preload/index.cjs`
* renderer process : `http://localhost:5173/`

Changes under `src/renderer/**` will trigger HMR and reload automatically.

Changes under `src/{main,preload}/**` will not be reflected immediately. To apply changes, run `build:main` or `build:preload`. This will restart Electron, and the changes will take effect.


### `build:unpack`
This task is intended for checking the app behavior after building.

build:unpack uses electron-builder to output the app in an unpacked format to ./dist. Launch the app for each specific OS.

For example, on macOS, it generates an executable as follows:
```
dist/mac-${arch}/${app_name}.app/Contents/MacOS/${app_name}
```


## TODO
* [x] build tool investigation
   - https://zenn.dev/righttouch/articles/86457bf2908379
   - https://zenn.dev/ssssota/articles/e59cf5adaf97ce#rspack
* [x] quick start : https://www.electronjs.org/docs/latest/tutorial/quick-start
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
* [x] support .env, .env.local, .env.development, ...
  - [x] dev:renderer
  - [x] dev:main
  - [x] build:unpack
* [x] react-router v7
  - [x] dev-server works.
  - [x] vte:build works.
  - [x] build:unpack works.
  - [x] SPA with TRPC.
  - [x] SSR
    * [x] vite-dev-server works.
    * ~~[x] assets served by express.~~ worked but deleted.
    * [x] assets served by electron.
* [x] dev/build variation
  - [x] dev:renderer -- to develop UI mainly with vite-dev-server.
  - [x] dev:main -- to develop main process mainly with vite-dev-server.
  - [x] build:unpack -- to build unpacked app.
* [x] logging with electron-log.
* [x] navigation history by pressing back/forward accelerators.
* [x] typecheck
* [x] environment variables, APP_PATH_ROOT and VITE_APP_PATH_ROOT.
* [x] auto update with electron-updater.

