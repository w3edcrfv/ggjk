import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";
import AutoImport from "unplugin-auto-import/vite";

// GitHub Pages 部署时，使用仓库名称作为 base 路径
const base = process.env.IS_PREVIEW
  ? "./"
  : process.env.GITHUB_PAGES
  ? "/mental-health-assessment/"
  : "/";
const isPreview = process.env.IS_PREVIEW ? true : false;
// https://vite.dev/config/
export default defineConfig({
  define: {
    __BASE_PATH__: JSON.stringify(base),
    __IS_PREVIEW__: JSON.stringify(isPreview),
    __READDY_PROJECT_ID__: JSON.stringify(process.env.PROJECT_ID || ""),
    __READDY_VERSION_ID__: JSON.stringify(process.env.VERSION_ID || ""),
    __READDY_AI_DOMAIN__: JSON.stringify(process.env.READDY_AI_DOMAIN || ""),
  },
  plugins: [
    react(),
    AutoImport({
      imports: [
        {
          react: [
            "React",
            "useState",
            "useEffect",
            "useContext",
            "useReducer",
            "useCallback",
            "useMemo",
            "useRef",
            "useImperativeHandle",
            "useLayoutEffect",
            "useDebugValue",
            "useDeferredValue",
            "useId",
            "useInsertionEffect",
            "useSyncExternalStore",
            "useTransition",
            "startTransition",
            "lazy",
            "memo",
            "forwardRef",
            "createContext",
            "createElement",
            "cloneElement",
            "isValidElement",
          ],
        },
        {
          "react-router-dom": [
            "useNavigate",
            "useLocation",
            "useParams",
            "useSearchParams",
            "Link",
            "NavLink",
            "Navigate",
            "Outlet",
          ],
        },
        // React i18n
        {
          "react-i18next": ["useTranslation", "Trans"],
        },
      ],
      dts: true,
    }),
  ],
  base,
  build: {
    sourcemap: true,
    outDir: "build",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      'api': resolve(__dirname, './src/assets/api/index'),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    open: true, // 启动后自动打开浏览器
    proxy: {
      // 示例配置：将 /api 开头的请求代理到后端服务器
      '/api': {
        target: 'http://d.jxs.vip.chaodp.com', // 替换为实际的后端地址
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // 如需去掉 /api 前缀，取消此行注释
      },
    },
  },
});
