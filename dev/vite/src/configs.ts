import reactPlugin from '@vitejs/plugin-react';
import type {UserConfig} from 'vite';
import dtsPlugin from 'vite-plugin-dts';
import tsconfigPathsPlugin from 'vite-tsconfig-paths';

//==================================================
// Common config
//==================================================

interface ViteCommonOptions {
  root?: string;
  base?: string;
  publicDir?: string;
  tsconfig?: string;
  plugins?: UserConfig['plugins'];
}

const createViteCommonConfig = ((opts?: ViteCommonOptions): UserConfig => {
  const {
    root = './',
    base = '/',
    publicDir = './public',
    tsconfig = './tsconfig.build.json',
    plugins = []
  } = (opts ?? {});

  return (({
    root: root,
    base: base,
    publicDir: publicDir,
    plugins: [
      tsconfigPathsPlugin({projects: [tsconfig]}),
      ...plugins
    ]
  } as const) satisfies UserConfig);
});

//==================================================
// Library config
//==================================================

interface ViteLibOptions extends ViteCommonOptions {
  entry?: string;
  name?: string;
  formats?: ('es' | 'cjs')[];
  external?: string[];
  dts?: boolean;
  outDir?: string;
}

const createViteLibConfig = ((opts?: ViteLibOptions): UserConfig => {
  const {
    entry = './src/index.ts',
    name = 'lib',
    formats = ['es'],
    external = [],
    dts = true,
    outDir = './dist',
    ...commonOpts
  } = (opts ?? {});

  return (({
    ...createViteCommonConfig({
      ...commonOpts,
      plugins: [
        ...(dts ? [dtsPlugin({rollupTypes: true})] : []),
        ...(commonOpts.plugins ?? [])
      ]
    }),
    build: {
      outDir: outDir,
      sourcemap: 'hidden',
      minify: false,
      lib: {
        entry: entry,
        name: name,
        formats: formats,
        fileName: (format => `${(format === 'es') ? 'esm' : 'cjs'}/${name}.js`)
      },
      rolldownOptions: {
        external: external,
        output: {globals: Object.fromEntries(external.map(dep => [dep, dep.replaceAll(/[^a-zA-Z]/g, '')]))}
      }
    }
  } as const) satisfies UserConfig);
});

//==================================================
// SPA (React, etc.)
//==================================================

interface ViteSPAOptions extends ViteCommonOptions {
  port?: number;
  open?: boolean;
  outDir?: string;
  sourcemap?: NonNullable<UserConfig['build']>['sourcemap'];
  react?: boolean;
  target?: NonNullable<UserConfig['build']>['target'];
}

// eslint-disable-next-line complexity
const createViteSPAConfig = ((opts?: ViteSPAOptions): UserConfig => {
  const {
    port = 5173,
    open = false,
    outDir = './dist',
    sourcemap = true,
    react = false,
    target = 'esnext',
    ...commonOpts
  } = (opts ?? {});

  return (({
    ...createViteCommonConfig({
      ...commonOpts,
      plugins: [
        ...(react ? [reactPlugin()] : []),
        ...(commonOpts.plugins ?? [])
      ]
    }),
    server: {
      port: port,
      open: open,
      strictPort: true
    },
    preview: {
      port: (port + 1),
      strictPort: true
    },
    build: {
      outDir: outDir,
      sourcemap: sourcemap,
      target: target,
      rolldownOptions: {
        output: {
          manualChunks: (react
            ? ((moduleId: string): (string | undefined) => {
                const vendorDeps = ['react', 'react-dom'];
                if(vendorDeps.some(dep => moduleId.includes(`/node_modules/${dep}/`))) {
                  return 'vendor';
                }
                return undefined;
              })
            : undefined)
        }
      }
    }
  } as const) satisfies UserConfig);
});

//==================================================
// SSR / Node server config
//==================================================

interface ViteSSROptions extends ViteCommonOptions {
  entry?: string;
  external?: string[];
  outDir?: string;
}

const createViteSSRConfig = ((opts?: ViteSSROptions): UserConfig => {
  const {
    entry = './src/server.ts',
    external = [],
    outDir = './dist',
    ...commonOpts
  } = (opts ?? {});

  return (({
    ...createViteCommonConfig(commonOpts),
    build: {
      outDir: outDir,
      sourcemap: true,
      ssr: entry,
      target: 'node20',
      rolldownOptions: {external: external}
    }
  } as const) satisfies UserConfig);
});

//==================================================
// Config function
//==================================================

const config = ((
  config: (
    'lib'
    | 'spa'
    | 'ssr'
    | UserConfig
    | (() => (UserConfig | Promise<UserConfig>))
  )
): (UserConfig | Promise<UserConfig>) => {
  // eslint-disable-next-line unicorn/prefer-switch
  if(config === 'lib') {
    return createViteLibConfig();
  } else if(config === 'spa') {
    return createViteSPAConfig();
  } else if(config === 'ssr') {
    return createViteSSRConfig();
  } else if(typeof config === 'function') {
    return config();
  }
  return config;
});

export type {
  ViteCommonOptions,
  ViteLibOptions,
  ViteSPAOptions,
  ViteSSROptions
};
export {
  createViteCommonConfig,
  createViteLibConfig,
  createViteSPAConfig,
  createViteSSRConfig,
  config
};
