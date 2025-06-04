"use client";
import { useState } from "react";
import { fetchInteractiveSearch, SearchParams } from "./api/interactiveSearch";
import { Menu } from "./component/menu";
import { Result } from "./component/result";
import { fetchBatchSearch } from "./api/batchSearch";

export default function Home() {
  const [searchResult, setSearchResult] = useState<any>(null);
  const [submittedParams, setSubmittedParams] = useState<SearchParams | null>(null);

  const handleInteractiveSubmit = async (params: SearchParams) => {
    console.log("Submitting parameters (from Menu):", params);
    setSubmittedParams(params);

    try {
      const result = await fetchInteractiveSearch(params, false);
      const result_expansion = await fetchInteractiveSearch(params, true);
      setSearchResult({result: result, result_expansion: result_expansion});
    } catch (error) {
      console.error("Error fetching search result:", error);
    }
  };

  const handleBatchSubmit = async (params: SearchParams, formData: FormData) => {
    try {
      const result = await fetchBatchSearch(params, formData, false);
      const result_expansion = await fetchBatchSearch(params, formData, true);
      setSearchResult({result: result, result_expansion: result_expansion});
    } catch (error) {
      console.error("Error in batch search:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-16">
      <div className="flex flex-col gap-4 items-center justify-center w-full">
        <h1 className="text-3xl font-bold pt-12 pb-7 text-center">
          Query Expansion: Automatically Generated Thesaurus Method
        </h1>
        <div className="flex flex-col w-full gap-8 pb-16">
          <div>
            <Menu onSubmitInteractive={handleInteractiveSubmit} onSubmitBatch={handleBatchSubmit} />
          </div>
          <div>
            <Result
              selected={submittedParams?.q || ""}
              result={searchResult?.result}
              result_expansion={searchResult?.result_expansion}
              params={
                submittedParams ?? {
                  q: "",
                  "weights.docs.tf": "n",
                  "weights.docs.idf": "n",
                  "weights.docs.norm": "n",
                  "weights.query.tf": "n",
                  "weights.query.idf": "n",
                  "weights.query.norm": "n",
                  "config.do_stemming": false,
                  "config.do_remove_stop_words": false,
                  "config.do_inverted_file": false,
                  "config.max_terms": 0,
                  "config.window_size": 5,
                  "config.mi_threshold": 5,
                  top_k: 0,
                }
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}