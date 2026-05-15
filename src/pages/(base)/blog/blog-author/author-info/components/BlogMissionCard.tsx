import { Card, Col, Empty, Flex, Typography } from 'antd';
import React from 'react';

import buttonAuthCode from '@/constants/btn-auth-code';

const { Text, Title } = Typography;

interface BlogMissionCardProps {
  blogMission: Api.Blog.BlogMission | null;
  loading?: boolean;
  onEdit: () => void;
}

const BlogMissionCard: React.FC<BlogMissionCardProps> = ({ blogMission, loading = false, onEdit }) => {
  return (
    <Col span={12}>
      <Card
        loading={loading}
        title="博客描述"
        extra={
          blogMission ? (
            <AuthEditButton
              auth={buttonAuthCode.blog.author.descEdit}
              tooltip="编辑博客描述"
              onClick={onEdit}
            />
          ) : (
            <AuthAddButton
              auth={buttonAuthCode.blog.author.descAdd}
              tooltip="添加博客描述"
              onClick={onEdit}
            />
          )
        }
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {blogMission ? (
          <Flex
            vertical
            gap={10}
          >
            <Title level={4}>{blogMission.missionTitle}</Title>
            <Text strong>{blogMission.missionDescription}</Text>
            <Flex
              vertical
              gap={10}
            >
              {blogMission.missionPointList &&
                blogMission.missionPointList.map((item, index) => <Text key={index}>{item.missionPoint}</Text>)}
            </Flex>
          </Flex>
        ) : (
          <Empty />
        )}
      </Card>
    </Col>
  );
};

export default BlogMissionCard;
