import React from "react";
import { EChartsDirective } from "./directives/echarts";
import { CodeBlock } from "./code";

export const getComponents = (msg: any) => ({
  code: CodeBlock,
  pre: ({ node, ...props }: any) => {
    const isCode = props.children.props.node.tagName === "code";
    return (
      <pre {...props}>
        <CodeBlock {...props.children.props} inline={!isCode} />
      </pre>
    );
  },
  echarts: (props: any) => {
    return <EChartsDirective {...props} />;
  },
  hidden: () => {
    return null;
  },
  a: ({ node, children, ...props }: any) => {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
        {...props}
      >
        {children}
      </a>
    );
  },
  table: ({ node, children, ...props }: any) => {
    return (
      <div className="overflow-x-auto py-0 mb-3">
        <table
          {...props}
          className="divide-y rounded divide-gray-200 bg-white shadow-sm overflow-hidden text-xs w-full min-w-max table-auto text-left"
          style={{ width: "max-content" }}
        >
          {children}
        </table>
      </div>
    );
  },
  th: ({ node, children, ...props }: any) => {
    return (
      <th {...props} className="border-b border-gray-100 bg-gray-50 p-3">
        {children}
      </th>
    );
  },
  td: ({ node, children, ...props }: any) => {
    return (
      <td
        {...props}
        className="px-3 py-2 border-b border-gray-50 max-w-36 truncate"
      >
        {children}
      </td>
    );
  },
});
