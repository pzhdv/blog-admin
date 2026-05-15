// ==================== 文章分类相关接口 ====================

import { request } from '../request';

/**
 * 保存文章分类
 *
 * @param {ArticleCategory} articleCategory - 文章分类对象
 * @returns 返回操作结果
 */
export function fetchSaveArticleCategory(articleCategory: Api.Blog.ArticleCategory) {
  return request<boolean>({
    data: articleCategory,
    method: 'post',
    url: '/articleCategory/add'
  });
}

/**
 * 根据ID删除文章分类
 *
 * @param {number} id - 分类ID
 * @returns 返回操作结果
 */
export function fetchDeleteArticleCategoryById(id: number) {
  return request<boolean>({
    method: 'delete',
    url: `/articleCategory/delete/${id}`
  });
}

/**
 * 更新文章分类
 *
 * @param {ArticleCategory} articleCategory - 文章分类对象
 * @returns 返回操作结果
 */
export function fetchUpdateArticleCategory(articleCategory: Api.Blog.ArticleCategory) {
  return request<boolean>({
    data: articleCategory,
    method: 'put',
    url: '/articleCategory/update'
  });
}

/**
 * 查询文章分类树形列表
 *
 * @returns 返回分类树形列表
 */
export function fetchQueryArticleCategoryListTree() {
  return request<Api.Blog.ArticleCategory[]>({
    method: 'get',
    url: '/articleCategory/listTree'
  });
}

/**
 * 查询文章分类总数
 *
 * @returns 文章分类总数
 */
export function fetchQueryArticleCategoryTotal() {
  return request<number>({
    method: 'get',
    url: '/articleCategory/total'
  });
}

/**
 * 查询分类饼图数据
 *
 * @returns 查询分类饼图数据
 */
export function fetchQueryArticleCategoryPieChart() {
  return request<Api.Blog.CategoryPieChart[]>({
    method: 'get',
    url: '/articleCategory/pieChart'
  });
}
