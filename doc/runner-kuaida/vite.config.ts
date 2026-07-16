import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log(mode);
  return {
    plugins: [
      ...VitePluginNode({
        adapter: 'koa',
        appPath: './src/main.ts',
        exportName: 'viteNodeApp',
        tsCompiler: 'esbuild'
      })
    ],
    server: {
      port: 8008,
      open: true
    }
  };
});
