import { UnorderedListOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Space, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import buttonAuthCode from '@/constants/btn-auth-code';
import { useTableScroll } from '@/features/table';
import { fetchDeleteArticleCategoryById, fetchQueryArticleCategoryListTree } from '@/service/api';

import CategoryModalForm from './modules/CategoryModalForm';
import TagManageModal from './modules/TagManageModal';

export default function Category() {
  // 表头
  const columns: TableColumnsType<Api.Blog.ArticleCategory> = [
    {
      align: 'center',
      dataIndex: 'categoryId',
      title: '分类ID',
      width: 120
    },

    {
      dataIndex: 'categoryName',
      render: (_, record) => (
        <Space>
          <i className={record.iconClass} />
          {record.categoryName}
        </Space>
      ),
      title: '分类名称'
    },
    {
      align: 'center',
      key: 'action',
      render: (_, record) => (
        <Space>
          <AuthEditButton
            auth={buttonAuthCode.blog.category.edit}
            onClick={() => handleEdit(record)}
          />
          <AuthDeleteButton
            auth={buttonAuthCode.blog.category.delete}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
      title: '操作',
      width: 250
    }
  ];

  // 获取表格滚动配置，用于处理表格在不同屏幕尺寸下的滚动行为
  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const [tagModalIsOpen, setTagModalIsOpen] = useState(false); // tag管理弹框展示隐藏

  // 表格数据 数形结构 带根节点
  const [rootCategoryList, setRootCategoryList] = useState<Api.Blog.ArticleCategory[]>([]);
  const [tableTreeData, setTableTreeData] = useState<Api.Blog.ArticleCategory[]>([]); // 表格数据 数形结构
  const [modalIsOpen, setModalIsOpen] = useState(false); // 表单弹框

  const [expandedKeys, setExpandedKeys] = useState<number[]>([]); // 展开的keys状态
  const [loading, setLoading] = useState<boolean>(false);

  // 要修改的数据
  const [initialValues, setInitialValues] = useState<Api.Blog.ArticleCategory | undefined>(undefined);

  // 使用 useMemo 优化 key 计算，并直接在 useMemo 中实现递归逻辑
  const allKeys = useMemo(() => {
    // 获取所有的id
    const getAllIds = (data: Api.Blog.ArticleCategory[]): number[] => {
      return data.reduce((ids: number[], item) => {
        ids.push(Number(item.categoryId)); // 确保 categoryId 是数字类型
        if (item.children) {
          ids.push(...getAllIds(item.children)); // 递归获取子节点的 ID
        }
        return ids;
      }, []);
    };
    return getAllIds(tableTreeData); // 调用递归函数获取所有 ID
  }, [tableTreeData]); // 依赖项是 tableTreeData

  // 清理树结构，去除 children 为 [] 或 null 的节点
  const cleanTree = useCallback((tree: Api.Blog.ArticleCategory[]): Api.Blog.ArticleCategory[] => {
    return tree.map(node => {
      // 如果 children 是空数组或 null，直接移除 children 属性
      if (node.children && node.children.length > 0) {
        // 递归清理子节点
        node.children = cleanTree(node.children);
      } else {
        delete node.children; // 移除 children 属性
      }
      return node;
    });
  }, []);

  // 查询分类列表
  const getCategoryList = useCallback(async () => {
    setLoading(true);
    const data = await fetchQueryArticleCategoryListTree();
    if (!Array.isArray(data) || data.length === 0) {
      setTableTreeData([]);
      setRootCategoryList([]);
    } else {
      setRootCategoryList(data);
      if (Array.isArray(data) && data.length > 0) {
        // 去除根节点 设置表格数据列表 格式化children:[]为null
        setTableTreeData(cleanTree(data[0].children || [])); // 去除根节点 设置表格数据列表
      }
    }
    setLoading(false);
  }, [cleanTree]);

  useEffect(() => {
    setExpandedKeys(allKeys);
  }, [allKeys]);

  useEffect(() => {
    getCategoryList();
  }, [getCategoryList]);

  // 显示编辑弹框
  const handleEdit = (editData: Api.Blog.ArticleCategory) => {
    setInitialValues(editData);
    setModalIsOpen(true);
  };
  // 显示新增弹框
  const handleShowAddDialog = () => {
    setInitialValues(undefined);
    setModalIsOpen(true);
  };
  // 删除
  const handleDelete = async (category: Api.Blog.ArticleCategory) => {
    if (category.children && category.children.length > 0) {
      window.$message?.error('请先删除子菜单，再删除该菜单！');
      return;
    }
    await fetchDeleteArticleCategoryById(category.categoryId as number);
    getCategoryList();
  };

  return (
    <Flex
      vertical
      style={{ height: '100%' }}
    >
      {/* 表格区域 */}
      <Card
        ref={tableWrapperRef}
        style={{ height: '100%' }}
        title={
          // 顶部操作按钮区域
          <Flex
            align="center"
            gap={20}
            justify="space-between"
            style={{ width: '100%' }}
          >
            <Button onClick={() => setExpandedKeys(expandedKeys.length === 0 ? allKeys : [])}>
              {expandedKeys.length === 0 ? '全部展开' : '全部折叠'}
            </Button>
            <Space>
              <AuthAddButton
                auth={buttonAuthCode.blog.category.add}
                onClick={handleShowAddDialog}
              />
              <AuthDetailButton
                auth={buttonAuthCode.blog.category.tagManage}
                icon={<UnorderedListOutlined />}
                onClick={() => setTagModalIsOpen(true)}
              >
                标签管理
              </AuthDetailButton>
            </Space>
          </Flex>
        }
      >
        <Table<Api.Blog.ArticleCategory>
          columns={columns}
          dataSource={tableTreeData}
          loading={loading}
          pagination={false}
          rowKey="categoryId"
          scroll={scrollConfig}
          expandable={{
            childrenColumnName: 'children',
            expandedRowKeys: expandedKeys,
            onExpand: (expanded, record) => {
              const keys: number[] = expanded
                ? [...expandedKeys, record.categoryId as number]
                : expandedKeys.filter(key => key !== record.categoryId);
              setExpandedKeys(keys);
            }
          }}
        />
      </Card>

      {/* 分类表单 */}
      <CategoryModalForm
        categoryList={rootCategoryList}
        handleCancel={() => setModalIsOpen(false)}
        initialData={initialValues}
        isModalOpen={modalIsOpen}
        onUpdateDataFunc={getCategoryList}
      />
      {/* tag管理 */}
      <TagManageModal
        handleCancel={() => setTagModalIsOpen(false)}
        isModalOpen={tagModalIsOpen}
      />
    </Flex>
  );
}
