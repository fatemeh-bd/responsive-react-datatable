
const InternalNotes = () => {
  return (
    <div className="bg-blue-400/20 p-4 mb-6 space-y-2">
      <h3 className="text-lg font-semibold text-blue-400">Example Table with Mock API</h3>
      <p>
        This example demonstrates how to use the table in <strong>internal mode</strong> with a mock API response.
      </p>
      <p>
        The data is fetched from a local JSON file (<code>mockData.json</code>) for demonstration purposes.
      </p>
      <p>
        Features like <strong>sorting</strong>, <strong>searching</strong>, and <strong>pagination</strong> are <em>not functional</em> in this example, because there is <span className="underline underline-offset-4">
            no real API.
        </span>
      </p>
      <p>
        The table only displays the data and logs the response to the console.
      </p>
      <p className="text-yellow-300">
        When connected to a <strong>real API</strong>, the table will automatically handle:
      </p>
      <ul className="list-disc list-inside ml-4 space-y-1">
        <li>Sorting</li>
        <li>Searching</li>
        <li>Pagination</li>
      </ul>
      <p>and send the necessary parameters to your API endpoint.</p>
    </div>
  );
};

export default InternalNotes;
