import { isValidElement, useState, type ReactElement, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import { monochromeCodeTheme } from "../../components/codeTheme";
import manifest from "../../../docs/versions/index.json";
import pkg from "../../../package.json";
import previewGif from "../../../table.gif";
import FeatureTable from "../examplePage/FeatureTable";
import type { TableTheme } from "../../components/table/types";
import "./documentation.css";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("ts", tsx);
SyntaxHighlighter.registerLanguage("jsx", tsx);
SyntaxHighlighter.registerLanguage("sh", bash);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("css", css);
interface Recipe { id: string; title: string; summary: string; preview?: string; sections: string[]; code?: string; extraCode?: string; note?: string; }
interface RecipeData { recipes: Recipe[]; highlights: string[]; }
const guides = import.meta.glob<string>("../../../docs/versions/*.md", { query: "?raw", import: "default", eager: true });
const examples = import.meta.glob<RecipeData>("../../../docs/versions/*.examples.json", { import: "default", eager: true });
function CodeBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setFailed(false); }
    catch { setFailed(true); }
  };
  return <div className="docs-code"><div className="docs-code-bar"><span>{language.toUpperCase()}</span>
    <button type="button" onClick={() => { void copy(); }} aria-label="Copy code">{failed ? "Select code to copy" : copied ? "Copied" : "Copy code"}</button></div>
    <SyntaxHighlighter language={language} style={monochromeCodeTheme} customStyle={{ margin: 0, background: "#f7f7f7", padding: 22, fontSize: 15 }}>{code}</SyntaxHighlighter>
  </div>;
}
function Markdown({ text }: { text: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    pre: ({ children }) => {
      const element = isValidElement(children) ? children as ReactElement<{ children?: ReactNode; className?: string }> : null;
      return <CodeBlock code={String(element?.props.children ?? children).replace(/\n$/, "")} language={element?.props.className?.replace("language-", "") || "tsx"} />;
    },
    table: ({ children }) => <div className="docs-table-scroll"><table>{children}</table></div>,
    a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer">{children}</a>,
  }}>{text}</ReactMarkdown>;
}
export default function DocumentPage() {
  const { version: requestedVersion } = useParams();
  const version = requestedVersion || manifest.current;
  const known = manifest.versions.some(entry => entry.version === version);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("start");
  const [view, setView] = useState<"preview" | "code">("code");
  const [changes, setChanges] = useState(false);
  const [theme, setTheme] = useState<TableTheme>("#ffffff");
  const data = examples[`../../../docs/versions/${version}.examples.json`];
  const recipes = data?.recipes || [];
  const matching = recipes.filter(recipe => `${recipe.title} ${recipe.summary} ${recipe.code || ""}`.toLowerCase().includes(query.toLowerCase()));
  const selected = matching.find(recipe => recipe.id === selectedId) || matching[0];
  const canPreview = known && version === pkg.version && !!selected?.preview;
  const preview = view === "preview" && canPreview;
  const guide = guides[`../../../docs/versions/${version}.md`] || "";
  const guideSections = guide.split(/(?=^## )/m).filter(section => section.startsWith("## "));
  const reference = guideSections.filter(section => selected?.sections.includes(section.split(/\r?\n/)[0].slice(3)));
  const selectRecipe = (recipe: Recipe) => { setSelectedId(recipe.id); setChanges(false); setView(recipe.preview && version === pkg.version ? "preview" : "code"); };
  return <div className="docs-page">
    <div className="docs-intro"><header className="docs-heading">
      <span className="docs-eyebrow">REACT RESPONSIVE DATATABLE KIT</span>
      <h1>Documentation</h1><p>Pick a feature. Try the example. Copy the code.</p>
      <div className="docs-version-control"><label htmlFor="docs-version">Version</label>
        <select id="docs-version" value={known ? version : ""} onChange={event => { setQuery(""); navigate(`/document/${event.target.value}`); }}>
          {!known && <option value="">Unavailable</option>}
          {manifest.versions.map(entry => <option key={entry.version} value={entry.version}>{entry.version}{entry.version === manifest.current ? " · current" : " · archived"}</option>)}
        </select><button type="button" onClick={() => setChanges(value => !value)}>{changes ? "Back to examples" : "What's changed?"}</button>
      </div><span className="docs-version-help">Match this to <code>npm ls react-responsive-datatable-kit</code></span>
    </header><figure className="docs-gif"><img src={previewGif} alt="Animated table preview showing search, sorting and pagination" width="800" height="447" />
      <figcaption>The original table preview</figcaption></figure></div>
    {!known || !data ? <div className="docs-empty"><h2>This version has no guide here.</h2><p>Select an available version. Other versions are never substituted.</p></div> :
    <div className="docs-layout"><aside className="docs-navigation"><label className="docs-search"><span className="docs-visually-hidden">Search examples</span>
      <input type="search" value={query} placeholder="Find a feature…" onChange={event => { setQuery(event.target.value); setChanges(false); }} /></label>
      <nav aria-label="Documentation examples">{matching.map(recipe => <button key={recipe.id} type="button" aria-current={!changes && selected?.id === recipe.id ? "page" : undefined}
        onClick={() => selectRecipe(recipe)}>{recipe.title}</button>)}</nav>
      <p>Version <strong>{version}</strong></p></aside>
      <article className="docs-recipe" aria-label={`Documentation ${version}`}>
        {changes ? <><div className="docs-recipe-heading"><span className="docs-kicker">RELEASE NOTES</span><h2>What's new in {version}</h2></div>
          <ul className="docs-highlights">{data.highlights.map(item => <li key={item}>{item}</li>)}</ul>
          <details className="docs-reference"><summary>Full change notes</summary><div className="docs-reference-content"><Markdown text={guides[`../../../docs/versions/${version}.changes.md`] || ""} /></div></details></> :
        !selected ? <div className="docs-empty"><h2>No matching examples</h2><button type="button" onClick={() => setQuery("")}>Clear search</button></div> : <>
          <div className="docs-recipe-heading"><span className="docs-kicker">EXAMPLE · {version}</span><h2>{selected.title}</h2><p>{selected.summary}</p></div>
          {selected.id === "start" && <div className="docs-install"><CodeBlock language="sh" code="npm install react-responsive-datatable-kit @tanstack/react-query" /></div>}
          {selected.code && <><div className="docs-example-toolbar"><div className="docs-view-tabs" role="group" aria-label="Example view">
            {canPreview && <button type="button" aria-pressed={preview} onClick={() => setView("preview")}>View</button>}
            <button type="button" aria-pressed={!preview} onClick={() => setView("code")}>Code</button></div>
            {preview && (selected.preview === "theme" || selected.preview === "all") && <div className="docs-theme-picker">
              <label>Table color <input type="color" aria-label="Table color" value={theme.startsWith("#") ? theme : "#ffffff"} onChange={event => setTheme(event.target.value as TableTheme)} /></label>
              <button type="button" onClick={() => setTheme("#000000")}>Black</button><button type="button" onClick={() => setTheme("#ffffff")}>White</button>
              <code>theme="{theme}"</code></div>}</div>
            {preview ? <section className="docs-table-stage" aria-label="Live table example"><FeatureTable key={`${version}-${selected.id}`} feature={selected.preview} theme={theme} /></section> :
              <div className="docs-example-code"><CodeBlock key={`${version}-${selected.id}`} code={selected.code} />
                {selected.extraCode && <CodeBlock language="css" code={selected.extraCode} />}</div>}
          </>}
          {selected.note && <p className="docs-tip">{selected.note}</p>}
          {selected.id !== "start" && selected.code && <p className="docs-shared-setup">Reuse <code>columns</code> and <code>rows</code> from <button type="button" onClick={() => selectRecipe(recipes[0])}>Quick start</button>.</p>}
          {reference.length > 0 && <details className="docs-reference" open={selected.id === "reference"} key={`${selected.id}-reference`}>
            <summary>{selected.id === "reference" ? "Props, defaults & setup fixes" : "Options & details"}</summary><div className="docs-reference-content">
              {reference.map(section => <Markdown key={section.split(/\r?\n/)[0]} text={section} />)}</div></details>}
        </>}
      </article></div>}
    <footer className="docs-page-footer">Version-specific examples. Archived guides stay available.</footer>
  </div>;
}
