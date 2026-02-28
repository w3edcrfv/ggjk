import { StrictMode } from 'react'
// import './i18n'  // 暂时禁用 i18n，避免加载问题
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('正在加载应用...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('未找到 root 元素');
} else {
  console.log('root 元素已找到，正在渲染应用');
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
