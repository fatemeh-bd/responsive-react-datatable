const FiltersTableNotes = () => {
  return (
    <div className="bg-blue-400/20 p-4 mb-6 space-y-2 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-400">
        Using Filters in Table
      </h3>

      <p>
        The{" "}
        <code className="text-green-400 font-bold text-lg mx-1">filters</code>{" "}
        prop allows you to add custom filter elements next to the table’s{" "}
        <strong>search box</strong>, while the
        <code className="text-fuchsia-400 font-bold text-lg mx-1">
          topFilter
        </code>{" "}
        prop places them at the top of the table.
      </p>

      <p className="text-yellow-300">
        ⚠️ Important: To ensure correct layout and responsiveness, filters must
        be passed as <strong>ReactNodes</strong> wrapped inside a{" "}
        <code>&lt;&gt;&lt;/&gt;</code> fragment — not inside any parent element.
      </p>

      <p>
        The table automatically allocates <strong>200px</strong> width for each
        filter element, aligning them neatly next to the search box.
      </p>

      <p>✅ Correct usage example:</p>
      <pre className="bg-black/40 p-3 rounded-md text-sm overflow-x-auto">
        {`filters={
  <>
    <SelectBox label="category" options={categories} />
    <SelectBox label="brand" options={brands} />
  </>
}`}
      </pre>

      <p>❌ Incorrect usage (will break layout):</p>
      <pre className="bg-black/40 p-3 rounded-md text-sm overflow-x-auto">
        {`filters={
  <div>
    <SelectBox label="category" options={categories} />
    <SelectBox label="brand" options={brands} />
  </div>
}`}
      </pre>

      <p>
        By keeping filters inside a fragment, the table can distribute space
        evenly and remain <strong>fully responsive</strong>.
      </p>
    </div>
  );
};

export default FiltersTableNotes;
