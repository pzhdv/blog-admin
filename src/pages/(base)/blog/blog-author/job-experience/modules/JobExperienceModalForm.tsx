import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import IconSelect from '@/components/IconSelect';
import { fetchSaveJobExperience, fetchUpdateJobExperience } from '@/service/api';

interface IProps {
  handleCancel: () => void;
  initialData?: Api.Blog.JobExperience;
  isModalOpen: boolean;
  onUpdateDataFunc: () => void;
}

const labelWidth = '100px'; // label宽度

/** 用户信息弹框表单组件 */
const JobExperienceModalForm: React.FC<IProps> = props => {
  const [form] = Form.useForm<Api.Blog.JobExperience>();
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
      form.setFieldsValue({ achievementList: [{ achievement: '' }] }); // 展示列表
    }
  }, [form, props.initialData, props.isModalOpen]);

  // !todo 确认事件
  const onFinish = useCallback(
    async (data: Api.Blog.JobExperience) => {
      // 数据整合 过滤掉不存在的字段
      const submitData = {
        achievementListStr: Array.isArray(data.achievementList)
          ? data.achievementList.map(item => item.achievement).join('&')
          : '',
        id: data.id,
        organization: data.organization,
        timeRange: data.timeRange,
        title: data.title,
        titleIcon: data.titleIcon
      } as Api.Blog.JobExperience;
      if (isAdd) {
        await fetchSaveJobExperience(submitData);
      } else {
        await fetchUpdateJobExperience(submitData);
      }
      props.onUpdateDataFunc(); // 更新数据
      props.handleCancel(); // 隐藏弹框
    },
    [isAdd, props]
  );

  const handleOk = useCallback(() => {
    form.submit();
  }, [form]);

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
      onOk={handleOk}
    >
      <Form
        autoComplete="off"
        form={form}
        labelCol={{ flex: labelWidth }}
        onFinish={onFinish}
      >
        <Form.Item
          hidden
          name="id"
        >
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          label="标题"
          name="title"
          rules={[{ message: '请输入经历或成就的标题', required: true }]}
        >
          <Input placeholder="请输入经历或成就的标题" />
        </Form.Item>

        <Form.Item
          label="标题图标"
          name="titleIcon"
          rules={[{ message: '请选择标题图标', required: true }]}
        >
          <IconSelect />
        </Form.Item>

        <Form.Item
          label="所属组织"
          name="organization"
          rules={[{ message: '请输入所属组织', required: true }]}
        >
          <Input placeholder="请输入所属组织" />
        </Form.Item>

        <Form.Item
          label="时间范围"
          name="timeRange"
          rules={[{ message: '请输入时间范围', required: true }]}
        >
          <Input placeholder="请输入时间范围" />
        </Form.Item>

        <Form.List name="achievementList">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  label={index === 0 ? '成就列表' : ''}
                  required={true}
                  style={{ marginLeft: index === 0 ? 0 : labelWidth }}
                >
                  <Flex gap={10}>
                    <Form.Item
                      noStyle
                      name={[field.name, 'achievement']}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          message: '请输入具体的成就',
                          required: true,
                          whitespace: true
                        }
                      ]}
                    >
                      <Input placeholder="请输入具体的成就" />
                    </Form.Item>
                    {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(field.name)} />}
                    {/* <PlusOutlined onClick={() => add()} /> */}
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
export default JobExperienceModalForm;
