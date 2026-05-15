// ==================== 文章标签相关接口 ====================

import { request } from '../request';

/**
 * 保存文章标签
 *
 * @param {ArticleTag} articleTag - 文章标签对象
 * @returns 返回操作结果
 */
export function fetchSaveArticleTag(articleTag: Api.Blog.ArticleTag) {
  return request<boolean>({
    data: articleTag,
    method: 'post',
    url: '/articleTag/add'
  });
}

/**
 * 根据ID删除文章标签
 *
 * @param {number} id - 标签ID
 * @returns 返回操作结果
 */
export function fetchDeleteArticleTagById(id: number) {
  return request<boolean>({
    method: 'delete',
    url: `/articleTag/delete/${id}`
  });
}

/**
 * 更新文章标签
 *
 * @param {ArticleTag} articleTag - 文章标签对象
 * @returns 返回操作结果
 */
export function fetchUpdateArticleTag(articleTag: Api.Blog.ArticleTag) {
  return request<boolean>({
    data: articleTag,
    method: 'put',
    url: '/articleTag/update'
  });
}

/**
 * 查询文章标签列表
 *
 * @returns 返回标签列表
 */
export function fetchQueryArticleTagList() {
  return request<Api.Blog.ArticleTag[]>({
    method: 'get',
    url: '/articleTag/list'
  });
}

/**
 * 查询文章标签总数
 *
 * @returns 返回标签总数
 */
export function fetchQueryArticleTagTotal() {
  return request<number>({
    method: 'get',
    url: '/articleTag/total'
  });
}
