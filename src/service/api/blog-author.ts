// ==================== 博客作者相关接口 ====================

import { request } from '../request';

/**
 * 保存博客作者信息
 *
 * @param {BlogAuthor} blogAuthor - 博客作者对象
 * @returns 返回操作结果
 */
export function fetchSaveBlogAuthor(blogAuthor: Api.Blog.BlogAuthor) {
  return request<boolean>({
    data: blogAuthor,
    method: 'post',
    url: '/blogAuthor/add'
  });
}

/**
 * 更新博客作者信息
 *
 * @param {BlogAuthor} blogAuthor - 博客作者对象
 * @returns 返回操作结果
 */
export function fetchUpdateBlogAuthor(blogAuthor: Api.Blog.BlogAuthor) {
  return request<boolean>({
    data: blogAuthor,
    method: 'put',
    url: '/blogAuthor/update'
  });
}

/**
 * 获取当前博客作者信息
 *
 * @returns 返回博客作者信息
 */
export function fetchGetBlogAuthor() {
  return request<Api.Blog.BlogAuthor>({
    method: 'get',
    url: '/blogAuthor/currentUserInfo'
  });
}
