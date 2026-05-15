/* eslint-disable @typescript-eslint/no-unused-vars */
// pnpm add i react-markdown  rehype-sanitize  remark-gfm rehype-external-links react-syntax-highlighter
// pnpm add -D @types/react-syntax-highlighter
import React, { useState } from 'react';
// ReactMarkdown 负责将 Markdown 字符串转换为 React 元素 (最终渲染为 HTML)。
import ReactMarkdown from 'react-markdown';
// HTML 内容清理插件 它会移除潜在的危险内容（如 <script> 标签和 onclick 事件），以防止跨站脚本（XSS）攻击
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import materialLight from 'react-syntax-highlighter/dist/cjs/styles/prism/material-light';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize from 'rehype-sanitize';
// GitHub 风格 Markdown (GFM) 插件
import remarkGfm from 'remark-gfm';
// 外部链接处理插件。
// 主题查看 https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/prism.html

import IconFont from './IconFont';

interface MarkdownRendererProps {
  content: string;
}

interface CodeBlockProps {
  codeString: string;
  language: string;
}

// 代码组件部分
const CodeBlock: React.FC<CodeBlockProps> = ({ codeString, language }) => {
  const [copied, setCopied] = useState(false); // 复制状态

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between rounded-t-xl bg-[#f2f2fe] px-4 py-2">
        <span className="language-tag">{language && language.toLocaleLowerCase()}</span>
        <button
          aria-label="复制代码"
          className="flex items-center justify-center"
          onClick={handleCopy}
        >
          <IconFont
            color={copied ? '#3498db' : 'gray'}
            iconClass="iconfont icon-fuzhi"
            size={16}
          />
        </button>
      </div>
      {/* 代码高亮 */}
      <SyntaxHighlighter
        showLineNumbers
        className="rounded-b-xl rounded-t-0"
        customStyle={{ margin: 0, marginTop: -4 }}
        language={language}
        style={materialLight}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeSanitize]}
      remarkPlugins={[remarkGfm, [rehypeExternalLinks, { rel: ['nofollow'], target: '_blank' }]]}
      components={{
        // 链接
        a: ({ node, ...props }) => (
          <a
            className="break-all text-blue-600 font-medium underline decoration-blue-500/30 underline-offset-2 transition-colors duration-200 hover:text-blue-800 hover:decoration-blue-500"
            rel="noopener noreferrer"
            target="_blank"
            {...props}
          />
        ),
        // 引用
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="my-4 break-words border-l-4 border-blue-500 rounded-r-lg bg-blue-50 py-3 pl-4 pr-3 text-gray-700 italic shadow-sm sm:my-6 sm:py-4 sm:pl-6 sm:pr-4"
            {...props}
          />
        ),
        // 换行
        br: ({ node, ...props }) => (
          <br
            className="block h-4"
            {...props}
          />
        ),
        code({ children, className, inline, node, ...props }: any) {
          // 检查是否是块级代码
          const isBlockCode = className?.includes('language-') || String(children).includes('\n');
          if (isBlockCode) {
            const match = /language-(\w+)/.exec(className || '') || [''];
            return (
              <CodeBlock
                codeString={String(children).replace(/\n$/, '')}
                language={match[1]}
              />
            );
          }
          // 明确处理行内代码
          return (
            <code
              {...props}
              className="p-1 text-orange-500"
            >
              {children}
            </code>
          );
        },
        em: ({ node, ...props }) => (
          <em
            className="italic"
            {...props}
          />
        ),
        // 标题
        h1: ({ node, ...props }) => (
          <h1
            className="mb-5 mt-6 break-words pb-2 text-xl text-gray-900 font-bold first:mt-0 md:text-3xl sm:text-2xl"
            {...props}
          />
        ),

        h2: ({ node, ...props }) => (
          <h2
            className="mb-4 mt-6 break-words border-b border-gray-200 pb-2 text-lg text-gray-800 font-semibold first:mt-0 md:text-2xl sm:text-xl"
            {...props}
          />
        ),

        h3: ({ node, ...props }) => (
          <h3
            className="mb-3 mt-5 break-words text-base text-gray-800 font-semibold first:mt-0 md:text-xl sm:text-lg"
            {...props}
          />
        ),
        h4: ({ node, ...props }) => (
          <h4
            className="mb-3 mt-4 break-words text-sm text-gray-700 font-medium first:mt-0 md:text-lg sm:text-base"
            {...props}
          />
        ),
        h5: ({ node, ...props }) => (
          <h5
            className="mb-2 mt-4 break-words text-sm text-gray-700 font-medium first:mt-0 sm:text-base"
            {...props}
          />
        ),
        h6: ({ node, ...props }) => (
          <h6
            className="mb-2 mt-3 break-words text-xs text-gray-600 font-medium first:mt-0 sm:text-sm"
            {...props}
          />
        ),
        // 分隔线
        hr: ({ node, ...props }) => (
          <hr
            className="my-8 h-px border-0 from-transparent via-gray-300 to-transparent bg-gradient-to-r"
            {...props}
          />
        ),
        // 图片优化
        img: ({ node, ...props }) => (
          <div className="my-6 text-center">
            <img
              className="mx-auto h-auto max-w-full"
              {...props}
            />
          </div>
        ),

        li: ({ node, ...props }) => (
          <li
            className="break-words pl-1 text-sm leading-relaxed sm:pl-2 sm:text-base"
            {...props}
          />
        ),

        ol: ({ depth, node, ...props }: any) => (
          <ol
            className={`list-decimal pl-4 sm:pl-6 mb-4 space-y-1 sm:space-y-2 text-gray-700 break-words ${depth > 0 ? 'ml-2 sm:ml-4' : ''}`}
            {...props}
          />
        ),

        // 段落
        p: ({ node, ...props }) => (
          <p
            className="mb-4 break-words text-sm text-gray-700 leading-relaxed sm:text-base"
            {...props}
          />
        ),

        pre: ({ node, ...props }) => (
          <pre
            className="m-1 max-w-full overflow-x-auto overflow-y-hidden"
            {...props}
          />
        ),

        // 强调文本
        strong: ({ node, ...props }) => (
          <strong
            className="font-semibold"
            {...props}
          />
        ),
        // 表格
        table: ({ node, ...props }) => (
          <div className="mx-3 touch-pan-x overflow-x-auto sm:mx-0">
            <table
              className="my-3 min-w-[600px] w-full border border-gray-200 sm:min-w-0"
              {...props}
            />
          </div>
        ),
        tbody: ({ children, ...props }: any) => (
          <tbody
            {...props}
            className="[&>tr]:border-b [&>tr]:border-gray-200"
          >
            {children}
          </tbody>
        ),
        td: ({ node, ...props }) => (
          <td
            className="border-r border-gray-200 px-4 py-2 last:border-r-0"
            {...props}
          />
        ),
        th: ({ node, ...props }) => (
          <th
            className="border-r border-gray-200 bg-gray-100 px-4 py-2 text-left font-bold"
            {...props}
          />
        ),
        thead: ({ node, ...props }) => (
          <thead
            className="bg-gray-100"
            {...props}
          />
        ),
        tr: ({ children, ...props }: any) => (
          <tr
            {...props}
            className="even:bg-gray-50 odd:bg-white"
          >
            {children}
          </tr>
        ),
        // 列表
        ul: ({ depth, node, ...props }: any) => (
          <ul
            className={`list-disc pl-4 sm:pl-6 mb-4 space-y-1 sm:space-y-2 text-gray-700 break-words ${depth > 0 ? 'ml-2 sm:ml-4' : ''}`}
            {...props}
          />
        )
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
