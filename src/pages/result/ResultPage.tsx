import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Alert,
  Tag,
  Progress,
  Space,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  DownloadOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getResultById, exportToPDF } from '@/utils/assessmentUtils';
import { assessmentScales } from '@/data/assessmentScales';
import type { AssessmentResult } from '@/types/assessment';

const { Paragraph, Text } = Typography;

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { resultId } = useParams<{ resultId: string }>();
  const resultRef = React.useRef<HTMLDivElement>(null);

  const result = getResultById(resultId || '');
  const scale = result
    ? assessmentScales.find(s => s.id === result.userInfo.scaleId)
    : undefined;

  const handleBack = () => {
    navigate(`/`);
  };

  const handleViewReport = () => {
    if (result) {
      navigate(`/report/${result.id}`);
    }
  };

  const handleExportPDF = async () => {
    if (resultRef.current) {
      await exportToPDF(resultRef.current, `测评报告_${result?.userInfo.name}_${Date.now()}.pdf`);
    }
  };

  if (!result || !scale) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <h3 className="text-base md:text-2xl font-semibold">未找到测评结果</h3>
          <Button onClick={handleBack}>返回首页</Button>
        </Card>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case '正常':
        return 'success';
      case '轻度':
        return 'warning';
      case '中度':
        return 'warning';
      case '重度':
        return 'error';
      default:
        return 'default';
    }
  };

  const COLORS = ['#52c41a', '#faad14', '#fa8c16', '#f5222d'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-3 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-3 md:mb-6 flex justify-between items-center gap-2 flex-wrap">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} size="small">
            返回首页
          </Button>
          <Space className="flex-wrap">
            <Button
              icon={<FileTextOutlined />}
              onClick={handleViewReport}
              size="small"
            >
              查看完整报告
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExportPDF}
              size="small"
            >
              导出PDF
            </Button>
          </Space>
        </div>

        <div ref={resultRef} className="bg-white p-3 md:p-8 rounded-lg shadow-lg">
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-base md:text-3xl font-bold text-gray-800 mb-2 md:mb-4">
              心理健康测评报告
            </h1>
            <Paragraph className="text-sm md:text-lg text-gray-600">
              {scale.name}
            </Paragraph>
          </div>

          <Divider />

          {/* 基本信息 */}
          <Card className="mb-3 md:mb-6" title="基本信息">
            <Row gutter={[8, 8]}>
              <Col xs={12} sm={12} md={6}>
                <Text strong className="text-xs md:text-sm">姓名：</Text>
                <Text className="block md:inline text-xs md:text-sm">{result.userInfo.name || '未填写'}</Text>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <Text strong className="text-xs md:text-sm">性别：</Text>
                <Text className="block md:inline text-xs md:text-sm">
                  {result.userInfo.gender === 'male'
                    ? '男'
                    : result.userInfo.gender === 'female'
                    ? '女'
                    : result.userInfo.gender === 'other'
                    ? '其他'
                    : '未填写'}
                </Text>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <Text strong className="text-xs md:text-sm">年龄：</Text>
                <Text className="block md:inline text-xs md:text-sm">{result.userInfo.age ? `${result.userInfo.age}岁` : '未填写'}</Text>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <Text strong className="text-xs md:text-sm">测评时间：</Text>
                <Text className="block md:inline text-xs md:text-sm">{new Date(result.completedAt).toLocaleString('zh-CN')}</Text>
              </Col>
            </Row>
          </Card>

          {/* 测评结果 */}
          <Card className="mb-3 md:mb-6" title="测评结果">
            <Row gutter={[12, 12]} align="middle">
              <Col xs={24} md={12}>
                <div className="text-center">
                  <div className="mb-2 md:mb-4">
                    <Text className="text-gray-600 text-xs md:text-base">总得分</Text>
                    <h2 className="text-xl md:text-6xl font-bold text-gray-800 my-2 md:my-4">
                      {result.totalScore}
                    </h2>
                    <Tag
                      color={getLevelColor(result.overallLevel)}
                      className="text-sm md:text-lg px-2 py-1 md:px-4 md:py-2"
                    >
                      {result.overallLevel}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <Alert
                  message="结果解释"
                  description={result.interpretation}
                  type={result.overallLevel === '正常' ? 'success' : result.overallLevel === '重度' ? 'error' : 'warning'}
                  showIcon
                />
              </Col>
            </Row>
          </Card>

          {/* 维度得分图表 */}
          <Card className="mb-3 md:mb-6" title="维度得分分析">
            <Row gutter={[12, 12]}>
              <Col xs={24} lg={14}>
                <div className="h-48 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dimension" tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }} />
                      <YAxis tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" name="得分" fill="#1890ff" />
                      <Bar dataKey="maxScore" name="满分" fill="#d9d9d9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Col>
              <Col xs={24} lg={10}>
                <div className="h-48 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={result.chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ dimension, percentage }) => (
                          <span style={{ fontSize: window.innerWidth < 768 ? '9px' : '12px' }}>
                            {dimension}: {percentage}%
                          </span>
                        )}
                        outerRadius={50}
                        fill="#8884d8"
                        dataKey="score"
                      >
                        {result.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Col>
            </Row>
          </Card>

          {/* 维度详情 */}
          <Card className="mb-3 md:mb-6" title="维度得分详情">
            <Space direction="vertical" size="small" className="w-full">
              {result.chartData.map((data) => (
                <div key={data.dimension}>
                  <div className="flex justify-between mb-1 md:mb-2">
                    <Text strong className="text-xs md:text-base">{data.dimension}维度</Text>
                    <Text className="text-xs md:text-base">
                      {data.score} / {data.maxScore} ({data.percentage}%)
                    </Text>
                  </div>
                  <Progress
                    percent={data.percentage}
                    status={data.percentage >= 70 ? 'exception' : data.percentage >= 50 ? 'active' : 'success'}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    strokeWidth={window.innerWidth < 768 ? 8 : 12}
                  />
                </div>
              ))}
            </Space>
          </Card>

          {/* 专业建议 */}
          <Card className="mb-3 md:mb-6" title="专业建议">
            <Space direction="vertical" size="small" className="w-full">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start">
                  <Tag color="blue" className="mt-0.5 text-xs">
                    {index + 1}
                  </Tag>
                  <Text className="text-xs md:text-base">{rec}</Text>
                </div>
              ))}
            </Space>
          </Card>

          {/* 注意事项 */}
          <Alert
            message="重要提示"
            description={
              <ul className="mb-0 ml-4 space-y-1 md:space-y-2 text-xs md:text-sm">
                <li>本测评结果仅供参考，不能作为临床诊断依据</li>
                <li>如果测评结果显示存在问题，建议及时咨询专业心理咨询师或精神科医生</li>
                <li>保持良好的生活习惯和心态对心理健康非常重要</li>
                <li>定期进行心理健康评估有助于及时发现和解决问题</li>
              </ul>
            }
            type="info"
            showIcon
            className="mb-6"
          />

          <div className="text-center">
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={handleBack}
              className="w-full md:w-auto"
            >
              返回首页
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
