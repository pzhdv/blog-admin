import { Card, Empty, Flex, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

import IconFont from '@/components/IconFont';
import buttonAuthCode from '@/constants/btn-auth-code';
import { fetchDeleteJobExperienceById, fetchGetJobExperienceList } from '@/service/api';

import JobExperienceModalForm from './modules/JobExperienceModalForm';

const { Text, Title } = Typography;

export default function JobExperiencePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobExperienceList, setJobExperienceList] = useState<Api.Blog.JobExperience[]>([]);
  const [editJobExperience, setEditJobExperience] = useState<Api.Blog.JobExperience | undefined>();

  // 查询列表
  const queryExperienceList = async () => {
    const data = await fetchGetJobExperienceList();

    if (!Array.isArray(data)) return;

    const list = data.map(experience => {
      const achievementList: Api.Blog.Achievement[] =
        experience.achievementListStr?.split('&').map(achievement => ({ achievement })) ?? [];
      return { ...experience, achievementList };
    });

    setJobExperienceList(list);
  };

  useEffect(() => {
    queryExperienceList();
  }, []);

  // 根据id删除
  const deleteJobExperience = async (id: number) => {
    await fetchDeleteJobExperienceById(id);
    queryExperienceList();
  };

  // !编辑
  const handleEdit = (experience: Api.Blog.JobExperience) => {
    setEditJobExperience(experience);
    setIsModalOpen(true);
  };

  // !取消
  const handleCancel = () => {
    setEditJobExperience(undefined);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        title={<Title level={4}>🚀 经历与成就</Title>}
        extra={
          <AuthAddButton
            auth={buttonAuthCode.blog.experience.add}
            tooltip="添加工作经历"
            onClick={() => setIsModalOpen(true)}
          />
        }
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
        styles={{
          body: {
            flex: 1,
            overflowY: 'auto'
          }
        }}
      >
        {jobExperienceList && jobExperienceList.length > 0 ? (
          <Flex
            vertical
            gap={20}
          >
            {/* 列表 */}
            {jobExperienceList.map(experience => (
              <Card
                key={experience.id}
                type="inner"
                extra={
                  <Space>
                    <AuthEditButton
                      auth={buttonAuthCode.blog.experience.edit}
                      onClick={() => handleEdit(experience)}
                    />

                    <AuthDeleteButton
                      auth={buttonAuthCode.blog.experience.delete}
                      tooltip="删除工作经历"
                      onClick={() => deleteJobExperience(experience.id as number)}
                    />
                  </Space>
                }
                title={
                  <Flex
                    align="center"
                    gap={5}
                  >
                    <IconFont
                      iconClass={experience.titleIcon}
                      size={20}
                    />
                    <Title
                      level={5}
                      style={{ margin: 0 }}
                    >
                      {experience.title}
                    </Title>
                  </Flex>
                }
              >
                <Flex
                  vertical
                  gap={10}
                >
                  <Text strong>
                    {experience.organization} · {experience.timeRange}
                  </Text>
                  <Flex
                    vertical
                    gap={4}
                  >
                    {experience.achievementList.map((experienceItem, index) => (
                      <Text
                        key={index}
                        style={{ marginLeft: 5 }}
                      >
                        ● {experienceItem.achievement}
                      </Text>
                    ))}
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        ) : (
          <Empty />
        )}
      </Card>
      <JobExperienceModalForm
        handleCancel={handleCancel}
        initialData={editJobExperience}
        isModalOpen={isModalOpen}
        onUpdateDataFunc={queryExperienceList}
      />
    </>
  );
}
