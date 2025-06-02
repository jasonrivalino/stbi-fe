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
  meanAveragePrecision: number;

  // TODO: Add these fields for interactive mode
  expandedDocuments: Document[];
  expandedTermWeights: { [term: string]: number };
  expandedQuery: string;
  expandedMeanAveragePrecision?: number;
};

type BatchResult = {
  results: {
    termWeights(termWeights: any): unknown;
    query: string;
    documents: Document[];
    expandedQuery: string;
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
    top_k: number;
  };
};

const QueryResultPanel = ({
  title,
  query,
  termWeights,
  meanAveragePrecision,
  documents,
  color = "blue",
}: {
  title: string;
  query: string;
  termWeights: { [term: string]: number };
  meanAveragePrecision?: number;
  documents: Document[];
  color?: "blue" | "green";
}) => {
  const renderDocumentCard = (doc: Document, index: number) => (
    <div
      key={index}
      className="bg-gray-100 p-2 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="mb-4 space-y-1">
        <h3 className="font-bold text-sm text-blue-700">{index + 1}. {doc.title}</h3>
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
    <div className={`overflow-y-auto max-h-[460px] ${bgColor} p-4 rounded-md shadow-md space-y-4`}>
      <div className="bg-white p-2 rounded-md shadow-sm">
        <h2 className="text-sm font-semibold text-black mb-1">{title}</h2>
        <p className={`text-sm ${queryColor}`}>{query}</p>
      </div>

      <div className="h-20 overflow-y-auto bg-white p-2 rounded-md shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800">Terms dan Weights:</h3>
        <p className="text-xs text-gray-700 mt-1">
          {(termWeights && Object.keys(termWeights).length > 0
            ? Object.entries(termWeights)
            : [["information", 0.8], ["retrieval", 0.7]]
          )
            .map(([term, weight]) => `${term} (${typeof weight === "number" ? weight.toFixed(2) : weight})`)
            .join(', ')}
        </p>
      </div>

      <p className="text-xs text-gray-700 bg-white p-2 rounded-md shadow-sm">
        <span className="font-semibold text-sm">Mean Average Precision: </span>
        <span className="text-xs">{meanAveragePrecision?.toFixed(4) || "0.0000"}</span>
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
};

export function Result({ result, params }: ResultProps) {
  const isInteractive = result && "documents" in result;
  const isBatch = result && "results" in result;

  // Dummy fallback for interactive mode (remove when real data is available)
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
    <div className="p-4 border rounded-md bg-gray-100 h-full shadow-lg">
      <h1 className="text-xl font-bold mb-4 text-black text-center">Document Rank Result</h1>
      <section>
        {isInteractive && result ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TODO: Add original query panel for interactive mode */}
            <QueryResultPanel
              title="Original Query"
              query={params.q}                                            // Change param.q to result.query if needed
              termWeights={result.termWeights}                            // TODO: INTEGRATE (still using dummy data)
              meanAveragePrecision={result.meanAveragePrecision}          // TODO: INTEGRATE (still using dummy data)
              documents={result.documents}                                // Done result showed
              color="blue"
            />

            {/* TODO: Add expanded query panel for interactive mode */}
            <QueryResultPanel
              title="Expanded Query"
              query={result.expandedQuery ?? ""}                          // TODO: INTEGRATE (still using dummy data)
              termWeights={result.expandedTermWeights ?? {}}              // TODO: INTEGRATE (still using dummy data)
              meanAveragePrecision={result.expandedMeanAveragePrecision}  // TODO: INTEGRATE (still using dummy data)
              documents={result.expandedDocuments ?? []}                  // TODO: INTEGRATE (still using dummy data)
              color="green"
            />
          </div>
        ) : isBatch && result.results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px]">
            {/* Original Query Column */}
            <div className="overflow-y-auto max-h-[460px] space-y-4">
              {result.results.map((item, idx) => (
                <div key={`original-${idx}`} className="flex flex-col bg-blue-50 p-4 rounded-md shadow-md">
                  <h2 className="text-md font-semibold text-black mb-1">🔍 Original Query</h2>
                  <p className="text-blue-700 text-sm">{item.query}</p>

                  <div className="my-5 min-h-20 max-h-20 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-800">🧮 Terms dan Bobot:</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      {(item.termWeights && Object.keys(item.termWeights).length > 0
                        ? Object.entries(item.termWeights)
                        : [["information", 0.8], ["retrieval", 0.7]]
                      )
                        .map(([term, weight]) => `${term} (${weight.toFixed(2)})`)
                        .join(', ')}
                    </p>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-800 mb-2">📄 Ranking (Original Query)</h3>
                  <div className="space-y-3">
                    {item.documents.map((doc, docIdx) => (
                      <div
                        key={`orig-${docIdx}`}
                        className="bg-white p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-sm text-blue-700">
                            #{docIdx + 1}. {doc.title}
                          </h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Weight: {doc.weight.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700">{doc.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Expanded Query Column */}
            <div className="overflow-y-auto max-h-[460px] space-y-4">
              {result.results.map((item, idx) => (
                <div key={`expanded-${idx}`} className="flex flex-col bg-green-50 p-4 rounded-md shadow-md">
                  <h2 className="text-md font-semibold text-black mb-1">✨ Expanded Query</h2>
                  <p className="text-green-700 text-sm">{item.expandedQuery}</p>

                  <div className="my-5 min-h-20 max-h-20 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-800">🧮 Terms dan Bobot:</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      {(item.termWeights && Object.keys(item.termWeights).length > 0
                        ? Object.entries(item.termWeights)
                        : [["information", 0.8], ["retrieval", 0.7], ["query", 0.6], ["expansion", 0.5]]
                      )
                        .map(([term, weight]) => `${term} (${weight.toFixed(2)})`)
                        .join(', ')}
                    </p>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-800 mb-2">🚀 Ranking (Expanded Query)</h3>
                  <div className="space-y-3">
                    {item.documents.map((doc, docIdx) => (
                      <div
                        key={`exp-${docIdx}`}
                        className="bg-white p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-sm text-green-700">
                            #{docIdx + 1}. {doc.title}
                          </h3>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Weight: {doc.weight.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700">{doc.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">No results available yet.</p>
        )}
      </section>
    </div>
  );
}