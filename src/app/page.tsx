"use client";
import { useState } from "react";
import { fetchInteractiveSearch, SearchParams } from "./api/search";
import { Menu } from "./component/menu";
import { Result } from "./component/result";

export default function Home() {
  const [searchResult, setSearchResult] = useState<any>(null);
  const [submittedParams, setSubmittedParams] = useState<SearchParams | null>(null);

  const handleSubmit = async (params: SearchParams) => {
    console.log("Submitting parameters (from Menu):", params);
    setSubmittedParams(params);

    try {
      const result = await fetchInteractiveSearch(params);
      setSearchResult(result);
    } catch (error) {
      console.error("Error fetching search result:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-16">
      <div className="flex flex-col gap-4 items-center justify-center w-full">
        <h1 className="text-3xl font-bold pt-12 pb-7 text-center">
          Query Expansion: Automatically Generated Thesaurus Method
        </h1>
        <div className="flex flex-row w-full gap-6 pb-14">
          <div className="w-4/5">
            <Menu onSubmit={handleSubmit} />
          </div>
          <div className="w-full">
            <Result
              selected={submittedParams?.q || ""}
              result={searchResult}
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