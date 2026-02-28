import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { assessmentTargets } from '@/data/assessmentTargets';
import { assessmentScales } from '@/data/assessmentScales';
import type { AssessmentScale } from '@/types/assessment';

const { Paragraph } = Typography;

const SelectScalePage: React.FC = () => {
  const navigate = useNavigate();
  const { targetId } = useParams<{ targetId: string }>();

  const target = assessmentTargets.find(t => t.id === targetId);

  // 根据测评对象类型筛选可用的量表
  const availableScales = assessmentScales.filter(scale =>
    target && scale.targetTypes.includes(target.type)
  );

  const handleSelectScale = (scale: AssessmentScale) => {
    navigate(`/assessment/${targetId}/${scale.id}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!target) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-base md:text-2xl font-semibold">未找到测评对象</h3>
          <Button onClick={handleBack}>返回首页</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-3 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:block">
          <Breadcrumb className="mb-6"
            items={[
              {
                title: '首页',
                onClick: handleBack,
                style: { cursor: 'pointer' }
              },
              {
                title: target.name
              }
            ]}
          />
        </div>

        <div className="mb-3 md:mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="mb-2 md:mb-4"
          >
            返回
          </Button>

          <div className="flex items-center mb-2 md:mb-4">
            <span className="text-2xl md:text-5xl mr-3 md:mr-4">{target.icon}</span>
            <div>
              <h2 className="text-base md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
                {target.name}
              </h2>
              <Paragraph className="text-xs md:text-lg text-gray-600 mb-0">
                {target.description}
              </Paragraph>
            </div>
          </div>
        </div>

        <div className="mb-5 md:mb-8">
          <h2 className="text-base md:text-2xl font-semibold text-gray-700 mb-3 md:mb-6">
            请选择测评量表
          </h2>
          <Row gutter={[8, 8]}>
            {availableScales.map((scale) => (
              <Col xs={24} sm={12} lg={8} key={scale.id}>
                <Card
                  hoverable
                  className="h-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  onClick={() => handleSelectScale(scale)}
                  styles={{ body: { padding: '12px md:24px' } }}
                >
                  <div>
                    <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">
                      {scale.name}
                    </h3>
                    <Paragraph className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4 min-h-[28px] md:min-h-[48px]">
                      {scale.description}
                    </Paragraph>
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex items-center text-gray-600 text-xs md:text-sm">
                        <ClockCircleOutlined className="mr-1 md:mr-2" />
                        <span>预计用时: {scale.estimatedTime}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-xs md:text-sm">
                        <span className="mr-1 md:mr-2">📋</span>
                        <span>题目数量: {scale.items.length}题</span>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      className="mt-3 md:mt-6 w-full"
                      icon={<ArrowRightOutlined />}
                    >
                      开始答题
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {availableScales.length === 0 && (
          <Card className="text-center py-12">
            <Paragraph className="text-lg text-gray-600">
              暂无适合该测评对象的量表
            </Paragraph>
            <Button onClick={handleBack}>返回首页</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SelectScalePage;
