import {
  AtomIcon,
  CheckCircleIcon,
  CircleEllipsisIcon,
  CircleXIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { DataAnalysisMessage, type NodeStatus } from "./model";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { MessagePart } from "./parts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { debounce } from "lodash-es";

const IconMap: Record<NodeStatus, React.ReactNode> = {
  pending: <CircleEllipsisIcon className="w-4 h-4" />,
  completed: <CheckCircleIcon className="w-4 h-4" />,
  running: <LoaderCircleIcon className="w-4 h-4 animate-spin" />,
  failed: <CircleXIcon className="w-4 h-4" />,
};

export function AnalysisSteps(props: {
  message: DataAnalysisMessage;
}) {
  const message = props.message;
  const steps = message.steps;
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScroll = useRef(true); // 默认开启自动滚动

  const mainContainer = useRef<HTMLDivElement>(null);

  const activateNode = useCallback((index: number) => {
    setCurrentIndex(index);
    const node: HTMLDivElement | null = mainContainer.current?.querySelector(
      `#step-node-${index}`
    ) as HTMLDivElement | null;
    if (!node) {
      return;
    }

    mainContainer.current?.scrollTo({
      top: node.offsetTop - 20,
      behavior: "smooth",
    });
  }, []);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (!mainContainer.current || !autoScroll.current) return;

    const container = mainContainer.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  // 使用debounce处理的滚动到底部函数
  const debouncedScrollToBottom = useCallback(
    debounce(scrollToBottom, 200),
    [scrollToBottom]
  );

  // 监听用户滚动事件
  useEffect(() => {
    const container = mainContainer.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // 如果用户向上滚动，则停止自动滚动
      if (scrollTop < scrollHeight - clientHeight - 50) {
        autoScroll.current = false;
      }

      // 如果用户滚动到底部，重新启用自动滚动
      if (scrollTop >= scrollHeight - clientHeight - 10) {
        autoScroll.current = true;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 监听内容高度变化，自动滚动到底部
  useEffect(() => {
    const container = mainContainer.current;
    if (!container) return;

    // 记录上一次的scrollHeight
    let prevScrollHeight = container.scrollHeight;

    // 创建一个定时器来检查scrollHeight的变化
    const checkScrollHeightChange = () => {
      if (!container) return;

      const currentScrollHeight = container.scrollHeight;
      // 如果可滚动高度增加，则触发滚动
      if (currentScrollHeight > prevScrollHeight) {
        prevScrollHeight = currentScrollHeight;
        debouncedScrollToBottom();
      }
    };

    // 使用MutationObserver监听内容变化
    const observer = new MutationObserver(() => {
      checkScrollHeightChange();
    });

    // 监听容器内容变化
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // 定期检查scrollHeight变化，以防MutationObserver没有捕获到的变化
    const intervalId = setInterval(checkScrollHeightChange, 500);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [debouncedScrollToBottom]);

  useEffect(() => {
    activateNode(steps.length - 1);
  }, [steps.length, activateNode]);

  return (
    <div className="bg-gray-50 rounded-md w-full relative text-sm text-gray-600 flex border border-gray-200 overflow-hidden">
      <aside className="basis-1/3 max-w-[200px] shrink-0 py-3 px-4 max-h-80 overflow-y-auto border border-l-0 border-t-0 border-b-0 border-gray-200">
        <nav className="group my-4">
          <ol className="flex flex-col gap-2" aria-orientation="vertical">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              const isCurrent = index === currentIndex;
              return (
                <>
                  <li
                    key={`${index}_top`}
                    className={clsx(
                      "flex items-center gap-4 flex-shrink-0 cursor-pointer hover:opacity-90",
                      {
                        "opacity-100": isCurrent,
                        "opacity-60": !isCurrent,
                      }
                    )}
                    onClick={() => activateNode(index)}
                  >
                    <span className="icon">{IconMap[step.status]}</span>
                    <span className="title">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="line-clamp-2">{step.title}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="break-all max-w-3xs">{step.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                  {!isLast && (
                    <div key={`${index}_bottom`} className="flex gap-4">
                      <div
                        className="flex justify-center"
                        style={{
                          paddingInlineStart: "0.5rem",
                        }}
                      >
                        <div
                          data-orientation="vertical"
                          role="none"
                          className="shrink-0 w-[2px] h-full bg-gray-300"
                        ></div>
                      </div>
                      <div className="flex-1 my-4"></div>
                    </div>
                  )}
                </>
              );
            })}
          </ol>
        </nav>
      </aside>
      <main
        className="basis-2/3 flex-1 bg-white py-3 px-4 max-h-80 overflow-y-auto"
        ref={mainContainer}
      >
        <div className="prose prose-slate prose-sm text-sm prose-ol:my-1 prose-ul:my-1 prose-p:my-1 prose-li:leading-5 text-medium break-words">
          {steps.map((step, index) => {
            if (step.status === "pending") {
              return null;
            }
            return (
              <div
                key={index}
                className="step-node-container"
                id={`step-node-${index}`}
              >
                <h2
                  className={clsx(
                    "step-node-title flex items-center gap-1 text-base",
                    {
                      "mt-0": index === 0,
                      "mt-10": index !== 0,
                    }
                  )}
                >
                  <AtomIcon className="w-4 h-4" />
                  {step.title}
                </h2>
                <div className="step-node-content">
                  {step.content.map((part, i) => {
                    if (part.type === "step-start") {
                      return null;
                    }
                    return (
                      <div
                        className={`message-part part-${part.type}`}
                        key={i}
                      >
                        <MessagePart
                          message={message}
                          part={part}
                          addToolResult={() => {}}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
