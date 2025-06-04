"use client";

import React from "react";
import { useState } from "react";

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
  query_weight? : QueryWeight[];
};

type QueryWeight = {
  term: string;
  weight: number;
}


type BatchResult = {
  map_score: number; // Mean AP across all queries
  results: {
    query: string;
    ap_score: number;
    documents: Document[];
    termWeights: { [term: string]: number };

    expandedQuery: string;
    expandedAveragePrecision?: number;
    expandedDocuments: Document[];
    expandedTermWeights: { [term: string]: number };
    query_weight? : QueryWeight[];
  }[];
};

type ResultProps = {
  selected: string;
  result: InteractiveResult | BatchResult | null;
  result_expansion: InteractiveResult | BatchResult | null;
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
  selectedDoc,
  onClick,
}: {
  title: string;
  query: string;
  termWeights: { [term: string]: number };
  averagePrecision?: number;
  documents: Document[];
  color?: "blue" | "green";
  isBatch?: boolean;
  params: ResultProps["params"];
  selectedDoc?: string;
  onClick?: (title: string, content: string) => void;
}) => {
  const renderDocumentCard = (doc: Document, index: number) => (
    <div
      onClick={() => onClick?.(doc.title, doc.content)}
      key={index}
      className="relative group bg-gray-100 p-2 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
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
    <div className={`${bgColor} p-4 rounded-md shadow-md h-full gap-4`}>
      {/* Query Section (static) */}
      <div className="bg-white p-2 rounded-md shadow-sm h-[100px] mb-4 flex flex-col">
        <h2 className="text-sm font-semibold text-black mb-1 flex-shrink-0">{title}</h2>
        <p className={`text-sm overflow-y-auto ${queryColor}`} style={{ maxHeight: "calc(80px)" }}>
          {query}
        </p>
      </div>

      {/* Term Weights Section (static) */}
      <div className="bg-white p-2 rounded-md shadow-sm h-[90px] mb-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 flex-shrink-0">Terms and Weights:</h3>
        <p className="text-xs text-gray-700 mt-1 overflow-y-auto max-h-[50px]">
          {(termWeights && Object.keys(termWeights).length > 0
            ? Object.entries(termWeights)
            : [["information", 0.8], ["retrieval", 0.7]]
          )
            .map(([term, weight]) => `${term} (${typeof weight === "number" ? weight.toFixed(2) : weight})`)
            .join(", ")}
        </p>
      </div>

      {/* Average Precision Section */}
      {isBatch && (
        <div className="bg-white p-2 rounded-md shadow-sm mb-3">
          <p className="text-xs text-gray-700">
            <span className="font-semibold text-sm">Average Precision: </span>
            <span className="text-sm">{averagePrecision?.toFixed(4) || "0.0000"}</span>
          </p>
        </div>
      )}

      {/* Ranking Section */}
      <div className="bg-white p-2 rounded-md shadow-sm" style={{ maxHeight: "370px" }}>
        <div className="flex flex-col max-h-[300px]">
          {/* Static title */}
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex-shrink-0">
            Ranking ({title})
          </h3>

          {/* Scrollable document list */}
          <div className="overflow-y-auto space-y-3 pr-1" style={{ flex: 1 }}>
            {documents.map((doc, idx) => (
              <div key={idx} className="px-2 pb-2">
                {renderDocumentCard(doc, idx)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export function Result({ result, result_expansion, params }: ResultProps) {
  const isInteractive = result && result_expansion && "documents" in result && "documents" in result_expansion;
  const isBatch = result && result_expansion && "results" in result && "results" in result_expansion;
  const [selectDoc, setSelectDoc] = useState('');
  const [contentselectDoc, setcontentselectDoc] = useState<Record<string, number>>({})

  const countandsetTerm = (doc : string,kalimat : string) =>{
    setSelectDoc(doc)
    const cleaned = kalimat.toLowerCase()
    .replace(/[^a-z0-9\-'\s]/g, '') 
    .replace(/\s+/g, ' ')            
    .trim();
    const words = cleaned.split(' ');
    const wordCount: Record<string, number> = {};
    for (const word of words) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
    console.log(doc)

    setcontentselectDoc(wordCount)
  }

  const handleDownload = () => {
    var hasil ={
      result,
      result_expansion,
    }
    const jsonString = JSON.stringify(hasil, null, 2); // pretty print with 2 spaces
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

  return (
    <div className={`${isBatch ? "" : "p-4"} border rounded-md bg-gray-100 h-full shadow-lg`}>
      <div className={`flex justify-between items-center ${isBatch ? "px-4" : ""}`}>
        <h1 className={`text-xl font-bold text-black text-center ${isBatch ? "pt-4" : ""}`}>
          Document Rank Result
        </h1>

        {(isInteractive && result?.documents?.length > 0) || 
        (isBatch && result?.results?.length > 0) ? (
          <button
            onClick={handleDownload}
            className={`px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-1/5 transition-colors duration-300 text-xs ${isBatch ? "mt-3" : ""}`}
          >
            Download JSON result
          </button>
        ) : null}
      </div>

      {selectDoc !== "" && (
        <div className={`bg-white p-2 rounded-md shadow-sm mt-4 text-black ${isBatch ? "mx-4 mb-4" : ""}`}>
          <h2 className="text-sm font-semibold mb-2">Nama Dokumen: {selectDoc}</h2>
          <p className="text-sm font-semibold">Inverted File Information:</p>
          <p className="text-sm mt-1">
            {Object.entries(contentselectDoc)
              .sort((a, b) => b[1] - a[1]) // Sort descending by TF
              .map(([term, tf]) => `${term} (${tf})`)
              .join(', ')}
          </p>
        </div>
      )}

      <section>
        {isInteractive && result ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <QueryResultPanel
              title="Original Query"
              query={params.q}                                            // Change param.q to result.query if needed
              termWeights={result.query_weight?.reduce<Record<string, number>>((acc, item) => {
              acc[item.term] = item.weight;
              return acc;
              }, {}) ?? {}}
              averagePrecision={result.averagePrecision}                  // TODO: INTEGRATE (still using dummy data)
              documents={result.documents}                                // Done result showed
              color="blue"
              params={params}
              onClick={countandsetTerm}
              selectedDoc={selectDoc}
            />

            <QueryResultPanel
              title="Expanded Query"
              query={result_expansion.query_weight?.map(item => item.term).join(' ') ?? ""} 
              termWeights={result_expansion.query_weight?.reduce<Record<string, number>>((acc, item) => {
              acc[item.term] = item.weight;
              return acc;
              }, {}) ?? {}}              // TODO: INTEGRATE (still using dummy data)
              averagePrecision={result_expansion.averagePrecision}          // TODO: INTEGRATE (still using dummy data)
              documents={result_expansion.documents ?? []}                  // TODO: INTEGRATE (still using dummy data)
              color="green"
              params={params}
              onClick={countandsetTerm}
              selectedDoc={selectDoc}
            />
          </div>
        ) : isBatch && result.results.length > 0 ? (
          // ✅ Wrap scrollable content + bottom bar in a container
          <div className="relative">
            {/* Scrollable Panel Content */}
            <div className="space-y-6 overflow-y-auto px-4 pb-4 mt-4">
              {result.results.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="">
                    <QueryResultPanel
                      title={`Original Query #${idx + 1}`}
                      query={item.query}                                  // TODO: INTEGRATE (still using dummy data)
                      termWeights={item.query_weight?.reduce<Record<string, number>>((acc, item) => {
                      acc[item.term] = item.weight;
                      return acc;
                      }, {}) ?? {}}
                      documents={item.documents}                          // TODO: INTEGRATE (still using dummy data)
                      color="blue"
                      isBatch={true}
                      averagePrecision={item.ap_score}            // TODO: INTEGRATE (still using dummy data)
                      params={params}
                      onClick={countandsetTerm}
                      selectedDoc={selectDoc}
                    />
                  </div>

                  <div className="">
                    <QueryResultPanel
                      title={`Expanded Query #${idx + 1}`}
                      query={result_expansion.results[idx].query_weight?.map(item => item.term).join(' ') ?? "Query Not Available"}      // TODO: cleaner approach (optional)
                      termWeights={result_expansion.results[idx].query_weight?.reduce<Record<string, number>>((acc, item) => {
                      acc[item.term] = item.weight;
                      return acc;
                      }, {}) ?? {}}                                                                                 
                      documents={result_expansion.results[idx].documents ?? dummyExpandedDocs}   
                      color="green"
                      isBatch={true}
                      averagePrecision={result_expansion.results[idx].ap_score}
                      params={params}
                      onClick={countandsetTerm}
                      selectedDoc={selectDoc}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Bottom Summary Bar - Moved OUTSIDE scrollable container */}
            <div className="sticky bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-300 p-4 shadow-inner mt-4">
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm font-medium text-gray-800">

                {/* TODO: INTEGRATE (still using dummy data) */}
                <span>
                  Mean Average Precision (Original):{" "}
                  <span className="font-bold text-blue-700">
                    {(result.map_score ?? 0).toFixed(4)}   
                  </span>
                </span>

                {/* TODO: INTEGRATE (still using dummy data) */}
                <span>
                  Mean Average Precision (Expanded):{" "}
                  <span className="font-bold text-green-700">
                    {(result_expansion.map_score ?? 0).toFixed(4)}   
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