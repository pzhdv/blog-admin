import { Flex, Modal, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import React, { useEffect, useState } from 'react';

import buttonAuthCode from '@/constants/btn-auth-code';
import { fetchDeleteArticleTagById, fetchQueryArticleTagList } from '@/service/api';

import ArticleTagAddEditModal from '../components/ArticleTagAddEditModal';

interface IProps {
  handleCancel: () => void;
  isModalOpen: boolean;
}

/** 标签管理 */
const TagManageModal: React.FC<IProps> = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Api.Blog.ArticleTag>();
  const [articleTagList, setArticleTagList] = useState<Api.Blog.ArticleTag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 表头
  const columns: TableProps<Api.Blog.ArticleTag>['columns'] = [
    {
      align: 'center',
      dataIndex: 'articleTagId',
      key: 'articleTagId',
      title: 'ID',
      width: '20%'
    },
    {
      align: 'center',
      dataIndex: 'articleTagName',
      key: 'articleTagName',
      title: '标签名称',
      width: '50%'
    },
    {
      align: 'center',
      key: 'action',
      render: (_, record) => (
        <Space>
          <AuthEditButton
            auth={buttonAuthCode.blog.category.tag.edit}
            onClick={() => handleEdit(record)}
          />
          <AuthDeleteButton
            auth={buttonAuthCode.blog.category.tag.delete}
            onClick={() => handleDeleteById(record.articleTagId!)}
          />
        </Space>
      ),
      title: '操作'
    }
  ];

  useEffect(() => {
    queryAllArticleTagList();
  }, []);
  // 隐藏弹框
  const handleCancel = () => {
    setEditData(undefined);
    setIsModalOpen(false);
  };

  // 编辑按钮事件
  const handleEdit = (currentEditData: Api.Blog.ArticleTag) => {
    setEditData(currentEditData);
    setIsModalOpen(true);
  };

  // 查询 ArticleTag 列表
  const queryAllArticleTagList = async () => {
    setLoading(true);
    const data = await fetchQueryArticleTagList();
    if (Array.isArray(data)) {
      setArticleTagList(data);
    }
    setLoading(false);
  };

  // 删除按钮事件
  const handleDeleteById = async (articleTagId: number) => {
    const result = await fetchDeleteArticleTagById(articleTagId);
    if (result) {
      queryAllArticleTagList();
    }
  };

  return (
    <>
      <Modal
        centered
        footer={null}
        open={props.isModalOpen}
        title="标签列表"
        bodyProps={{
          tabIndex: 0 // 使div可聚焦 可以键盘滚动
        }}
        styles={{
          body: {
            flex: 1,
            outline: 'none',
            overflow: 'auto',
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
      >
        <Flex
          gap={20}
          justify="end"
          style={{ margin: 10 }}
        >
          <AuthAddButton
            auth={buttonAuthCode.blog.category.tag.add}
            onClick={() => setIsModalOpen(true)}
          />
        </Flex>
        <Table<Api.Blog.ArticleTag>
          columns={columns}
          dataSource={articleTagList}
          loading={loading}
          pagination={false}
          rowKey="articleTagId"
          size="small"
        />
      </Modal>
      <ArticleTagAddEditModal
        handleCancel={handleCancel}
        initialData={editData}
        isModalOpen={isModalOpen}
        onUpdateListDate={queryAllArticleTagList}
      />
    </>
  );
};

export default TagManageModal;
