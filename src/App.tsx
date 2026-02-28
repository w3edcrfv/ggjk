import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
function App() {
  return (
    <ConfigProvider componentSize={'middle'} locale={zhCN}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
