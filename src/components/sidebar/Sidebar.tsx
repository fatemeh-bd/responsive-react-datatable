import { useState } from "react";
import { NavLink } from "react-router-dom";
import { CgMenuRight } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { routes } from "../../routes";
import { useQueryParams } from "../table/hooks/useQueryParams";
import SidebarFooter from "./SidebarFooter";
const logo = `${import.meta.env.BASE_URL}logo.png`;
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { setParams } = useQueryParams();
  const close = () => setOpen(false);
  return <>
    <header className="site-mobile-header"><NavLink to="/" onClick={close} className="site-mobile-brand"><img src={logo} alt="React DataTable logo" width="36" height="36" /><span>React DataTable</span></NavLink>
      <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(value => !value)}>{open ? <IoClose size={24} /> : <CgMenuRight size={24} />}</button></header>
    <div className="site-side-shell" data-open={open}><aside id="site-navigation" className="site-sidebar">
      <NavLink to="/" className="site-brand" onClick={close}><img src={logo} alt="React DataTable logo" width="64" height="64" /><span>React DataTable<small>Responsive DataTable Kit</small></span></NavLink>
      <nav className="site-nav" aria-label="Site navigation">{routes.map((route, index) => <div className="site-nav-group" key={route.path || index}>
        {route.path ? <NavLink end={route.path === "/"} to={route.path} onClick={close} className={({ isActive }) => `site-nav-link${isActive ? " is-active" : ""}`}>
          <span>{route.name}</span>{route.icon && <route.icon size={18} />}</NavLink> : <span className="site-nav-label">{route.name}</span>}
        {route.children && <div className="site-subnav">{route.children.map(child => <NavLink key={child.path} to={child.path} className={({ isActive }) => `site-subnav-link${isActive ? " is-active" : ""}`}
          onClick={() => { close(); setParams({ page: null, pageSize: null }); }}>{child.name}</NavLink>)}</div>}
      </div>)}</nav><SidebarFooter />
    </aside></div>
  </>;
}
