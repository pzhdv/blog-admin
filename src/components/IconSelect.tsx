/* eslint-disable react/prop-types */
import { SearchOutlined } from '@ant-design/icons';
import { Empty, Input, Select } from 'antd';
import { useMemo, useState } from 'react';

import icons from '@/assets/fonts/iconfont/iconfont.json';

// 导入icon样式 入口文件导入
// import '@/assets/fonts/iconfont/iconfont.css'

let iconList: string[] = [];
const glyphs = icons.glyphs;
if (glyphs && Array.isArray(glyphs)) {
  iconList = glyphs.map((glyph: any) => `iconfont ${icons.css_prefix_text}${glyph.font_class}`);
}

// 样式对象
const styles = {
  iconClass: {
    color: '#666',
    fontSize: '12px',
    lineHeight: '1.2',
    textAlign: 'center' as const,
    wordBreak: 'break-word' as const
  },
  iconGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '12px',
    maxHeight: '300px',
    overflowY: 'auto' as const,
    padding: '12px 8px'
  },
  iconItem: {
    alignItems: 'center',
    border: '1px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '4px',
    transition: 'all 0.2s'
  },
  iconItemHover: {
    backgroundColor: '#f5f5f5'
  },
  iconItemIcon: {
    fontSize: '24px',
    marginBottom: '4px'
  },
  iconItemSelected: {
    backgroundColor: '#e6f7ff',
    borderColor: '#91d5ff'
  },
  iconSelectDropdown: {
    boxShadow:
      '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    padding: '8px'
  },
  searchBox: {
    borderBottom: '1px solid #f0f0f0',
    padding: '8px'
  },
  selectedIcon: {
    alignItems: 'center',
    display: 'flex',
    gap: '8px'
  },
  selectedIconIcon: {
    fontSize: '16px'
  }
};

interface IconSelectProps {
  onChange?: (className: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  value?: string;
}

const IconSelect: React.FC<IconSelectProps> = ({
  onChange,
  placeholder = '选择图标',
  searchPlaceholder = '搜索图标...',
  value
}) => {
  const iconListData = iconList;
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  // 过滤逻辑
  const filteredIcons = useMemo(() => {
    return iconListData.filter(icon => icon.toLowerCase().includes(searchText.toLowerCase()));
  }, [iconListData, searchText]);

  const handleDropdownVisibleChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchText(''); // 关闭时清空搜索
    }
  };

  return (
    <Select
      open={open}
      placeholder={placeholder}
      style={{ width: '100%' }}
      value={value}
      dropdownRender={() => (
        <div style={styles.iconSelectDropdown}>
          <div style={styles.searchBox}>
            <Input
              placeholder={searchPlaceholder}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>

          <div style={styles.iconGrid}>
            {filteredIcons.map(className => (
              <div
                key={className}
                title={className}
                style={{
                  ...styles.iconItem,
                  ...(value === className ? styles.iconItemSelected : {})
                }}
                onClick={() => {
                  onChange?.(className);
                  setOpen(false);
                }}
                onMouseEnter={e => {
                  if (value !== className) {
                    e.currentTarget.style.backgroundColor = styles.iconItemHover.backgroundColor;
                  }
                }}
                onMouseLeave={e => {
                  if (value !== className) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <i
                  className={className}
                  style={styles.iconItemIcon}
                />
              </div>
            ))}

            {filteredIcons.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </div>
        </div>
      )}
      onDropdownVisibleChange={handleDropdownVisibleChange}
    >
      {value && (
        <Select.Option value={value}>
          <div style={styles.selectedIcon}>
            <i
              className={value}
              style={styles.selectedIconIcon}
            />
          </div>
        </Select.Option>
      )}
    </Select>
  );
};

export default IconSelect;
