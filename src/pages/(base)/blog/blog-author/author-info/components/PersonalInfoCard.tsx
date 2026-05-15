import { Avatar, Card, Col, Empty, Flex, Typography } from 'antd';
import React from 'react';

import IconFont from '@/components/IconFont';
import buttonAuthCode from '@/constants/btn-auth-code';

import { calculateAge } from '../utils/author-utils';

import ContactInfo from './ContactInfo';

const { Text, Title } = Typography;

interface PersonalInfoCardProps {
  loading?: boolean;
  onEdit: () => void;
  userProfile: Api.Blog.BlogAuthor | null;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ loading = false, onEdit, userProfile }) => {
  return (
    <Col span={12}>
      <Card
        loading={loading}
        title="个人信息"
        extra={
          userProfile ? (
            <AuthEditButton
              auth={buttonAuthCode.blog.author.infoEdit}
              tooltip="编辑个人信息"
              onClick={onEdit}
            />
          ) : (
            <AuthAddButton
              auth={buttonAuthCode.blog.author.infoAdd}
              tooltip="添加个人信息"
              onClick={onEdit}
            />
          )
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
        {userProfile ? (
          <Flex
            vertical
            style={{ marginRight: 15 }}
          >
            {/* 用户头像和基本信息 */}
            <Flex
              vertical
              align="center"
            >
              <Avatar
                size={64}
                src={userProfile.avatar}
              />
              <Title
                level={4}
                style={{ marginBottom: 0, marginTop: 10 }}
              >
                {userProfile.fullName}
              </Title>

              <Flex
                align="center"
                gap={5}
              >
                <IconFont iconClass="iconfont icon-user" />
                <Title
                  level={5}
                  style={{ margin: 0 }}
                >
                  {userProfile.position}
                </Title>
              </Flex>

              <Flex
                justify="space-around"
                style={{ marginBottom: 5, marginTop: 5, width: '100%' }}
              >
                <Text>昵称: {userProfile.userNick}</Text>
                <Text>年龄: {calculateAge(userProfile.birthday)}</Text>
                <Text>学历: {userProfile.educationLevel}</Text>
                <Text>毕业院校: {userProfile.schoolName}</Text>
              </Flex>
            </Flex>

            {/* 联系信息 */}
            <ContactInfo
              email={userProfile.email}
              github={userProfile.github}
              phone={userProfile.phone}
              website={userProfile.website}
            />

            {/* 个人简介 */}
            <Flex
              style={{
                marginTop: 10,
                textAlign: 'center'
              }}
            >
              <Text type="success">{userProfile.selfIntroduction}</Text>
            </Flex>
          </Flex>
        ) : (
          <Empty />
        )}
      </Card>
    </Col>
  );
};

export default PersonalInfoCard;
