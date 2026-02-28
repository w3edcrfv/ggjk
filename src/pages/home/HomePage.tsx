import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { assessmentTargets } from '@/data/assessmentTargets';

const { Paragraph } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectTarget = (targetId: string) => {
    navigate(`/select-scale/${targetId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-3 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
            公众心理健康测评系统
          </h1>
          <Paragraph className="text-xs md:text-lg text-gray-600 px-2 md:px-0">
            专业、科学、便捷的心理健康评估工具，助您全面了解心理健康状况
          </Paragraph>
        </div>

        <div className="mb-6 md:mb-8">
          <h2 className="text-base md:text-2xl font-semibold text-gray-700 mb-3 md:mb-6">
            请选择测评对象
          </h2>
          <Row gutter={[8, 8]}>
            {assessmentTargets.map((target) => (
              <Col xs={24} sm={12} lg={8} xl={8} key={target.id}>
                <Card
                  hoverable
                  className="h-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  onClick={() => handleSelectTarget(target.id)}
                  styles={{ body: { padding: '12px md:24px' } }}
                >
                  <div className="text-center">
                    <div className="text-2xl md:text-6xl mb-2 md:mb-4">{target.icon}</div>
                    <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">
                      {target.name}
                    </h3>
                    <Paragraph className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4 min-h-[28px] md:min-h-[48px]">
                      {target.description}
                    </Paragraph>
                    {target.ageRange && (
                      <div className="inline-block px-2 py-1 md:px-4 md:py-2 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-medium">
                        {target.ageRange}
                      </div>
                    )}
                    <Button
                      type="primary"
                      className="mt-2 md:mt-4 w-full"
                      icon={<ArrowRightOutlined />}
                    >
                      开始测评
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className="mt-6 md:mt-12 text-center">
          <Card className="bg-white/80 backdrop-blur">
            <h3 className="text-base md:text-lg text-gray-700 mb-2 md:mb-4">
              测评流程
            </h3>
            <Row gutter={[8, 8]} justify="center">
              <Col xs={6} md={6}>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 md:w-12 md:h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs md:text-xl font-bold mb-1 md:mb-2">
                    1
                  </div>
                  <div className="text-xs md:text-base font-medium text-gray-700">选择对象</div>
                </div>
              </Col>
              <Col xs={6} md={6}>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 md:w-12 md:h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xs md:text-xl font-bold mb-1 md:mb-2">
                    2
                  </div>
                  <div className="text-xs md:text-base font-medium text-gray-700">填写量表</div>
                </div>
              </Col>
              <Col xs={6} md={6}>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 md:w-12 md:h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs md:text-xl font-bold mb-1 md:mb-2">
                    3
                  </div>
                  <div className="text-xs md:text-base font-medium text-gray-700">查看结果</div>
                </div>
              </Col>
              <Col xs={6} md={6}>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 md:w-12 md:h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs md:text-xl font-bold mb-1 md:mb-2">
                    4
                  </div>
                  <div className="text-xs md:text-base font-medium text-gray-700">生成报告</div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        <div className="mt-4 md:mt-8 text-center text-gray-500 text-xs md:text-sm px-2 md:px-4">
          <p className="text-xs md:text-sm">
            ⚠️ 本测评结果仅供参考，不能作为临床诊断依据。如有心理健康问题，请咨询专业医疗人员。
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
