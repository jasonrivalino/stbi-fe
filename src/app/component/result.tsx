"use client";

import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

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
      <h1 className="text-xl font-bold mb-5 text-black justify-center text-center">Document Rank Result</h1>

      {/* Display chosen parameters */}
      {/* <h2 className="text-lg font-semibold mb-2 text-black">Selected Parameters:</h2>
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
      </div> */}

      {/* Results Section */}
      <section>
        {result && result.documents.length > 0 ? (
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
            {result.documents.map(
              (
                doc: {
                  title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
                  weight: number;
                  content: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
                },
                i: number
              ) => (
                <div
                  key={i}
                  className="bg-white p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-md text-blue-700">{i + 1}. {doc.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Weight: {doc.weight.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{doc.content}</p>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic">No results available yet.</p>
        )}
      </section>
    </div>
  );
}