import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Button,
  Typography,
  Space,
  Alert,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { getResultById, generateReportContent, exportToPDF } from '@/utils/assessmentUtils';
import { assessmentScales } from '@/data/assessmentScales';

const { Title, Paragraph, Text } = Typography;

const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { resultId } = useParams<{ resultId: string }>();
  const reportRef = useRef<HTMLDivElement>(null);

  const result = getResultById(resultId || '');
  const scale = result
    ? assessmentScales.find(s => s.id === result.userInfo.scaleId)
    : undefined;

  const reportContent = result && scale ? generateReportContent(result, scale) : '';

  const handleBack = () => {
    navigate(`/result/${resultId}`);
  };

  const handleExportPDF = async () => {
    if (reportRef.current) {
      await exportToPDF(reportRef.current, `测评报告_${result?.userInfo.name}_${Date.now()}.pdf`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!result || !scale) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <Title level={3}>未找到测评报告</Title>
          <Button onClick={handleBack}>返回</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center no-print">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回
          </Button>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={handleExportPDF}>
              导出PDF
            </Button>
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>
              打印
            </Button>
          </Space>
        </div>

        <Card>
          <div ref={reportRef} className="bg-white p-8">
            {/* 报告头部 */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
              <Title level={1} className="text-3xl font-bold text-gray-800 mb-4">
                公众心理健康测评报告
              </Title>
              <Text className="text-lg text-gray-600">
                {scale.name}
              </Text>
            </div>

            <Divider />

            {/* 基本信息 */}
            <div className="mb-8">
              <Title level={3} className="text-xl font-semibold mb-4">
                基本信息
              </Title>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} md={8}>
                  <div className="mb-3">
                    <Text strong className="text-gray-700">姓名：</Text>
                    <Text className="ml-2">{result.userInfo.name}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="mb-3">
                    <Text strong className="text-gray-700">性别：</Text>
                    <Text className="ml-2">
                      {result.userInfo.gender === 'male'
                        ? '男'
                        : result.userInfo.gender === 'female'
                        ? '女'
                        : '其他'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="mb-3">
                    <Text strong className="text-gray-700">年龄：</Text>
                    <Text className="ml-2">{result.userInfo.age}岁</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="mb-3">
                    <Text strong className="text-gray-700">测评量表：</Text>
                    <Text className="ml-2">{scale.name}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="mb-3">
                    <Text strong className="text-gray-700">测评时间：</Text>
                    <Text className="ml-2">
                      {new Date(result.completedAt).toLocaleString('zh-CN')}
                    </Text>
                  </div>
                </Col>
                {result.userInfo.phone && (
                  <Col xs={24} sm={12} md={8}>
                    <div className="mb-3">
                      <Text strong className="text-gray-700">联系方式：</Text>
                      <Text className="ml-2">{result.userInfo.phone}</Text>
                    </div>
                  </Col>
                )}
                {result.userInfo.occupation && (
                  <Col xs={24} sm={12} md={8}>
                    <div className="mb-3">
                      <Text strong className="text-gray-700">职业：</Text>
                      <Text className="ml-2">{result.userInfo.occupation}</Text>
                    </div>
                  </Col>
                )}
              </Row>
            </div>

            <Divider />

            {/* 测评结果 */}
            <div className="mb-8">
              <Title level={3} className="text-xl font-semibold mb-4">
                测评结果
              </Title>
              <div className="bg-blue-50 p-6 rounded-lg mb-4">
                <Row gutter={[24, 24]} align="middle">
                  <Col xs={24} md={12}>
                    <div className="text-center">
                      <Text className="text-gray-600 text-lg">总得分</Text>
                      <Title level={2} className="text-5xl font-bold text-gray-800 my-4">
                        {result.totalScore} 分
                      </Title>
                      <div className="inline-block px-6 py-2 bg-blue-500 text-white rounded-full text-xl font-semibold">
                        {result.overallLevel}
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="bg-white p-4 rounded-lg">
                      <Text strong className="text-gray-700 block mb-3">
                        结果解释
                      </Text>
                      <Text className="text-gray-600">{result.interpretation}</Text>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* 得分详情 */}
              <div className="mt-6">
                <Text strong className="text-gray-700 block mb-3">
                  各维度得分详情
                </Text>
                <div className="space-y-4">
                  {result.chartData.map((data, index) => (
                    <div
                      key={data.dimension}
                      className="flex items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <Text strong>{data.dimension}维度</Text>
                          <Text className="text-gray-600">
                            {data.score} / {data.maxScore}
                          </Text>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${data.percentage}%` }}
                          ></div>
                        </div>
                        <Text className="text-sm text-gray-500 mt-1">
                          {data.percentage}%
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Divider />

            {/* 专业建议 */}
            <div className="mb-8">
              <Title level={3} className="text-xl font-semibold mb-4">
                专业建议
              </Title>
              <div className="bg-green-50 p-6 rounded-lg">
                <Space direction="vertical" size="middle" className="w-full">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <Text className="text-gray-700 flex-1">{rec}</Text>
                    </div>
                  ))}
                </Space>
              </div>
            </div>

            <Divider />

            {/* 注意事项 */}
            <div className="mb-8">
              <Title level={3} className="text-xl font-semibold mb-4">
                注意事项
              </Title>
              <Alert
                message="重要提示"
                description={
                  <ul className="mb-0 ml-4 space-y-2">
                    <li>本测评结果仅供参考，不能作为临床诊断依据</li>
                    <li>如果测评结果显示存在问题，建议及时咨询专业心理咨询师或精神科医生</li>
                    <li>保持良好的生活习惯和心态对心理健康非常重要</li>
                    <li>定期进行心理健康评估有助于及时发现和解决问题</li>
                  </ul>
                }
                type="info"
                showIcon
              />
            </div>

            <Divider />

            {/* 声明 */}
            <div className="text-center text-gray-500 text-sm mb-4">
              <Paragraph className="mb-2">
                本测评报告由公众心理健康测评系统自动生成
              </Paragraph>
              <Paragraph className="mb-0">
                报告生成时间：{new Date().toLocaleString('zh-CN')}
              </Paragraph>
            </div>

            {/* 页脚 */}
            <div className="mt-8 pt-6 border-t-2 border-gray-200 text-center text-gray-500 text-sm">
              <Paragraph className="mb-0">
                © 公众心理健康测评系统 - 专业、科学、便捷
              </Paragraph>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportPage;
