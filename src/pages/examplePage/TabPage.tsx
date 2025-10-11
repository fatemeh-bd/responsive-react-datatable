import { useState, useMemo, ReactNode } from "react";
import { FaCode, FaRegEye, FaRegCopy } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface TabPageProps {
  view: ReactNode;
  code: any;
  headerImports: string;
}

const TabPage = ({ view, code, headerImports }: TabPageProps) => {
  const [activeTab, setActiveTab] = useState("view");
  const [copied, setCopied] = useState(false);

  const tabs = useMemo(
    () => [
      { title: "Code", value: "code", component: code, icon: <FaCode /> },
      { title: "View", value: "view", component: view, icon: <FaRegEye /> },
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

      codeString = codeString
        .split("\n")
        .filter(
          (line) =>
            !line.trim().startsWith("import") &&
            !line.trim().startsWith("export default")
        )
        .join("\n");

      const finalCode = `${headerImports}\n\n${codeString.trim()}`;

      return (
        <div className="relative">
          <button
            onClick={() => {
              navigator.clipboard.writeText(finalCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className={`${
              copied && "!text-green-400"
            } absolute top-2 right-2 bg-[#364153] hover:bg-[#4b576b] text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition-all duration-150`}
          >
            <FaRegCopy size={14} />
            {copied ? "Copied!" : "Copy"}
          </button>

          <SyntaxHighlighter
            customStyle={{
              fontSize: "0.85rem",
              lineHeight: "1.5",
              borderRadius: "0.5rem",
              paddingTop: "2.5rem",
            }}
            language="tsx"
            style={oneDark}
          >
            {finalCode}
          </SyntaxHighlighter>
        </div>
      );
    }

    return view;
  }, [activeTab, code, view, headerImports, copied]);

  return (
    <div className="flex flex-col max-w-7xl mx-auto overflow-auto mt-8">
      {/* Tabs */}
      <div id="tabId" className="border-b-2 border-[#364153]">
        <div className="flex justify-start gap-1">
          {reversedTabs.map((tab) => (
            <button
              key={tab.value}
              className={`flex items-center gap-2 ${tabStyle} ${
                activeTab === tab.value ? activeTabStyle : inactiveTabStyle
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.title}
              {tab.icon}
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
