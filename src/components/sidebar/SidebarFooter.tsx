import { FaGithub } from "react-icons/fa";

export default function SidebarFooter() {
  return (
    <div className="site-sidebar-footer">
      {/* GitHub - Fatemeh */}
      <a
        href="https://github.com/fatemeh-bd"
        target="_blank"
        rel="noopener noreferrer"
        className="site-author"
      >
        <FaGithub className="text-xl" />
        <span className="text-sm">@fatemeh-bd</span>
      </a>
    </div>
  );
}
