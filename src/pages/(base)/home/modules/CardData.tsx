import { Card as ACard, Col as ACol, Row as ARow, message } from 'antd';
import { useEffect, useState } from 'react';

import NumberTicker from '@/components/NumberTicker';
import SvgIcon from '@/components/SvgIcon';
import { fetchQueryArticleCategoryTotal, fetchQueryArticleTagTotal, fetchQueryArticleTotal } from '@/service/api';

// 卡片类型定义
interface CardDataProps {
  color: {
    end: string;
    start: string;
  };
  icon: string;
  key: string;
  title: string;
  unit: string;
  value: number;
}

// 渐变样式工具函数
function getGradientColor(color: CardDataProps['color']) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`;
}

// 卡片子组件
const CardItem = (data: CardDataProps) => {
  return (
    <ACol
      key={data.key}
      lg={6}
      md={12}
      span={24}
    >
      <div
        className="flex-1 rd-8px px-16px pb-4px pt-8px text-white"
        style={{ backgroundImage: getGradientColor(data.color) }}
      >
        <h3 className="text-16px">{data.title}</h3>
        <div className="flex justify-between pt-12px">
          <SvgIcon
            className="text-32px"
            icon={data.icon}
          />
          <NumberTicker
            className="text-30px"
            prefix={data.unit}
            value={data.value}
          />
        </div>
      </div>
    </ACol>
  );
};

// 主组件
const CardData = () => {
  const [data, setData] = useState<CardDataProps[]>([]);
  const [loading, setLoading] = useState(true); // 加载状态

  useEffect(() => {
    const queryData = async () => {
      setLoading(true);
      try {
        // 并行请求，性能更好
        const [tagTotal, categoryTotal, articleInfo] = await Promise.all([
          fetchQueryArticleTagTotal(),
          fetchQueryArticleCategoryTotal(),
          fetchQueryArticleTotal()
        ]);

        const tempData: CardDataProps[] = [];

        // 标签总数
        tempData.push({
          color: { end: '#f68057', start: '#fcbc25' },
          icon: 'flowbite:tag-solid',
          key: 'tag-total', // 唯一key
          title: '标签总数',
          unit: '',
          value: Number(tagTotal) || 0 // 数字容错
        });

        // 分类总数
        tempData.push({
          color: { end: '#719de3', start: '#56cdf3' },
          icon: 'nrk:category',
          key: 'category-total',
          title: '分类总数',
          unit: '',
          value: Number(categoryTotal) || 0
        });

        // 已发布文章
        tempData.push({
          color: { end: '#b955a4', start: '#ec4786' },
          icon: 'ic:baseline-published-with-changes',
          key: 'article-published',
          title: '已发布',
          unit: '',
          value: Number(articleInfo?.publishedCount) || 0
        });

        // 草稿文章
        tempData.push({
          color: { end: '#5144b4', start: '#865ec0' },
          icon: 'material-symbols:draft-sharp',
          key: 'article-draft',
          title: '草稿',
          unit: '',
          value: Number(articleInfo?.draftCount) || 0
        });

        setData(tempData);
      } catch (err) {
        console.error('统计数据请求失败:', err);
        message.error('数据加载失败，请刷新重试');
      } finally {
        setLoading(false);
      }
    };

    queryData();
  }, []);

  return (
    <ACard
      className="card-wrapper"
      loading={loading} // 加载动画
      size="small"
      variant="borderless"
    >
      <ARow gutter={[16, 16]}>{data.map(item => CardItem(item))}</ARow>
    </ACard>
  );
};

export default CardData;
