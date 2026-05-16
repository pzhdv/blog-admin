import { Card, Collapse, Space, Table, Tag, Tooltip } from 'antd';
import { Suspense, lazy, useState } from 'react';

import buttonAuthCode from '@/constants/btn-auth-code';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import { useMobile } from '@/hooks/common/mobile';
import {
  fetchBatchDeleteArticle,
  fetchDeleteArticleById,
  fetchQueryArticleListByConditionPage,
  fetchSaveArticle,
  fetchSaveDraftArticle,
  fetchUpdateArticle
} from '@/service/api';

import ArticleDetailModal from './modules/ArticleDetailModal';
import ArticleSearch from './modules/ArticleSearch';

// 懒加载文章操作抽屉组件，优化首屏加载性能
const ArticleOperateDrawer = lazy(() => import('./modules/ArticleOperateDrawer'));
export default function ArticleList() {
  // 获取表格滚动配置，用于处理表格在不同屏幕尺寸下的滚动行为
  const { scrollConfig, tableWrapperRef } = useTableScroll();

  // 判断是否为移动端
  const isMobile = useMobile();

  const [modalOpenState, setModalOpenState] = useState<boolean>(false);
  const [modalArticleId, setModalArticleId] = useState<number>();

  // 表格数据管理 Hook
  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable({
    // 禁用 URL 同步
    // API 请求函数
    apiFn: fetchQueryArticleListByConditionPage,
    // ⚠️ 重点：API 请求参数定义
    // 注意：
    // 1. 如果要在搜索表单中使用这些参数，必须在这里定义
    // 2. 可选参数必须设置为 null，不能是 undefined
    // 3. 不能是 undefined，否则表单字段将不是响应式的
    apiParams: {
      current: 1, // 当前页码
      endDate: null, // 结束日期
      excerptKeyWord: null, // 摘要关键字
      publishState: null, // 发布状态
      recommendWeight: null, // 推荐权重
      size: 10, // 每页条数
      startDate: null, // 开始日期
      title: null // 文章标题
    },
    // 表格列配置 列上要加key 否则不显示
    columns: () => [
      // 序号列
      {
        align: 'center',
        dataIndex: 'index',
        key: 'index',
        title: '序号',
        width: 64
      },
      {
        align: 'center',
        dataIndex: 'articleId',
        key: 'articleId',
        title: '文章ID',
        width: 100
      },
      {
        align: 'center',
        dataIndex: 'image',
        key: 'image',
        render: (_, record) => (
          <img
            alt="文章封面"
            src={record.image}
            style={{ display: 'block', height: 'auto', margin: '0 auto', width: 180 }}
          />
        ),
        title: '文章封面',
        width: 180
      },
      {
        align: 'center',
        dataIndex: 'title',
        key: 'title',
        title: '文章标题',
        width: 200
      },
      {
        align: 'center',
        dataIndex: 'recommendWeight',
        key: 'recommendWeight',
        title: '推荐权重',
        width: 100
      },
      {
        align: 'center',
        key: 'articleCategoryList',
        render: (_, record) => (
          <Space
            direction="vertical"
            size="small"
          >
            {record.articleCategoryList?.map(articleCategory => (
              <span key={articleCategory.categoryId}>{articleCategory.categoryName}</span>
            ))}
          </Space>
        ),
        title: '文章分类',
        width: 100
      },

      {
        align: 'center',
        key: 'articleTagList',
        render: (_, record) => (
          <Space
            direction="vertical"
            size="small"
          >
            {record.articleTagList?.map(tagItem => (
              <Tag
                color="warning"
                key={tagItem.articleTagId}
              >
                {tagItem.articleTagName}
              </Tag>
            ))}
          </Space>
        ),
        title: '文章标签',
        width: 100
      },
      {
        align: 'center',
        key: 'publishState',
        render: (_, record) => (
          <Tag color={record.publishState ? 'success' : 'error'}>{record.publishState ? '已发布' : '草稿'}</Tag>
        ),
        title: '文章状态',
        width: 100
      },
      {
        align: 'center',
        dataIndex: 'updateTime',
        key: 'updateTime',
        title: '操作时间',
        width: 200
      },
      {
        align: 'center',
        key: 'excerpt',
        onCell: () => {
          return {
            style: {
              maxWidth: 300,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }
          };
        },
        render: (_, record) => (
          <Tooltip
            mouseEnterDelay={0.5}
            title={record.excerpt}
          >
            <span className="ellipsis-text">{record.excerpt}</span>
          </Tooltip>
        ),
        title: '文章摘要',
        width: 200
      },
      // 操作列 - 编辑、详情、删除按钮
      {
        align: 'center',
        fixed: 'right',
        key: 'operate',
        render: (_, record) => (
          <Space>
            <AuthEditButton
              auth={buttonAuthCode.blog.article.edit}
              onClick={() => handleEditArticle(record.articleId!)}
            />
            <AuthViewButton
              auth={buttonAuthCode.blog.article.view}
              onClick={() => handleShowModal(record.articleId!)}
            />
            <AuthDeleteButton
              auth={buttonAuthCode.blog.article.delete}
              onClick={() => handleDeleteById(record.articleId!)}
            />
          </Space>
        ),
        title: '操作',
        width: 250
      }
    ],
    isChangeURL: false, // 是否在 URL 中同步搜索参数
    // 分页配置：显示快速跳转
    pagination: {
      showQuickJumper: true
    },
    rowKey: 'articleId' // 表格行的唯一标识字段
  });

  // 表格操作 Hook
  // editingData: 当前正在编辑的文章数据
  const {
    checkedRowKeys,
    editingData,
    generalPopupOperation,
    handleAdd,
    handleEdit,
    onDeleted,
    onSelectChange,
    rowSelection
  } = useTableOperate({
    data,
    executeResActions: async (articleData: Api.Blog.Article, type) => {
      // 操作结果标识
      let isSuccess = true;
      try {
        if (type === 'add') {
          // 新增文章
          if (articleData.publishState === false) {
            // 保存为草稿
            await fetchSaveDraftArticle(articleData);
          } else {
            await fetchSaveArticle(articleData);
          }
        } else {
          if (articleData.publishState === false) {
            // 更新为草稿
            await fetchSaveDraftArticle(articleData);
          } else {
            await fetchUpdateArticle(articleData);
          }
        }
      } catch (error) {
        // 全局拦截器已处理错误提示，此处无需重复提示
        console.error(`${type === 'add' ? '新增' : '编辑'}用户失败：`, error);
        isSuccess = false;
      }

      // 返回布尔值控制抽屉是否关闭
      return isSuccess;
    },
    getData: run,
    rowKey: 'articleId' // 表格行的唯一标识字段(ID)
  });
  // 跳转编辑页面
  const handleEditArticle = (articleId: number) => {
    handleEdit(articleId);
  };
  // 显示文章详情弹框
  const handleShowModal = (articleId: number) => {
    setModalOpenState(true);
    setModalArticleId(articleId);
  };
  // 隐藏文章详情弹框
  const handleHiddenModal = () => {
    setModalOpenState(false);
    setModalArticleId(undefined);
  };

  /** 批量删除文章，删除选中的多个文章 */
  async function handleBatchDelete() {
    // 过滤掉 undefined，只保留有效的 number 类型 ID
    const validIds = checkedRowKeys.filter((id): id is number => id !== undefined);

    // 没有有效ID则直接返回
    if (validIds.length === 0) return;

    await fetchBatchDeleteArticle(validIds);
    onSelectChange([]); // 清空选中状态
    onDeleted();
  }

  /**
   * 删除单个文章
   *
   * @param id - 文章 ID
   */
  async function handleDeleteById(id: number) {
    await fetchDeleteArticleById(id);
    onDeleted();
  }
  return (
    <>
      {/* 设置了最小高度500px */}
      <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
        {/* 搜索区域 - 使用折叠面板，移动端默认收起 */}
        <Collapse
          bordered={false}
          defaultActiveKey={isMobile ? undefined : '1'}
          items={[
            {
              children: <ArticleSearch {...searchProps} />,
              key: '1',
              label: '搜索'
            }
          ]}
        />

        {/* 表格区域 */}
        <Card
          className="flex-col-stretch sm:flex-1-hidden card-wrapper"
          ref={tableWrapperRef}
          title="文章列表"
          variant="borderless"
          extra={
            // 表格头部操作按钮组：新增、刷新、列设置、批量删除
            <TableHeaderOperation
              add={handleAdd}
              addCode={buttonAuthCode.blog.article.add}
              batchDeleteCode={buttonAuthCode.blog.article.batchDel}
              columns={columnChecks}
              disabledDelete={checkedRowKeys.length === 0}
              loading={tableProps.loading}
              needPermission={true}
              refresh={run}
              setColumnChecks={setColumnChecks}
              onDelete={handleBatchDelete}
            />
          }
        >
          {/* 文章列表表格 */}
          <Table
            rowSelection={rowSelection as any}
            scroll={scrollConfig}
            size="small"
            {...tableProps}
          />
          {/* 文章新增/编辑抽屉 - 使用 Suspense 包裹懒加载组件 */}
          <Suspense>
            <ArticleOperateDrawer
              {...generalPopupOperation}
              articleId={editingData?.articleId || -1}
            />
          </Suspense>
        </Card>
      </div>
      <ArticleDetailModal
        articleId={modalArticleId}
        isOpen={modalOpenState}
        onClose={handleHiddenModal}
      />
    </>
  );
}
