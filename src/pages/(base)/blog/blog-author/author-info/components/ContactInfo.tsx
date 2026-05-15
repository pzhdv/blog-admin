import { Col, Flex, Row, Typography } from 'antd';
import React from 'react';

import IconFont from '@/components/IconFont';

const { Text } = Typography;

interface ContactInfoProps {
  email: string;
  github: string;
  phone: string;
  website: string;
}

interface ContactItemProps {
  icon: string;
  label: string;
  value: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, label, value }) => (
  <Flex
    align="center"
    gap={10}
  >
    <IconFont iconClass={`iconfont ${icon}`} />
    <Flex vertical>
      <Text strong>{label}</Text>
      <Text>{value}</Text>
    </Flex>
  </Flex>
);

const ContactInfo: React.FC<ContactInfoProps> = ({ email, github, phone, website }) => {
  return (
    <Row
      gutter={[16, 16]}
      style={{ marginTop: 16 }}
    >
      <Col span={12}>
        <ContactItem
          icon="icon-email"
          label="email"
          value={email}
        />
      </Col>
      <Col span={12}>
        <ContactItem
          icon="icon-website"
          label="website"
          value={website}
        />
      </Col>
      <Col span={12}>
        <ContactItem
          icon="icon-phone"
          label="phone"
          value={phone}
        />
      </Col>
      <Col span={12}>
        <ContactItem
          icon="icon-github"
          label="github"
          value={github}
        />
      </Col>
    </Row>
  );
};

export default ContactInfo;
