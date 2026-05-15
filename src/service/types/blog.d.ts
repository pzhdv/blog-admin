/**
 * 命名空间 Api.Blog
 *
 * 后端 API 模块：博客模块
 */
declare namespace Api {
  namespace Blog {
    /** 文章分类接口 */
    interface ArticleCategory {
      /** 分类id */
      categoryId?: number;
      /** 分类名称 */
      categoryName: string;
      /** 子列表 */
      children?: ArticleCategory[];
      /** 分类图标 */
      iconClass: string;
      /** 父id */
      parentId: number;
    }
    /** 分类统计饼图汇总结果 */
    interface CategoryPieChart {
      /* 本分类关联的文章数量 */
      articleCount: number;
      /** 分类名 */
      categoryName: string;
    }
    /** 文章标签接口 */
    interface ArticleTag {
      /** 标签id */
      articleTagId?: number;
      /** 标签内容 */
      articleTagName: string;
    }

    /** 文章搜索参数 */
    type ArticleSearchParams = CommonType.RecordNullable<
      Pick<Api.Blog.Article, 'publishState' | 'recommendWeight' | 'title'> &
        Common.CommonSearchParams & {
          /** 分类id列表 */
          endDate?: string | null;
          /** 摘要关键字 */
          excerptKeyWord?: string | null;
          /** 开始日期 */
          startDate?: string | null;
          /** 文章标题 */
          title?: string | null;
        }
    >;

    /** 文章列表 */
    type ArticleList = Common.PaginatingQueryRecord<Article>;

    /** 文章接口 */
    interface Article {
      /** 文章所属分类 */
      articleCategoryList?: ArticleCategory[];
      /** 文章id */
      articleId?: number;
      /** 文章所属分tag列表 */
      articleTagList?: ArticleTag[];
      /** 分类ids */
      categoryIds: number[];
      /** 摘要 */
      excerpt: string;
      /** 图片 */
      image: string;
      /** 内容 */
      markdown: string;
      /** 发布状态 */
      publishState?: boolean;
      /** 推荐权重 */
      recommendWeight?: number;
      /** 标签ids */
      tagIds: number[];
      /** 标题 */
      title: string;
      /** 更新时间 */
      updateTime?: string;
    }

    /** 文章总数 */
    interface ArticleTotal {
      /** 文章总数 */
      draftCount: number;
      /** 已发布数量 */
      publishedCount: number;
      /** 草稿数量 */
      totalCount: number;
    }
    /** 文章折线图 */
    interface ArticleLineChart {
      /** 草稿列表 */
      draftCntList: number[];
      /** 已发布列表 */
      publishedCntList: number[];
      /** 年月列表 */
      ymList: string[];
    }
    /** 博客作者接口 */
    interface BlogAuthor {
      /** 用户头像 */
      avatar: string;
      /** 生日 */
      birthday: string | null | any;
      /** 学历 */
      educationLevel: string;
      /** 个人邮箱 */
      email: string;
      /** 用户名 */
      fullName: string;
      /** 个人github */
      github: string;
      /** 个人电话 */
      phone: string;
      /** 用户职位 */
      position: string;
      /** 学校名称 */
      schoolName: string;
      /** 个人简介 */
      selfIntroduction: string;
      /** 用户id */
      userId?: number | string;
      /** 用户昵称 */
      userNick: string;
      /** 个人网址 */
      website: string;
    }

    /** 博客使命要点类型 */
    type MissionPoint = {
      /** 使命要点内容 */
      missionPoint: string;
    };

    /** 博客使命接口 */
    interface BlogMission {
      /** 使命描述 */
      missionDescription: string;
      /** 博客使命id */
      missionId?: number | string;
      /** 具体使命要点列表 前端扩展字段 */
      missionPointList: MissionPoint[];
      /** 具体使命要点 */
      missionPointListStr: string;
      /** 使命标题 */
      missionTitle: string;
    }

    /** 成就类型 */
    type Achievement = {
      /** 成就内容 */
      achievement: string;
    };

    /** 工作经历接口 */
    interface JobExperience {
      /** 具体的成就列表 前端扩展字段 */
      achievementList: Achievement[];
      /** 具体的成就字符串 */
      achievementListStr: string;
      /** id */
      id?: number | string;
      /** 所属组织 */
      organization: string;
      /** 时间范围 */
      timeRange: string;
      /** 经历或成就的标题 */
      title: string;
      /** 标题icon图标类 */
      titleIcon: string;
    }
  }
}
