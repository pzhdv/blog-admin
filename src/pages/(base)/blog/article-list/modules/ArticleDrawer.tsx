import { CloseOutlined } from '@ant-design/icons';
import { Button, Cascader, Checkbox, Col, Drawer, Flex, Form, Input, InputNumber, Row, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import UploadImage from '@/components/UploadImage';
import { fetchQueryArticleCategoryListTree, fetchQueryArticleTagList } from '@/service/api';

const { TextArea } = Input;

interface IProps {
  handleCancel: () => void;
  initialData: Api.Blog.Article;
  isOpen: boolean;
  onUpdateDataFunc: (newArticleInfo: Api.Blog.Article) => void;
}

function ArticleDrawer(props: IProps) {
  const [form] = Form.useForm();
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [tagList, setTagList] = useState<Api.Blog.ArticleTag[]>([]);
  const [categoryTree, setCategoryTree] = useState<Api.Blog.ArticleCategory[]>([]);
  const drawerTitle = isAdd ? '创建文章' : '编辑文章';
  const btnText = isAdd ? '发布' : '更新';

  // 监听表单中的封面字段值，用于回填
  const imageValue = Form.useWatch('image', form);

  useEffect(() => {
    queryAllArticleTagList();
    getCategoryList();
  }, []);

  useEffect(() => {
    if (!props.isOpen) return; //  等到真正去挂载form后再调用form的方法
    if (props.initialData.articleId) {
      form.resetFields(); // 强制重置，确保更新
      form.setFieldsValue(props.initialData);
      setIsAdd(false);
    } else {
      form.resetFields(); // 强制重置，确保更新
      form.setFieldsValue({ recommendWeight: 1 });
      setIsAdd(true);
    }
  }, [props.initialData, props.isOpen, form]);

  // 查询 ArticleTag 列表
  const queryAllArticleTagList = async () => {
    const data = await fetchQueryArticleTagList();
    if (data) {
      setTagList(data);
    } else {
      setTagList([]);
    }
  };
  // 查询分类列表
  const getCategoryList = async () => {
    const data = await fetchQueryArticleCategoryListTree();
    if (data && data.length > 0) {
      setCategoryTree(data[0].children || []); // 去除根节点
    }
  };
  // 渲染底部按钮
  const renderDrawerFooter = () => {
    return (
      <Flex justify="end">
        <Space size="large">
          <Button onClick={props.handleCancel}>取消</Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
          >
            {btnText}
          </Button>
        </Space>
      </Flex>
    );
  };

  // 处理文件更改事件
  const handleUploadImageChange = useCallback(
    (newFile: string | undefined) => {
      form.setFieldsValue({ image: newFile });
    },
    [form]
  );
  // 表单提交事件
  const onFinish = async (articleInfo: Api.Blog.Article) => {
    const newArticleInfo = {
      ...props.initialData,
      ...articleInfo,
      publishState: true
    };
    props.onUpdateDataFunc(newArticleInfo); // 更新数据
  };
  return (
    <Drawer
      closeIcon={false}
      footer={renderDrawerFooter()}
      open={props.isOpen}
      size="large"
      title={drawerTitle}
      extra={
        <Button
          icon={<CloseOutlined />}
          type="text"
          onClick={props.handleCancel}
        />
      }
    >
      <Form
        autoComplete="off"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          label="文章封面"
          name="image"
          rules={[{ message: '请上传文章封面图片', required: true }]}
        >
          <UploadImage
            fileSize={5}
            initFile={imageValue} // ✅ 使用表单监听值
            isShowPreview={false}
            onChange={handleUploadImageChange}
          />
        </Form.Item>

        <Form.Item
          label="文章标签"
          name="tagIds"
          rules={[
            { message: '请选择文章标签', required: true },
            () => ({
              validator(_, value) {
                if (value?.length > 3) {
                  return Promise.reject(new Error('最多只能选择3个标签'));
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              {tagList &&
                tagList.map(tag => {
                  return (
                    <Col
                      key={tag.articleTagId}
                      span={8}
                    >
                      <Checkbox value={tag.articleTagId}>{tag.articleTagName}</Checkbox>
                    </Col>
                  );
                })}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="所属分类"
          name="categoryIds"
          rules={[{ message: '请选择所属分类', required: true }]}
        >
          <Cascader
            options={categoryTree}
            placeholder="请选择文章所属分类"
            fieldNames={{
              children: 'children',
              label: 'categoryName',
              value: 'categoryId'
            }}
          />
        </Form.Item>

        <Form.Item
          label="推荐权重"
          name="recommendWeight"
          rules={[{ message: '请输入文章权重', required: true }]}
        >
          <InputNumber
            max={10}
            min={1}
            placeholder="权重越大、文章越靠前"
          />
        </Form.Item>
        <Form.Item
          label="文章摘要"
          name="excerpt"
          rules={[{ message: '请输入文章摘要', required: true }]}
        >
          <TextArea
            maxLength={500}
            rows={4}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default ArticleDrawer;
