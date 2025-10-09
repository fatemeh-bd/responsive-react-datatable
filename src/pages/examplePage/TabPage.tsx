import { useState, useMemo, ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface TabPageProps {
  view: ReactNode;
  code: any;
  headerImports: string;
}

const TabPage = ({ view, code, headerImports }: TabPageProps) => {
  const [activeTab, setActiveTab] = useState("view");

  const tabs = useMemo(
    () => [
      { title: "Code", value: "code", component: code },
      { title: "View", value: "view", component: view },
    ],
    [view, code]
  );

  const reversedTabs = useMemo(() => [...tabs].reverse(), [tabs]);

  const tabStyle =
    "py-2 px-4 rounded-t-lg transition-colors duration-200 cursor-pointer";
  const activeTabStyle = "bg-[#364153] text-[#d24670] font-bold";
  const inactiveTabStyle = "hover:bg-[#364153]";

  const activeTabComponent = useMemo(() => {
    if (activeTab === "code") {
      let codeString = String(code);

      // حذف خطوط import و export
      codeString = codeString
        .split("\n")
        .filter(
          (line) =>
            !line.trim().startsWith("import") &&
            !line.trim().startsWith("export default")
        )
        .join("\n");

      return (
        <SyntaxHighlighter
          customStyle={{
            fontSize: "0.85rem",
            lineHeight: "1.5",
          }}
          language="tsx"
          style={oneDark}
        >
          {`${headerImports}\n\n${codeString.trim()}`}
        </SyntaxHighlighter>
      );
    }
    return view;
  }, [activeTab, code, view]);

  return (
    <div
      id="content-wrapper"
      className="flex flex-col max-w-7xl mx-auto overflow-auto mt-8"
    >
      {/* Tabs */}
      <div id="tabId" className="border-b-2 border-[#364153]">
        <div className="flex justify-start gap-1">
          {reversedTabs.map((tab) => (
            <button
              key={tab.value}
              className={`${tabStyle} ${
                activeTab === tab.value ? activeTabStyle : inactiveTabStyle
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="mt-4">{activeTabComponent}</div>
    </div>
  );
};

export default TabPage;
