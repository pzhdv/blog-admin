import type { FC } from 'react';
// 导入icon样式
// import '@/assets/fonts/iconfont/iconfont.css'  入口文件导入

interface IProps {
  color?: string;
  iconClass: string;
  size?: number;
}
// 字体组件
const IconFont: FC<IProps> = props => {
  return (
    <div style={{ color: props.color || '#1677ff' }}>
      <i
        className={props.iconClass}
        style={{ fontSize: props.size || 28 }}
      />
    </div>
  );
};

export default IconFont;
