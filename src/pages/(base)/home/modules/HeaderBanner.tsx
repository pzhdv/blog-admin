import { useEffect } from 'react';

import { TypingAnimation } from '@/components/TypingAnimation';
import { selectUserInfo } from '@/features/auth/authStore';
import { fetchQueryArticleCategoryTotal, fetchQueryArticleTagTotal, fetchQueryArticleTotal } from '@/service/api';

interface StatisticData {
  title: string;
  value: string | number;
}

const HeaderBanner = () => {
  const userInfo = useAppSelector(selectUserInfo);
  const [statisticData, setStatisticData] = useState<StatisticData[]>([]);

  useEffect(() => {
    const queryData = async () => {
      const tempStatisticData: StatisticData[] = [];

      try {
        // 并行执行三个异步请求
        const [tagData, categoryData, articleData] = await Promise.all([
          fetchQueryArticleTagTotal(),
          fetchQueryArticleCategoryTotal(),
          fetchQueryArticleTotal()
        ]);

        if (tagData) {
          const articleTagTotal = tagData;
          tempStatisticData.push({
            title: '标签数',
            value: articleTagTotal
          });
        }
        if (categoryData) {
          const categoryTotal = categoryData;
          tempStatisticData.push({
            title: '分类数',
            value: categoryTotal
          });
        }
        if (articleData) {
          const ArticleTotal = articleData?.totalCount;
          const ArticleDraftCount = articleData?.draftCount;
          const ArticlePublishedCount = articleData?.publishedCount;

          tempStatisticData.push(
            {
              title: '文章总数',
              value: ArticleTotal
            },
            {
              title: '已发布',
              value: ArticlePublishedCount
            },
            {
              title: '草稿',
              value: ArticleDraftCount
            }
          );
        }

        setStatisticData(tempStatisticData);
      } catch (err) {
        console.error('请求出错:', err);
      }
    };

    queryData();
  }, []);

  return (
    <ACard
      className="card-wrapper"
      variant="borderless"
    >
      <ARow gutter={[16, 16]}>
        <ACol
          md={18}
          span={24}
        >
          <div className="flex-y-center">
            <div className="size-72px shrink-0 overflow-hidden rd-1/2">
              <img
                className="size-full"
                src={userInfo.avatar}
              />
            </div>
            <div className="pl-12px">
              <h3 className="text-18px font-semibold">嗨，{userInfo.userNick}, 欢迎来到你的博客小世界</h3>
              <TypingAnimation className="text-#666 leading-30px">
                不用追赶什么，慢慢来就好。把那些细碎的灵感、温暖的瞬间，都变成文字好好收藏吧。
              </TypingAnimation>
            </div>
          </div>
        </ACol>

        <ACol
          md={6}
          span={24}
        >
          <ASpace
            className="w-full justify-end"
            size={24}
          >
            {statisticData.map((item, i) => (
              <AStatistic
                className="whitespace-nowrap text-center"
                key={i}
                {...item}
              />
            ))}
          </ASpace>
        </ACol>
      </ARow>
    </ACard>
  );
};

export default HeaderBanner;
