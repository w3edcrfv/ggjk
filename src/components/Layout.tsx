import React from 'react';
import { Layout as AntLayout } from 'antd';

const { Header, Content, Footer } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout className="min-h-screen">
      <Header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 flex items-center shadow-lg">
        <h1 className="text-2xl font-bold m-0">
          🧠 公众心理健康测评系统
        </h1>
      </Header>
      <Content className="flex-1">{children}</Content>
      <Footer className="text-center bg-gray-50 border-t border-gray-200">
        <div className="text-gray-600">
          公众心理健康测评系统 © {new Date().getFullYear()} - 专业、科学、便捷
        </div>
        <div className="text-gray-500 text-sm mt-2">
          本测评结果仅供参考，不能作为临床诊断依据
        </div>
      </Footer>
    </AntLayout>
  );
};

export default AppLayout;
