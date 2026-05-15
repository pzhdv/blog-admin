// pnpm add react-markdown-editor-lite markdown-it highlight.js
// pnpm add @types/markdown-it -D
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import React, { useEffect, useRef, useState } from 'react';
// 参数配置：https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/docs/configure.zh-CN.md
import MdEditor from 'react-markdown-editor-lite';

import 'react-markdown-editor-lite/lib/index.css';
// 可以去 https://highlightjs.org/examples 查看样式效果导入主题样式 去highlight.js/styles里面选一个自己喜欢的
import 'highlight.js/styles/github.css';
import { ImageBeforeUploadValidate } from '@/components/UploadImage/validate';
import { fetchUploadFileInterface } from '@/service/api';

// 初始化支持代码高亮的 Markdown 解析器
const mdParser = new MarkdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { ignoreIllegals: true, language: lang }).value;
      } catch {
        // 忽略高亮错误
      }
    }
    return '';
  },
  html: true,
  linkify: true,
  typographer: true
});

interface MarkdownEditorProps {
  /** 限制上传图片文件大小 默认 2MB */
  fileSize?: number;
  /** 内容变化时触发 该函数会在内容变化时被调用，传入当前的 Markdown 文本内容。 */
  onChange?: (value: string) => void;
  /** 渲染的内容 */
  value?: string;
}

/** MarkDown编辑组件 */
const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ fileSize = 2, onChange, value = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState(400);

  // 监听容器高度变化 自适应高度
  useEffect(() => {
    if (!containerRef.current) return undefined;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        setEditorHeight(height);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // !todo 处理图片文件上传
  const handleUpload = async (file: File) => {
    const validationResult = ImageBeforeUploadValidate(file, fileSize);
    if (validationResult !== true) {
      window.$message?.error({ content: validationResult });
      return '';
    }

    try {
      const data = await fetchUploadFileInterface(file);

      if (data && data.success) {
        return data.fileUrl;
      }
      return '';
    } catch (error: any) {
      window.$message?.error({ content: error.message || '图片上传失败' });
      return '';
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%'
      }}
    >
      <MdEditor
        placeholder="请在此处编写文章内容"
        renderHTML={text => mdParser.render(text)}
        style={{ height: editorHeight }}
        value={value}
        onChange={({ text }) => onChange?.(text)}
        onImageUpload={handleUpload}
      />
    </div>
  );
};

export default MarkdownEditor;
