import { Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { fetchGetBlogAuthor, fetchGetBlogMission } from '@/service/api';

import BlogMissionCard from './components/BlogMissionCard';
import PersonalInfoCard from './components/PersonalInfoCard';
import BlogAuthorModalForm from './modules/BlogAuthorModalForm';
import BlogMissionModalForm from './modules/BlogMissionModalForm';
import { parseMissionPoints } from './utils/author-utils';

// 用户信息页面
export default function BlogAuthorPage() {
  const [isOpenBlogAuthorModal, setIsOpenBlogAuthorModal] = useState(false);
  const [userProfile, setUserProfile] = useState<Api.Blog.BlogAuthor | null>(null);
  const [isOpenBlogMissionModal, setIsOpenBlogMissionModal] = useState(false);
  const [blogMission, setBlogMission] = useState<Api.Blog.BlogMission | null>(null);
  const [personalInfoLoading, setPersonalInfoLoading] = useState(false);
  const [missionLoading, setMissionLoading] = useState(false);

  // 查询博客作者信息数据
  const queryBlogAuthor = useCallback(async () => {
    setPersonalInfoLoading(true);
    const data = await fetchGetBlogAuthor();
    if (data) {
      setUserProfile(data);
    }
    setPersonalInfoLoading(false);
  }, []);

  // 查询博客使命信息数据
  const queryBlogMission = useCallback(async () => {
    setMissionLoading(true);
    const data = await fetchGetBlogMission();
    if (data) {
      const { missionPointListStr } = data;
      const missionPointList = parseMissionPoints(missionPointListStr);
      setBlogMission({ ...data, missionPointList });
    }
    setMissionLoading(false);
  }, []);

  useEffect(() => {
    queryBlogAuthor();
    queryBlogMission();
  }, [queryBlogAuthor, queryBlogMission]);

  return (
    <>
      <Row
        gutter={10}
        style={{ height: '100%', padding: 16 }}
      >
        <PersonalInfoCard
          loading={personalInfoLoading}
          userProfile={userProfile}
          onEdit={() => setIsOpenBlogAuthorModal(true)}
        />
        <BlogMissionCard
          blogMission={blogMission}
          loading={missionLoading}
          onEdit={() => setIsOpenBlogMissionModal(true)}
        />
      </Row>
      {/* 博客作者信息弹框编辑组件 */}
      <BlogAuthorModalForm
        handleCancel={() => setIsOpenBlogAuthorModal(false)}
        initialData={userProfile || undefined}
        isModalOpen={isOpenBlogAuthorModal}
        onUpdateDataFunc={queryBlogAuthor}
      />
      {/* 博客使命弹框编辑组件 */}
      <BlogMissionModalForm
        handleCancel={() => setIsOpenBlogMissionModal(false)}
        initialData={blogMission || undefined}
        isModalOpen={isOpenBlogMissionModal}
        onUpdateDataFunc={queryBlogMission}
      />
    </>
  );
}
