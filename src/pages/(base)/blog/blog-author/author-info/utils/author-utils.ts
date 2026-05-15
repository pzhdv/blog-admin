import dayjs from 'dayjs';

/**
 * 解析使命要点字符串为数组
 *
 * @param missionPointListStr 使命要点字符串，用 & 分隔
 * @returns 使命要点数组
 */
export const parseMissionPoints = (missionPointListStr: string): Api.Blog.MissionPoint[] => {
  return missionPointListStr
    ? missionPointListStr
        .split('&')
        .filter(Boolean)
        .map(missionPoint => ({ missionPoint }))
    : [];
};

/**
 * 计算年龄
 *
 * @param birthday 生日字符串
 * @returns 年龄或错误信息
 */
export const calculateAge = (birthday: string): number | string => {
  if (!birthday) return '未知';
  const birthDate = dayjs(birthday);
  if (!birthDate.isValid()) return '无效日期';
  const today = dayjs();
  return today.diff(birthDate, 'year');
};
