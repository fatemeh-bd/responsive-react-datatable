export default function FiltersTableNotes() {
  return <section className="example-note"><h2>Custom filters</h2>
    <p><code>filters</code> places your controls beside search. <code>topFilter</code> places them above the table.</p>
    <pre><code>{`<Table {...tableProps}
  filters={<><CategoryFilter /><BrandFilter /></>}
  topFilter={<DateRangeFilter />}
  onClearFilters={() => resetYourFilters()}
/>`}</code></pre>
    <p>Keep filter state in your app. On mobile, the controls move into the filter dialog.</p>
  </section>;
}
