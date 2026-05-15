import { Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import UploadImage from '@/components/UploadImage';
import { fetchSaveBlogAuthor, fetchUpdateBlogAuthor } from '@/service/api';

interface IProps {
  handleCancel: () => void;
  initialData?: Api.Blog.BlogAuthor;
  isModalOpen: boolean;
  onUpdateDataFunc: () => void;
}

/** 用户信息弹框表单组件 */
const BlogAuthorModalForm: React.FC<IProps> = props => {
  const [form] = Form.useForm<Api.Blog.BlogAuthor>();
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const modalTitle = isAdd ? '新增' : '编辑';

  useEffect(() => {
    if (!props.isModalOpen) return; //  等到真正去挂载form后再调用form的方法
    if (props.initialData) {
      form.resetFields(); // 强制重置，确保更新
      const birthday = props.initialData.birthday ? dayjs(props.initialData.birthday) : undefined;
      form.setFieldsValue({
        ...props.initialData,
        birthday
      });
      setIsAdd(false);
    } else {
      form.resetFields(); // 强制重置，确保更新
      setIsAdd(true);
      // form.setFieldsValue({})
    }
  }, [form, props.initialData, props.isModalOpen]);

  // !todo 确认事件
  const onFinish = async (data: Api.Blog.BlogAuthor) => {
    const d = dayjs(data.birthday);
    const payload = {
      ...data,
      birthday: d.isValid() ? d.format('YYYY-MM-DD') : null
    };

    if (isAdd) {
      const saveResult = await fetchSaveBlogAuthor(payload);
      if (saveResult) {
        props.onUpdateDataFunc(); // 更新数据
        props.handleCancel(); // 隐藏弹框
      }
    } else {
      const updateResult = await fetchUpdateBlogAuthor(payload);
      if (updateResult) {
        props.onUpdateDataFunc(); // 更新数据
        props.handleCancel(); // 隐藏弹框
      }
    }
  };

  // ! 处理文件更改事件
  const handleUploadImageChange = (newFile: string | undefined) => {
    form.setFieldsValue({ avatar: newFile });
  };

  return (
    <Modal
      centered
      open={props.isModalOpen}
      title={modalTitle}
      width={800}
      onCancel={props.handleCancel}
      onOk={() => form.submit()}
    >
      <Form
        autoComplete="off"
        form={form}
        labelCol={{ flex: '80px' }}
        onFinish={onFinish}
      >
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              hidden
              name="userId"
            >
              <Input type="hidden" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="头像"
              name="avatar"
              rules={[{ message: '请上传用户头像', required: true }]}
            >
              <UploadImage
                borderRadius={40}
                fileSize={5}
                height={80}
                initFile={props.initialData?.avatar}
                isShowPreview={false}
                width={80}
                onChange={handleUploadImageChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="姓名"
              name="fullName"
              rules={[{ message: '请输入姓名', required: true }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="职位"
              name="position"
              rules={[{ message: '请输入职位', required: true }]}
            >
              <Input placeholder="请输入职位" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="用户昵称"
              name="userNick"
              rules={[{ message: '请输入用户昵称', required: true }]}
            >
              <Input placeholder="请输入用户昵称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="出生日期"
              name="birthday"
              rules={[{ message: '请选择出生日期', required: true }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="学历"
              name="educationLevel"
              rules={[{ message: '请输入学历', required: true }]}
            >
              <Input placeholder="请输入学历" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="学校名称"
              name="schoolName"
              rules={[{ message: '请输入学校名称', required: true }]}
            >
              <Input placeholder="请输入学校名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ message: '请输入邮箱', required: true }]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="个人网站"
              name="website"
              rules={[{ message: '请输入个人网站', required: true }]}
            >
              <Input placeholder="请输入个人网站" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="github"
              name="github"
              rules={[{ message: '请输入github', required: true }]}
            >
              <Input placeholder="请输github" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="联系电话"
              name="phone"
              rules={[{ message: '请输入联系电话', required: true }]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="个人简介"
              name="selfIntroduction"
              rules={[{ message: '请输入个人简介', required: true }]}
            >
              <Input.TextArea
                showCount
                maxLength={500}
                placeholder="请输入姓名"
                rows={5}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default BlogAuthorModalForm;
