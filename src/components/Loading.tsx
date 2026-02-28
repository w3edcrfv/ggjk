import React from 'react';
import { Spin } from 'antd';

interface LoadingProps {
  tip?: string;
}

const Loading: React.FC<LoadingProps> = ({ tip = '加载中...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <Spin tip={tip} size="large" />
    </div>
  );
};

export default Loading;
