"use client";

import React from "react";

type Document = {
  title: string;
  content: string;
  weight: number;
};

type InteractiveResult = {
  documents: Document[];
  termWeights: { [term: string]: number };
  query: string;
  averagePrecision: number;

  // TODO: Add these fields for interactive mode
  expandedDocuments: Document[];
  expandedTermWeights: { [term: string]: number };
  expandedQuery: string;
  expandedaveragePrecision?: number;
};

type BatchResult = {
  meanAveragePrecision: number; // Mean AP across all queries
  results: {
    query: string;
    averagePrecision: number;
    documents: Document[];
    termWeights: { [term: string]: number };

    expandedQuery: string;
    expandedAveragePrecision?: number;
    expandedDocuments: Document[];
    expandedTermWeights: { [term: string]: number };
  }[];
};

type ResultProps = {
  selected: string;
  result: InteractiveResult | BatchResult | null;
  params: {
    q: string;
    "weights.docs.tf": "n" | "l" | "a" | "b";
    "weights.docs.idf": "n" | "t";
    "weights.docs.norm": "n" | "c";
    "weights.query.tf": "n" | "l" | "a" | "b";
    "weights.query.idf": "n" | "t";
    "weights.query.norm": "n" | "c";
    "config.do_stemming": boolean;
    "config.do_remove_stop_words": boolean;
    "config.do_inverted_file": boolean;
    "config.max_terms": number;
    "config.window_size": number;
    "config.mi_threshold": number;
    "config.do_query_expansion": boolean;
    top_k: number;
  };
};

const dummyExpandedDocs: Document[] = Array.from({ length: 10 }, (_, i) => ({
  title: `Dokumen Rahasia ${i + 1}`,
  content: `Isi Konten ${i + 1}`,
  weight: 99.0 - i,
}));

const QueryResultPanel = ({
  title,
  query,
  termWeights,
  averagePrecision,
  documents,
  color = "blue",
  isBatch = false,
  params,
}: {
  title: string;
  query: string;
  termWeights: { [term: string]: number };
  averagePrecision?: number;
  documents: Document[];
  color?: "blue" | "green";
  isBatch?: boolean;
  params: ResultProps["params"];
}) => {
  const renderDocumentCard = (doc: Document, index: number) => (
    <div
      key={index}
      className="bg-gray-100 p-2 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="mb-4 space-y-1">
        <h3 className="font-bold text-sm text-blue-700">
          {index + 1}. {doc.title}
        </h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Weight: {doc.weight.toFixed(2)}
        </span>
      </div>
      <p className="text-xs text-gray-700">{doc.content}</p>
    </div>
  );

  const queryColor = color === "green" ? "text-green-700" : "text-blue-700";
  const bgColor = color === "green" ? "bg-green-50" : "bg-blue-50";

  return (
      <div
      className={`overflow-y-auto ${
        isBatch
          ? ""
          : params['config.do_inverted_file']
          ? "max-h-[300px]"
          : "max-h-[460px]"
      } ${bgColor} p-4 rounded-md shadow-md space-y-4`}
    >
      <div className="bg-white p-2 rounded-md shadow-sm">
        <h2 className="text-sm font-semibold text-black mb-1">{title}</h2>
        <p className={`text-sm ${queryColor}`}>{query}</p>
      </div>

      <div className="h-20 overflow-y-auto bg-white p-2 rounded-md shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800">Terms and Weights:</h3>
        <p className="text-xs text-gray-700 mt-1">
          {(termWeights && Object.keys(termWeights).length > 0
            ? Object.entries(termWeights)
            : [["information", 0.8], ["retrieval", 0.7]]
          )
            .map(([term, weight]) => `${term} (${typeof weight === "number" ? weight.toFixed(2) : weight})`)
            .join(", ")}
        </p>
      </div>

      <p className="text-xs text-gray-700 bg-white p-2 rounded-md shadow-sm">
        <span className="font-semibold text-sm">
          {isBatch ? "Average Precision" : "Mean Average Precision"}:{" "}
        </span>
        <span className="text-xs">{averagePrecision?.toFixed(4) || "0.0000"}</span>
      </p>

      <div className="space-y-3 bg-white p-2 rounded-md shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Ranking ({title})</h3>
        <div className="space-y-3">
          {documents.map((doc, idx) => (
            <div key={idx} className="px-2 pb-2">
              {renderDocumentCard(doc, idx)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Result({ result, params }: ResultProps) {
  const isInteractive = result && "documents" in result;
  const isBatch = result && "results" in result;
  const handleDownload = () => {
    const jsonString = JSON.stringify(result, null, 2); // pretty print with 2 spaces
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hasil.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  // Dummy fallback for interactive mode (remove when integrating with real data)
  if (isInteractive && result) {
    if (!result.expandedQuery) {
      result.expandedQuery = "dummy lorem ipsum expansion text";
    }

    if (!result.expandedTermWeights || Object.keys(result.expandedTermWeights).length === 0) {
      result.expandedTermWeights = {
        "information": 0.8,
        "retrieval": 0.7,
        "query": 0.6,
        "expansion": 0.5,
      };
    }

    if (!result.expandedDocuments || result.expandedDocuments.length === 0) {
      result.expandedDocuments = [
        {
          title: "Expanded Doc 1",
          content: "This document was added as a result of query expansion using semantic similarity.",
          weight: 0.75,
        },
        {
          title: "Expanded Doc 2",
          content: "Expanded query helped find this document with related content.",
          weight: 0.65,
        },
      ];
    }
  }

  return (
    <div className={`${isBatch ? "" : "p-4"} border rounded-md bg-gray-100 h-full shadow-lg`}>
      <div className="flex justify-between items-center">
        <h1 className={`text-xl font-bold text-black text-center ${isBatch ? "py-4" : ""}`}>
          Document Rank Result
        </h1>

        {(isInteractive && result?.documents?.length > 0) || 
        (isBatch && result?.results?.length > 0) ? (
          <button
            onClick={handleDownload}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-1/5 transition-colors duration-300 text-xs"
          >
            Download JSON result
          </button>
        ) : null}
      </div>

      {params['config.do_inverted_file'] && (
        <div className="bg-white p-2 rounded-md shadow-sm mt-4 text-black">
          <h2 className="text-sm font-semibold mb-2">Nama Dokumen: Doc5.txt</h2>
          <p className="text-sm font-semibold">Inverted File Information:</p>
          {/* TODO: Synchronize with inverted data information */}
          <ul className="list-disc list-inside text-sm mt-1">
            <li><strong>information:</strong> tf = 3, df = 12, idf = 1.234, weight = 3.702</li>
            <li><strong>retrieval:</strong> tf = 2, df = 10, idf = 1.321, weight = 2.642</li>
            <li><strong>data:</strong> tf = 1, df = 20, idf = 0.980, weight = 0.980</li>
            <li><strong>indexing:</strong> tf = 4, df = 5, idf = 1.699, weight = 6.796</li>
          </ul>
        </div>
      )}

      <section>
        {isInteractive && result ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <QueryResultPanel
              title="Original Query"
              query={params.q}                                            // Change param.q to result.query if needed
              termWeights={result.termWeights}                            // TODO: INTEGRATE (still using dummy data)
              averagePrecision={result.averagePrecision}                  // TODO: INTEGRATE (still using dummy data)
              documents={result.documents}                                // Done result showed
              color="blue"
              params={params}
            />

            {/* TODO: Add expanded query panel for interactive mode */}
            <QueryResultPanel
              title="Expanded Query"
              query={result.expandedQuery ?? ""}                          // TODO: INTEGRATE (still using dummy data)
              termWeights={result.expandedTermWeights ?? {}}              // TODO: INTEGRATE (still using dummy data)
              averagePrecision={result.expandedaveragePrecision}          // TODO: INTEGRATE (still using dummy data)
              documents={result.expandedDocuments ?? []}                  // TODO: INTEGRATE (still using dummy data)
              color="green"
              params={params}
            />
          </div>
        ) : isBatch && result.results.length > 0 ? (
          // ✅ Wrap scrollable content + bottom bar in a container
          <div className="relative">
            {/* Scrollable Panel Content */}
            <div className="space-y-6 max-h-[429px] overflow-y-auto px-4 pb-4">
              {result.results.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="">
                    <QueryResultPanel
                      title={`Original Query #${idx + 1}`}
                      query={item.query}                                  // TODO: INTEGRATE (still using dummy data)
                      termWeights={item.termWeights}                      // TODO: INTEGRATE (still using dummy data)
                      documents={item.documents}                          // TODO: INTEGRATE (still using dummy data)
                      color="blue"
                      isBatch={true}
                      averagePrecision={item.averagePrecision}            // TODO: INTEGRATE (still using dummy data)
                      params={params}
                    />
                  </div>

                  <div className="">
                    <QueryResultPanel
                      title={`Expanded Query #${idx + 1}`}
                      query={item.expandedQuery ?? "Query Not Available"}       // TODO: INTEGRATE (still using dummy data)
                      termWeights={item.expandedTermWeights ?? {
                        information: 0.8,
                        retrieval: 0.7,
                        query: 0.6,
                        expansion: 0.5,
                      }}                                                        // TODO: INTEGRATE (still using dummy data)
                      documents={item.expandedDocuments ?? dummyExpandedDocs}   // TODO: INTEGRATE (still using dummy data)
                      color="green"
                      isBatch={true}
                      averagePrecision={item.expandedAveragePrecision}          // TODO: INTEGRATE (still using dummy data)
                      params={params}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Bottom Summary Bar - Moved OUTSIDE scrollable container */}
            <div className="sticky bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-300 p-4 shadow-inner">
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm font-medium text-gray-800">

                {/* TODO: INTEGRATE (still using dummy data) */}
                <span>
                  Mean Average Precision (Original):{" "}
                  <span className="font-bold text-blue-700">
                    {(result.meanAveragePrecision ?? 0).toFixed(4)}   
                  </span>
                </span>

                {/* TODO: INTEGRATE (still using dummy data) */}
                <span>
                  Mean Average Precision (Expanded):{" "}
                  <span className="font-bold text-green-700">
                    {(
                      result.results.length > 0
                        ? result.results.reduce(
                            (acc, cur) => acc + (cur.expandedAveragePrecision ?? 0),
                            0
                          ) / result.results.length
                        : 0
                    ).toFixed(4)}
                  </span>
                </span>

              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic mt-2">No results available yet.</p>
        )}
      </section>
    </div>
  );
}