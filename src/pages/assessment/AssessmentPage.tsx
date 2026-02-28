import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Radio,
  Button,
  Steps,
  Typography,
  Alert,
  Space,
  Progress,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { assessmentTargets } from '@/data/assessmentTargets';
import { assessmentScales } from '@/data/assessmentScales';
import { generateAssessmentResult, saveAssessmentResult } from '@/utils/assessmentUtils';
import type { UserInfo, AnswerRecord } from '@/types/assessment';

const { Paragraph, Text } = Typography;

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetId, scaleId } = useParams<{ targetId: string; scaleId: string }>();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({});

  const target = assessmentTargets.find(t => t.id === targetId);
  const scale = assessmentScales.find(s => s.id === scaleId);

  const totalItems = scale?.items.length || 0;
  const answeredCount = answers.length;

  const handleBack = () => {
    navigate(`/select-scale/${targetId}`);
  };

  const handleAnswerChange = (itemId: string, value: any, dimension?: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.itemId === itemId);
      if (existing) {
        return prev.map(a =>
          a.itemId === itemId ? { ...a, value, dimension } : a
        );
      }
      return [...prev, { itemId, value, dimension }];
    });
  };

  const handleUserInfoSubmit = async (values: any) => {
    // 保存用户信息到 state
    setUserInfo(values);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!scale || !target) return;

    setLoading(true);

    try {
      // 验证并使用已保存的用户信息
      const userInfoValues = await form.validateFields();
      const finalUserInfo: UserInfo = {
        ...userInfo,
        ...userInfoValues,
        targetId: target.id,
        scaleId: scale.id,
        submitTime: new Date().toISOString(),
      };

      console.log('保存的用户信息:', finalUserInfo); // 调试日志

      // 生成测评结果
      const result = generateAssessmentResult(finalUserInfo, scale, answers);

      // 保存结果
      saveAssessmentResult(result);

      // 跳转到结果页面
      navigate(`/result/${result.id}`);
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!target || !scale) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <h3 className="text-base md:text-2xl font-semibold">未找到测评内容</h3>
          <Button onClick={handleBack}>返回</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-3 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="mb-3 md:mb-6"
        >
          返回
        </Button>

        <Card className="mb-3 md:mb-6">
          <Space orientation="vertical" size="middle" className="w-full">
            <div>
              <h2 className="text-base md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">
                {scale.name}
              </h2>
              <Paragraph className="text-xs md:text-base text-gray-600 mb-0">
                {scale.description}
              </Paragraph>
            </div>

            <Progress
              percent={totalItems > 0 ? Math.round((answeredCount / totalItems) * 100) : 0}
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              size={{ strokeWidth: window.innerWidth < 768 ? 10 : 8 }}
            />
          </Space>
        </Card>

        <Card>
          <Steps
            current={currentStep}
            className="mb-4 md:mb-8"
            items={[
              {
                title: '基本信息',
                icon: <UserOutlined />,
              },
              {
                title: '量表答题',
                icon: <CheckCircleOutlined />,
              },
              {
                title: '完成',
                icon: <CheckCircleOutlined />,
              },
            ]}
          />

          {currentStep === 0 && (
            <div>
              <Alert
                title="请填写您的基本信息"
                description="所有信息将严格保密，仅用于本次测评分析"
                type="info"
                showIcon
                className="mb-4 md:mb-6"
              />
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUserInfoSubmit}
                initialValues={{
                  gender: 'male',
                }}
              >
                <Form.Item
                  label="姓名"
                  name="name"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input placeholder="请输入您的姓名" />
                </Form.Item>

                <Form.Item
                  label="性别"
                  name="gender"
                  rules={[{ required: true, message: '请选择性别' }]}
                >
                  <Radio.Group>
                    <Radio value="male">男</Radio>
                    <Radio value="female">女</Radio>
                    <Radio value="other">其他</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label="年龄"
                  name="age"
                  rules={[
                    { required: true, message: '请输入年龄' },
                    { type: 'number', min: 0, max: 120, message: '请输入有效的年龄（0-120岁）' },
                  ]}
                >
                  <InputNumber
                    placeholder="请输入年龄"
                    min={0}
                    max={120}
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item label="手机号" name="phone">
                  <Input placeholder="请输入手机号（选填）" />
                </Form.Item>

                <Form.Item label="邮箱" name="email">
                  <Input type="email" placeholder="请输入邮箱（选填）" />
                </Form.Item>

                <Form.Item label="职业" name="occupation">
                  <Input placeholder="请输入职业（选填）" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    icon={<CheckCircleOutlined />}
                  >
                    下一步，开始答题
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <Alert
                title="请根据您最近一周的实际情况，选择最符合的选项"
                description="请如实回答，答案没有对错之分"
                type="info"
                showIcon
                className="mb-3 md:mb-6"
              />

              <Form layout="vertical">
                <Space orientation="vertical" size="small" className="w-full">
                  {scale.items.map((item, index) => {
                    const answer = answers.find(a => a.itemId === item.id);
                    return (
                      <Card
                        key={item.id}
                        className={answer ? 'border-green-300 bg-green-50' : ''}
                        bodyStyle={{ padding: '12px' }}
                      >
                        <div className="mb-2">
                          <Text strong className="text-sm md:text-lg">
                            {index + 1}. {item.question}
                          </Text>
                          {item.required && (
                            <Text type="danger" className="ml-1">
                              *
                            </Text>
                          )}
                        </div>

                        <Radio.Group
                          value={answer?.value}
                          onChange={(e) =>
                            handleAnswerChange(item.id, e.target.value, item.dimension)
                          }
                          className="w-full"
                        >
                          <Space direction="vertical" size="small" className="w-full">
                            {item.options.map((option) => (
                              <Radio
                                key={option.value}
                                value={option.value}
                                className="w-full py-0.5 md:py-0"
                              >
                                {option.label}
                              </Radio>
                            ))}
                          </Space>
                        </Radio.Group>
                      </Card>
                    );
                  })}
                </Space>
              </Form>

              <div className="mt-4 md:mt-8 flex gap-2 md:gap-4 flex-col sm:flex-row">
                <Button
                  onClick={() => setCurrentStep(0)}
                  className="flex-1"
                >
                  上一步
                </Button>
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={answeredCount < totalItems}
                  className="flex-1"
                  icon={<CheckCircleOutlined />}
                >
                  提交测评
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AssessmentPage;
