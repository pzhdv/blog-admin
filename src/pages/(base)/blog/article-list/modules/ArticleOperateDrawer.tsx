/**
 * 用于新增和编辑文章的抽屉表单
 *
 * @file 文章操作抽屉组件
 */

import { Button, Drawer, Flex, Form, Input } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import MarkdownEditor from '@/components/MarkdownEditor';
import { fetchQueryArticleById } from '@/service/api';

import ArticleDrawer from './ArticleDrawer';

/** 组件属性类型，扩展了通用操作抽屉属性并添加了文章 ID */
type Props = Page.OperateDrawerProps & { articleId: number };

const getInitData = () => {
  const initData: Api.Blog.Article = {
    categoryIds: [],
    excerpt: '',
    image: '',
    markdown: '',
    tagIds: [],
    title: ''
  };
  return initData;
};

/**
 * 文章操作抽屉组件
 *
 * @param form - 表单实例
 * @param handleSubmit - 提交表单处理函数
 * @param onClose - 关闭抽屉回调
 * @param open - 抽屉打开状态
 * @param operateType - 操作类型（'add' | 'edit'）
 * @param articleId - ID（编辑时用于加载文章详情）
 */
const ArticleOperateDrawer: FC<Props> = ({ articleId, form, handleSubmit, onClose, open, operateType }) => {
  const [articleInfo, setArticleInfo] = useState<Api.Blog.Article>(getInitData());
  const [openDrawer, setOpenDrawer] = useState(false);

  // 当抽屉打开时，请求文章详情或重置表单
  useEffect(() => {
    const getArticleById = async (ArticleId: number) => {
      const data = await fetchQueryArticleById(ArticleId);
      if (data) {
        setArticleInfo(data);
        // 设置表单值
        form.setFieldsValue({
          markdown: data.markdown,
          title: data.title
        });
      }
    };

    if (open) {
      if (operateType === 'edit' && articleId > 0) {
        // 编辑模式：加载文章数据
        getArticleById(articleId);
      } else if (operateType === 'add') {
        // 新增模式：重置表单
        setArticleInfo(getInitData());
        form.resetFields();
      }
    }
  }, [open, articleId, operateType, form]);

  /** 发布/编辑文章 - 将完整数据注入 form 并提交给父组件处理 */
  const onUpdateDataFunc = async (extraData: Api.Blog.Article) => {
    // 获取表单数据
    const formValues = form.getFieldsValue();
    const { markdown, title } = formValues;
    // 合并表单数据和额外数据
    const completeData: Api.Blog.Article = {
      ...articleInfo,
      ...extraData,
      markdown,
      title
    };
    // 将完整数据注入表单（包括所有字段）
    form.setFieldsValue(completeData);

    // 触发父组件的 handleSubmit，由父组件处理请求
    await handleSubmit();

    // 关闭所有抽屉
    handleClearAllData();
  };

  /** 验证表单数据 */
  const validateForm = () => {
    // 获取表单值
    const values = form.getFieldsValue();
    // 手动验证
    if (!values.title || values.title.trim() === '') {
      window.$message?.error({ content: '文章标题不能为空' });
      return false;
    }
    if (!values.markdown || values.markdown.trim() === '') {
      window.$message?.error({ content: '文章内容不能为空' });
      return false;
    }

    return true;
  };
  /** 保存为草稿 - 将数据注入 form 并标记为草稿后提交给父组件处理 */
  const saveDraft = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    // 获取表单值
    const formValues = form.getFieldsValue();
    const { markdown, title } = formValues;
    // 合并数据并标记为草稿
    const draftData: Api.Blog.Article = {
      ...articleInfo,
      markdown,
      publishState: false,
      title
    };
    // 将草稿数据注入表单（包括所有字段）
    form.setFieldsValue(draftData);

    // 触发父组件的 handleSubmit，由父组件处理请求
    handleSubmit();

    // 关闭抽屉
    handleClearAllData();
  };

  /** 显示编辑/发布表单 */
  const handleShowArticleDrawer = () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    setOpenDrawer(true);
  };

  /** 隐藏编辑/发布表单 */
  const handleHiddenArticleDrawer = () => {
    setOpenDrawer(false);
  };

  /** 清空数据 */
  const handleClearAllData = () => {
    setOpenDrawer(false);
    // setArticleInfo(getInitData());
  };

  /** 关闭抽屉 */
  const handleClose = () => {
    handleClearAllData();
    onClose();
  };
  return (
    <Drawer
      height="100%"
      open={open}
      title={operateType === 'add' ? '新增文章' : '编辑文章'}
      width="100%"
      onClose={handleClose}
    >
      <Form
        className="h-full flex flex-col"
        form={form}
        layout="vertical"
      >
        {/* 隐藏字段 - 存储完整文章数据 */}
        <Form.Item
          hidden
          name="articleId"
        >
          <Input />
        </Form.Item>
        <Form.Item
          hidden
          name="categoryIds"
        >
          <Input />
        </Form.Item>
        <Form.Item
          hidden
          name="tagIds"
        >
          <Input />
        </Form.Item>
        <Form.Item
          hidden
          name="excerpt"
        >
          <Input />
        </Form.Item>
        <Form.Item
          hidden
          name="image"
        >
          <Input />
        </Form.Item>
        <Form.Item
          hidden
          name="publishState"
        >
          <Input />
        </Form.Item>
        <Form.Item
          hidden
          name="recommendWeight"
        >
          <Input />
        </Form.Item>

        {/* 标题栏 */}
        <Flex
          align="center"
          className="mb-4"
          gap={8}
          justify="space-between"
          wrap="nowrap"
        >
          <Form.Item
            noStyle
            name="title"
          >
            <Input
              maxLength={200}
              placeholder="请输入文章标题"
              size="large"
              style={{ flex: 1, minWidth: 0 }}
            />
          </Form.Item>
          <Flex
            gap={8}
            wrap="nowrap"
          >
            <Button onClick={saveDraft}>存为草稿</Button>
            <Button
              type="primary"
              onClick={handleShowArticleDrawer}
            >
              {articleInfo?.articleId ? '编辑' : '发布'}
            </Button>
          </Flex>
        </Flex>

        {/* Markdown 编辑器区域 */}
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', minHeight: 0 }}>
          <Form.Item
            noStyle
            name="markdown"
          >
            <MarkdownEditor />
          </Form.Item>
        </div>
      </Form>

      {/* 文章发布配置抽屉 */}
      <ArticleDrawer
        handleCancel={handleHiddenArticleDrawer}
        initialData={articleInfo}
        isOpen={openDrawer}
        onUpdateDataFunc={onUpdateDataFunc}
      />
    </Drawer>
  );
};

export default ArticleOperateDrawer;
