import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // 目标浏览器
    target: 'es2015',
    // CSS 代码分割
    cssCodeSplit: true,

    rollupOptions: {
      output: {
        // 平衡的分包策略：避免过细分包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 策略 1: 第三方库合并打包（减少 HTTP 请求）
            // 将 React、Router 等核心库合并到一个 vendor
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }

            // 策略 2: 如果有大型 UI 库，可以单独打包
            // 这样可以单独缓存，且只在需要时加载
            // if (id.includes('antd') || id.includes('@mui/material')) {
            //   return 'ui-vendor';
            // }

            // 策略 3: 其他第三方库也合并到 vendor
            return 'vendor';
          }

          // ⚠️ 注意：公共组件不要强制分包！
          // 让 Vite 自动根据引用关系决定是否分包
          // 只在多个懒加载路由共享时才自动分包
          // if (id.includes('/components/')) {
          //   return 'components'; // 不要开启这个！
          // }

          // ⚠️ 页面也不要强制分包
          // React.lazy() 已经会自动处理页面分包
        },

        // chunk 文件命名规范
        // chunkFileNames: 'js/[name]-[hash].js',
        // entryFileNames: 'js/[name]-[hash].js',
        // assetFileNames: '[ext]/[name]-[hash].[ext]',
      },
    },

    // 压缩配置
    // minify: 'terser',
    terserOptions: {
      compress: {
        // 删除 console
        drop_console: true,
        drop_debugger: true,
      },
    },

    // 分包阈值警告（调整为 500KB，避免生成过多小文件）
    chunkSizeWarningLimit: 500,

    // Source map（生产环境建议用 false 或 hidden-source-map）
    sourcemap: false,
  },

  // 依赖预构建优化
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },

  // 开发服务器配置（可选）
  server: {
    // 开启 gzip 压缩
    compress: true,
  },
});

// 小型项目 第三方库：React、React-DOM、React-Router  总大小：~180KB
// ✅ 最佳策略：合并成一个 vendor.js
// 理由：
// - 库都很小，合并后仍在合理范围
// - 减少请求次数
// - 缓存策略简单

// 中大型项目 依赖：React、Router、Ant Design、Lodash、Axios
// ✅ 最佳策略：
// vendor.js         // React、Router (50KB) - 核心库
// ui-vendor.js      // Ant Design (500KB) - UI 库单独
// utils-vendor.js   // Lodash、Axios (80KB) - 工具库

// 理由：
// - Ant Design 很大，单独分包便于更新
// - 首屏可能不需要加载完整 UI 库
// - 不同的更新频率和缓存策略

// import { visualizer } from 'rollup-plugin-visualizer';
// export default defineConfig({
//   plugins: [
//     react(),
//     visualizer({
//       open: true,
//       gzipSize: true,
//       brotliSize: true,
//     }),
//   ],
// });

// 验证分包是否合理，评估标准
//  总文件数 < 10 个（小型项目）
//  单个文件大小 20KB - 200KB
//  没有小于 10KB 的独立 chunk
//  vendor 总大小合理（< 300KB）
//  首屏加载的文件 < 3 个
