// ==================== 文章相关接口 ====================

import { request } from '../request';

/**
 * 查询文章折线图数据
 *
 * @returns 返回操作结果
 */
export function fetchQueryArticleLineChart() {
  return request<Api.Blog.ArticleLineChart>({
    method: 'get',
    url: '/article/lineChart'
  });
}

/**
 * 查询文章总数
 *
 * @returns 返回操作结果
 */
export function fetchQueryArticleTotal() {
  return request<Api.Blog.ArticleTotal>({
    method: 'get',
    url: '/article/total'
  });
}

/**
 * 根据条件分页查询文章列表
 *
 * @param params - 查询参数
 * @param params.current - 当前页码
 * @param params.size - 每页条数
 * @param params.title - 文章标题（可选）
 * @param params.excerptKeyWord - 摘要关键字（可选）
 * @param params.publishState - 发布状态（可选）
 * @param params.recommendWeight - 推荐权重（可选）
 * @param params.startDate - 开始日期（可选）
 * @param params.endDate - 结束日期（可选）
 * @returns 返回分页文章列表
 */
export function fetchQueryArticleListByConditionPage(params: Api.Blog.ArticleSearchParams) {
  return request<Api.Blog.ArticleList>({
    method: 'get',
    params,
    url: '/article/conditionPageList'
  });
}

/**
 * 根据ID查询文章详情
 *
 * @param {number} articleId - 文章ID
 * @returns 返回文章详情
 */
export function fetchQueryArticleById(articleId: number) {
  return request<Api.Blog.Article>({
    method: 'get',
    params: { articleId },
    url: '/article/articleDetailById'
  });
}

// ==================== 文章相关接口 ====================

/**
 * 保存文章
 *
 * @param {Api.Blog.Article} article - 文章对象
 * @returns 返回操作结果
 */
export function fetchSaveArticle(article: Api.Blog.Article) {
  return request<boolean>({
    data: article,
    method: 'post',
    url: '/article/add'
  });
}

/**
 * 保存草稿文章
 *
 * @param {Api.Blog.Article} article - 文章对象
 * @returns 返回操作结果
 */
export function fetchSaveDraftArticle(article: Api.Blog.Article) {
  return request<boolean>({
    data: article,
    method: 'post',
    url: '/article/saveDraft'
  });
}

/**
 * 根据ID删除文章
 *
 * @param {number} id - 文章ID
 * @returns 返回操作结果
 */
export function fetchDeleteArticleById(id: number) {
  return request<boolean>({
    method: 'delete',
    url: `/article/delete/${id}`
  });
}

/**
 * 更新文章
 *
 * @param {Api.Blog.Article} article - 文章对象
 * @returns 返回操作结果
 */
export function fetchUpdateArticle(article: Api.Blog.Article) {
  return request<boolean>({
    data: article,
    method: 'put',
    url: '/article/update'
  });
}

/**
 * 批量删除文章
 *
 * @param {number[]} ids - 文章ID数组
 * @returns 返回操作结果
 */
export function fetchBatchDeleteArticle(ids: number[]) {
  return request<boolean>({
    data: { ids },
    method: 'delete',
    url: '/article/delete/batch'
  });
}
