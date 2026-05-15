import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

import { fetchSaveBlogMission, fetchUpdateBlogMission } from '@/service/api';

interface IProps {
  handleCancel: () => void;
  initialData?: Api.Blog.BlogMission;
  isModalOpen: boolean;
  onUpdateDataFunc: () => void;
}

const labelWidth = '100px'; // label宽度

/** 用户信息弹框表单组件 */
const BlogMissionModalForm: React.FC<IProps> = props => {
  const [form] = Form.useForm<Api.Blog.BlogMission>();
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
      form.setFieldsValue({ missionPointList: [{ missionPoint: '' }] }); // 确保有一个展示列表
    }
  }, [form, props.initialData, props.isModalOpen]);

  // !todo 确认事件
  const onFinish = async (data: Api.Blog.BlogMission) => {
    const { missionDescription, missionId, missionPointList, missionTitle } = data;

    // 将 missionPointList 转换为字符串，确保 missionPointList 是数组
    const missionPointListStr = Array.isArray(missionPointList)
      ? missionPointList.map(item => item.missionPoint).join('&')
      : '';

    // 数据整合 提交数据
    const submitData = {
      missionDescription,
      missionId,
      missionPointListStr,
      missionTitle
    } as Api.Blog.BlogMission;

    if (isAdd) {
      await fetchSaveBlogMission(submitData);
    } else {
      await fetchUpdateBlogMission(submitData);
    }
    props.onUpdateDataFunc(); // 更新数据
    props.handleCancel(); // 隐藏弹框
  };

  return (
    <Modal
      centered
      open={props.isModalOpen}
      title={modalTitle}
      bodyProps={{
        tabIndex: 0 // 使div可聚焦 可以键盘滚动
      }}
      styles={{
        body: {
          flex: 1,
          outline: 'none',
          overflowY: 'auto',
          paddingLeft: 10,
          paddingRight: 10 // 移除焦点时的轮廓线
        },
        content: {
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100vh'
        }
      }}
      onCancel={props.handleCancel}
      onOk={() => form.submit()}
    >
      <Form
        autoComplete="off"
        form={form}
        labelCol={{ flex: labelWidth }}
        onFinish={onFinish}
      >
        <Form.Item
          hidden
          name="missionId"
        >
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          label="使命标题"
          name="missionTitle"
          rules={[{ message: '请输入使命标题', required: true }]}
        >
          <Input placeholder="请输入使命标题" />
        </Form.Item>
        <Form.Item
          label="使命描述"
          name="missionDescription"
          rules={[{ message: '请输入使命描述', required: true }]}
        >
          <Input.TextArea
            showCount
            maxLength={200}
            placeholder="请输入使命描述"
            rows={2}
          />
        </Form.Item>

        <Form.List name="missionPointList">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  label={index === 0 ? '使命要点' : ''}
                  required={true}
                  style={{ marginLeft: index === 0 ? 0 : labelWidth }}
                >
                  <Flex gap={10}>
                    <Form.Item
                      noStyle
                      name={[field.name, 'missionPoint']}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          message: '请输入使命要点',
                          required: true,
                          whitespace: true
                        }
                      ]}
                    >
                      <Input placeholder="请输入使命要点" />
                    </Form.Item>
                    {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(field.name)} />}
                  </Flex>
                </Form.Item>
              ))}
              <Form.Item style={{ marginLeft: labelWidth }}>
                <Button
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                  type="dashed"
                  onClick={() => add()}
                >
                  添加
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
export default BlogMissionModalForm;
