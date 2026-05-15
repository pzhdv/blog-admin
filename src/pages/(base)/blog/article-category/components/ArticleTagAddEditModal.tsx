import { Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

import { fetchSaveArticleTag, fetchUpdateArticleTag } from '@/service/api';

interface ArticleTagIProps {
  handleCancel: () => void;
  initialData?: Api.Blog.ArticleTag;
  isModalOpen: boolean;
  onUpdateListDate: () => void;
}

const ArticleTagAddEditModal: React.FC<ArticleTagIProps> = props => {
  const [form] = Form.useForm();
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const modalTitle = isAdd ? '新增' : '编辑';

  useEffect(() => {
    if (!props.isModalOpen) return; //  等到真正去挂载form后再调用form的方法
    if (props.initialData) {
      form.resetFields(); // 强制重置，确保更新
      form.setFieldsValue(props.initialData);
      setIsAdd(false);
    } else {
      form.resetFields(); // 强制重置，确保更新
      setIsAdd(true);
    }
  }, [form, props.initialData, props.isModalOpen]);

  // 提交事件
  const onSubmit = async (articleTag: Api.Blog.ArticleTag) => {
    if (isAdd) {
      const result = await fetchSaveArticleTag(articleTag);
      if (result) {
        props.onUpdateListDate(); // 更新列表数据
        props.handleCancel(); // 隐藏弹框
      }
    } else {
      const result = await fetchUpdateArticleTag(articleTag);
      if (result) {
        props.onUpdateListDate(); // 更新列表数据
        props.handleCancel(); // 隐藏弹框
      }
    }
  };

  return (
    <Modal
      open={props.isModalOpen}
      title={modalTitle}
      width={400}
      onCancel={() => props.handleCancel()}
      onOk={() => form.submit()}
    >
      <Form
        autoComplete="off"
        form={form}
        onFinish={onSubmit}
      >
        <Form.Item
          hidden
          name="articleTagId"
        >
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          label="标签名称"
          name="articleTagName"
          rules={[{ message: '请输入标签名称', required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ArticleTagAddEditModal;
