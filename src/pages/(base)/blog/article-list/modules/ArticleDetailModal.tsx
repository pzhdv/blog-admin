import { Modal, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import { fetchQueryArticleById } from '@/service/api';

const { Title } = Typography;
/** 文章详情组件 */
interface ArticleDetailProp {
  articleId: number | undefined;
  isOpen: boolean;
  onClose: () => void;
}
const ArticleDetailModal: React.FC<ArticleDetailProp> = props => {
  const [articleInfo, setArticleInfo] = useState<Api.Blog.Article>();
  useEffect(() => {
    const getArticleById = async (articleId: number) => {
      const data = await fetchQueryArticleById(articleId);
      if (data) {
        setArticleInfo(data);
      }
    };

    if (!props.isOpen || !props.articleId) return;
    getArticleById(props.articleId);
  }, [props.isOpen, props.articleId]);

  return (
    <Modal
      centered
      footer={null}
      open={props.isOpen}
      title={<Title level={4}>{articleInfo?.title}</Title>}
      width={800}
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
      onCancel={props.onClose}
    >
      <MarkdownRenderer content={articleInfo?.markdown || ''} />
    </Modal>
  );
};

export default ArticleDetailModal;
