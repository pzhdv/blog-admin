import { Button, Col, DatePicker, Flex, Form, Input, Row, Select } from 'antd';

const { RangePicker } = DatePicker;

/**
 * 文章搜索表单组件
 *
 * @param form - 表单实例
 * @param reset - 重置搜索条件
 * @param search - 执行搜索
 * @param searchParams - 搜索参数
 */
const ArticleSearch: FC<Page.SearchProps> = memo(({ form, reset, search, searchParams }) => {
  return (
    <Form
      autoComplete="off" // 关闭浏览器填充
      form={form}
      initialValues={searchParams}
      labelCol={{
        md: 7,
        span: 5
      }}
    >
      {/* 响应式网格布局：lg(>=1200px)每行4个，md(>=768px)每行2个，sm(<768px)每行1个 */}
      <Row
        wrap
        gutter={[16, 16]}
      >
        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="文章标题"
            name="title"
          >
            <Input
              allowClear
              placeholder="请输入文章标题"
            />
          </Form.Item>
        </Col>

        {/* 性别搜索 - 下拉选择 */}
        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="文章状态"
            name="publishState"
          >
            <Select
              allowClear
              placeholder="请选择文章状态"
              options={[
                { label: '草稿', value: 0 },
                { label: '已发布', value: 1 }
              ]}
            />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="关键字"
            name="excerptKeyWord"
          >
            <Input
              allowClear
              placeholder="请输入摘要关键字"
            />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            label="日期范围"
            name="rangePicker"
          >
            <RangePicker
              format="YYYY-MM-DD"
              onChange={dates => {
                if (dates && dates.length === 2) {
                  form.setFieldValue('startDate', dates[0]?.format('YYYY-MM-DD'));
                  form.setFieldValue('endDate', dates[1]?.format('YYYY-MM-DD'));
                } else {
                  form.setFieldValue('startDate', undefined);
                  form.setFieldValue('endDate', undefined);
                }
              }}
            />
          </Form.Item>

          {/* 隐藏提交给后端的时间字段 */}
          <AForm.Item
            noStyle
            name="startDate"
          >
            <AInput type="hidden" />
          </AForm.Item>
          <AForm.Item
            noStyle
            name="endDate"
          >
            <AInput type="hidden" />
          </AForm.Item>
        </Col>

        {/* 邮箱搜索 - 带格式验证 */}
        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="文章权重"
            name="recommendWeight"
          >
            <Input
              allowClear
              placeholder="请输入文章权重"
            />
          </Form.Item>
        </Col>

        {/* 操作按钮区域 - 重置和搜索 */}
        <Col
          lg={12}
          span={24}
        >
          <Form.Item className="m-0">
            <Flex
              align="center"
              gap={12}
              justify="end"
            >
              {/* 重置按钮 */}
              <Button
                icon={<IconIcRoundRefresh />}
                onClick={reset}
              >
                重置
              </Button>
              {/* 搜索按钮 */}
              <Button
                ghost
                icon={<IconIcRoundSearch />}
                type="primary"
                onClick={search}
              >
                搜索
              </Button>
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default ArticleSearch;
