import { Form, Input, Modal, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';

import IconSelect from '@/components/IconSelect';
import { fetchSaveArticleCategory, fetchUpdateArticleCategory } from '@/service/api';

interface IProps {
  categoryList: Api.Blog.ArticleCategory[];
  handleCancel: () => void;
  initialData?: Api.Blog.ArticleCategory;
  isModalOpen: boolean;
  onUpdateDataFunc: () => void;
}

const CategoryModalForm: React.FC<IProps> = props => {
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
      form.setFieldsValue({ categoryLogo: '🌐' });
    }
  }, [props.initialData, props.isModalOpen, form]);

  // 确认事件
  const onFinish = async (data: Api.Blog.ArticleCategory) => {
    if (isAdd) {
      const result = await fetchSaveArticleCategory(data);
      if (result) {
        props.onUpdateDataFunc(); // 更新数据
        props.handleCancel(); // 隐藏弹框
      }
    } else {
      const result = await fetchUpdateArticleCategory(data);
      if (result) {
        props.onUpdateDataFunc(); // 更新数据
        props.handleCancel(); // 隐藏弹框
      }
    }
  };

  return (
    <Modal
      // centered
      open={props.isModalOpen}
      title={modalTitle}
      onCancel={props.handleCancel}
      onOk={() => form.submit()}
    >
      <Form
        autoComplete="off"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
      >
        <Form.Item
          hidden
          name="categoryId"
        >
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          label="分类图标"
          name="iconClass"
          rules={[{ message: '请输入分类图标', required: true }]}
        >
          <IconSelect />
        </Form.Item>

        <Form.Item
          label="分类名称"
          name="categoryName"
          rules={[{ message: '请输入分类名称', required: true }]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>
        <Form.Item
          label="所属分类"
          name="parentId"
          rules={[{ message: '请选择所属分类', required: true }]}
        >
          <TreeSelect
            allowClear
            showSearch
            treeDefaultExpandAll
            placeholder="请选择"
            style={{ width: '100%' }}
            treeData={props.categoryList}
            dropdownStyle={{
              maxHeight: 400,
              overflow: 'auto'
            }}
            fieldNames={{
              children: 'children',
              label: 'categoryName',
              value: 'categoryId'
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CategoryModalForm;
