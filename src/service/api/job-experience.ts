// ==================== 工作经历相关接口 ====================

import { request } from '../request';

/**
 * 保存工作经历
 *
 * @param {JobExperience} jobExperience - 工作经历对象
 * @returns 返回操作结果
 */
export function fetchSaveJobExperience(jobExperience: Api.Blog.JobExperience) {
  return request<boolean>({
    data: jobExperience,
    method: 'post',
    url: '/jobExperience/add'
  });
}

/**
 * 根据ID删除工作经历
 *
 * @param {number} id - 工作经历ID
 * @returns 返回操作结果
 */
export function fetchDeleteJobExperienceById(id: number) {
  return request<boolean>({
    method: 'delete',
    url: `/jobExperience/delete/${id}`
  });
}

/**
 * 更新工作经历
 *
 * @param {JobExperience} jobExperience - 工作经历对象
 * @returns 返回操作结果
 */
export function fetchUpdateJobExperience(jobExperience: Api.Blog.JobExperience) {
  return request<boolean>({
    data: jobExperience,
    method: 'put',
    url: '/jobExperience/update'
  });
}

/**
 * 获取工作经历列表
 *
 * @returns 返回工作经历列表
 */
export function fetchGetJobExperienceList() {
  return request<Api.Blog.JobExperience[]>({
    method: 'get',
    url: '/jobExperience/list'
  });
}
