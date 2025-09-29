import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { FaBook } from "react-icons/fa";

const GithubReadmeFetcher = ({ readmeUrl }: { readmeUrl: string }) => {
  const [readme, setReadme] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReadme = async () => {
    try {
      setLoading(true);
      setError(null);

      const rawUrl = readmeUrl
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/");

      const response = await fetch(rawUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch README: ${response.status}`);
      }

      const content = await response.text();
      setReadme(content);
    } catch (err: any) {
      console.error("Failed to fetch README:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadme();
  }, [readmeUrl]);

  if (loading) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-8 text-center border border-gray-700">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-300">Loading Documentation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
        <p className="text-red-300 mb-4">Failed to load README: {error}</p>
        <button
          onClick={fetchReadme}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/30 rounded-lg border border-gray-700 overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-gray-700 bg-gray-800/50">
        <FaBook className="w-4 h-4 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Documentation</h3>
      </div>
      <div className="p-6 overflow-y-auto prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-white mb-4 text-center">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold text-white mt-6 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-medium text-white mt-4 mb-2">
                {children}
              </h3>
            ),
            p: ({ children, ...props }) => (
              <p
                className={`text-gray-300 mb-3 leading-relaxed flex items-center justify-center gap-2 ${
                  props.style?.textAlign === "center" ? "text-center" : ""
                }`}
                {...props}
              >
                {children}
              </p>
            ),
            a: ({ href, children, target }) => (
              <a
                href={href}
                className="text-blue-400 hover:underline"
                target={target || "_blank"}
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <div className="text-center my-6">
                <img
                  src={src}
                  alt={alt}
                  className="mx-auto max-w-full h-auto rounded-lg"
                />
              </div>
            ),
            code: ({ children, className }) => {
              const isBlock = className?.includes("language-");
              return isBlock ? (
                <pre className="bg-gray-800 p-4 rounded-lg border border-gray-700 overflow-x-auto my-4">
                  <code className="text-pink-300 text-sm">{children}</code>
                </pre>
              ) : (
                <code className="text-pink-300 bg-gray-800 px-1 py-0.5 rounded text-sm">
                  {children}
                </code>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 text-gray-300 italic my-4">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-gray-300 mb-3 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside text-gray-300 mb-3 space-y-1">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="text-gray-300">{children}</li>,
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-gray-700">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-gray-700 px-3 py-2 bg-gray-800 text-white font-semibold text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-700 px-3 py-2 text-gray-300">
                {children}
              </td>
            ),
            strong: ({ children }) => (
              <strong className="text-white font-semibold">{children}</strong>
            ),
            br: () => <br />,
          }}
        >
          {readme}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default GithubReadmeFetcher;
