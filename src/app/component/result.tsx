"use client";

type ResultProps = {
  selected: string;
  result: any;
  params: {
    q: string;
    'weights.docs.tf': 'n' | 'l' | 'a' | 'b';
    'weights.docs.idf': 'n' | 't';
    'weights.docs.norm': 'n' | 'c';
    'weights.query.tf': 'n' | 'l' | 'a' | 'b';
    'weights.query.idf': 'n' | 't';
    'weights.query.norm': 'n' | 'c';
    'config.do_stemming': boolean;
    'config.do_remove_stop_words': boolean;
    top_k: number;
  };
};

export function Result({ result, params }: ResultProps) {
  return (
    <div className="p-4 border rounded-md bg-gray-100 h-full shadow-lg">
      <h1 className="text-xl font-bold mb-2 text-black">Document Rank Result</h1>

      {/* Display chosen parameters */}
      <h2 className="text-lg font-semibold mb-2 text-black">Selected Parameters:</h2>
      <div className="bg-white p-3 rounded text-sm text-black mb-4 space-y-1">
        <p><strong>Stemming:</strong> {params["config.do_stemming"] ? "Enabled" : "Disabled"}</p>
        <p><strong>Remove Stop Words:</strong> {params["config.do_remove_stop_words"] ? "Enabled" : "Disabled"}</p>
        <p><strong>Weights (Docs):</strong></p>
        <ul className="ml-4 list-disc">
          <li>TF: {params["weights.docs.tf"]}</li>
          <li>IDF: {params["weights.docs.idf"]}</li>
          <li>Norm: {params["weights.docs.norm"]}</li>
        </ul>
        <p><strong>Top K:</strong> {params.top_k}</p>
        <p><strong>Query:</strong> {params.q}</p>
        <p><strong>Weights (Query):</strong></p>
        <ul className="ml-4 list-disc">
          <li>TF: {params["weights.query.tf"]}</li>
          <li>IDF: {params["weights.query.idf"]}</li>
          <li>Norm: {params["weights.query.norm"]}</li>
        </ul>
      </div>

      {/* Display search result */}
      {result ? (
        <>
          <h2 className="text-lg font-semibold mb-2 text-black">Search Result:</h2>
          <pre className="bg-white p-2 rounded text-sm text-black overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </>
      ) : (
        <p className="text-gray-500">No result yet.</p>
      )}
    </div>
  );
}