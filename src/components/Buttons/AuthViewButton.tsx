import { EyeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import AuthBtn from './AuthBtn';
import type { AuthButtonProp } from './type';

/*
 *CRUD 权限查看详情按钮组件
 *上层封装：自带默认【查看详情】文案，children 可选
 *无权限时由底层 AuthBtn 自动隐藏
 */
export default function AuthViewButton(props: AuthButtonProp) {
  const { t } = useTranslation();
  const { auth, children, tooltip, ...rest } = props;
  return (
    <Tooltip title={tooltip}>
      <AuthBtn
        auth={auth}
        color="cyan"
        icon={<EyeOutlined />}
        size="middle"
        variant="solid"
        {...rest}
      >
        {children ?? t('common.view')}
      </AuthBtn>
    </Tooltip>
  );
}
