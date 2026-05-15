import path from 'node:path';
import url from 'node:url';
import type {StorybookConfig} from '@storybook/react-vite';

const getAbsolutePath = ((value: string): string => path.dirname(url.fileURLToPath(import.meta.resolve(`${value}/package.json`))));

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [],
  framework: getAbsolutePath('@storybook/react-vite'),
  viteFinal: (config => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        // eslint-disable-next-line @typescript-eslint/no-misused-spread
        ...config.resolve?.alias,
        '@sweetroll/fomod': path.resolve(import.meta.dirname, '../../fomod/src/index.ts')
      }
    }
  }))
};

export default config;
