// ==================== 博客使命相关接口 ====================

import { request } from '../request';

/**
 * 保存博客使命
 *
 * @param {BlogMission} blogMission - 博客使命对象
 * @returns 返回操作结果
 */
export function fetchSaveBlogMission(blogMission: Api.Blog.BlogMission) {
  return request<boolean>({
    data: blogMission,
    method: 'post',
    url: '/blogMission/add'
  });
}

/**
 * 更新博客使命
 *
 * @param {BlogMission} blogMission - 博客使命对象
 * @returns 返回操作结果
 */
export function fetchUpdateBlogMission(blogMission: Api.Blog.BlogMission) {
  return request<boolean>({
    data: blogMission,
    method: 'put',
    url: '/blogMission/update'
  });
}

/**
 * 获取博客使命信息
 *
 * @returns 返回博客使命信息
 */
export function fetchGetBlogMission() {
  return request<Api.Blog.BlogMission>({
    method: 'get',
    url: '/blogMission/blogMissionInfo'
  });
}
