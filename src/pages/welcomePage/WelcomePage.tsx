import { useState } from "react";
import { Link } from "react-router-dom";
import previewGif from "../../../table.gif";
const command = "npm install react-responsive-datatable-kit @tanstack/react-query";
export default function WelcomePage() {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(command); setCopied(true); } catch { setCopyFailed(true); } };
  return <div className="site-home">
    <section className="site-home-hero"><div><span className="site-eyebrow">REACT 18 & 19 · VERSION 3.0.0</span><h1>A table that fits<br />your application.</h1>
      <p>Responsive tables, useful controls and clear examples.<br />Start with local rows. Connect your API when you need it.</p>
      <div className="site-home-actions"><Link className="site-primary-button" to="/document/3.0.0">Read the documentation <span aria-hidden="true">↗</span></Link><Link className="site-secondary-button" to="/example">Explore examples</Link></div>
    </div><img className="site-home-logo" src={`${import.meta.env.BASE_URL}logo.png`} alt="React DataTable logo" width="180" height="180" /></section>
    <div className="site-install"><code>{command}</code><button type="button" aria-label="Copy install command" onClick={() => { void copy(); }}>{copyFailed ? "Select to copy" : copied ? "Copied" : "Copy"}</button></div>
    <div className="site-home-features"><div><strong>Three data modes</strong><p>Local data, built-in requests, or your own fetching layer.</p></div><div><strong>Useful by default</strong><p>Search, selection, column controls and expandable details.</p></div><div><strong>Files, ready to share</strong><p>Export CSV, Excel or PDF with the rows you choose.</p></div></div>
    <figure className="site-home-preview"><div><span>DESKTOP TO MOBILE</span><Link to="/document/3.0.0">Try a live example →</Link></div><img src={previewGif} alt="Responsive table demonstration" width="800" height="447" /></figure>
  </div>;
}
