# Issues
## no-ssr does not work
no-ssr does not work with this approatch to launch dev-server in advance in dev-server.mjs.
I ran into the following error when I tried.

```
17:34:10.776 › (node:86808) UnhandledPromiseRejectionWarning: Error: protocol.registerSchemesAsPrivileged should be called before app is ready
    at electronServe (file:///Users/tomotaka/.ghq/github.com/tmtk75/electron-with-vite-remix/node_modules/.pnpm/electron-serve@2.1.1/node_modules/electron-serve/index.js:62:20)
    at configProto (file:///Users/tomotaka/.ghq/github.com/tmtk75/electron-with-vite-remix/out/main/index.mjs:14312:15)
    at file:///Users/tomotaka/.ghq/github.com/tmtk75/electron-with-vite-remix/out/main/index.mjs:14318:32
    at ModuleJob.run (node:internal/modules/esm/module_job:234:25)
    at ModuleLoader.import (node:internal/modules/esm/loader:473:24)
```

I tried this approach in order to get rid of vite from the production build, but it seems to be very hard to use this approach with no-ssr.

