import { FaGithub, FaNpm } from "react-icons/fa";

export default function SidebarFooter() {
  return (
    <div className="mt-auto flex justify-center flex-wrap items-center gap-2 pt-4 border-t border-gray-700">
      {/* GitHub - Fatemeh */}
      <a
        href="https://github.com/fatemeh-bd"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-gray-500 gap-2 hover:text-gray-300"
      >
        <FaGithub className="text-xl" />
        <span className="text-sm">@fatemeh-bd</span>
      </a>

      {/* GitHub - Zephinax */}
      <a
        href="https://github.com/Zephinax"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-gray-500 gap-2 hover:text-gray-300"
      >
        <FaGithub className="text-xl" />
        <span className="text-sm">@Zephinax</span>
      </a>
    </div>
  );
}
