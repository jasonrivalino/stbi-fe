"use client";
import { useState } from "react";
import { SearchParams } from "../api/search";

type MenuProps = {
  onSubmit: (params: SearchParams) => void;
};

export function Menu({ onSubmit }: MenuProps) {
  const [isStemmingChecked, setIsStemmingChecked] = useState(false);
  const [isEliminationChecked, setIsEliminationChecked] = useState(false);
  const [isIDFDocumentChecked, setIsIDFDocumentChecked] = useState(false);
  const [isCosineDocumentChecked, setIsCosineDocumentChecked] = useState(false);
  const [isAddAllTermsChecked, setIsAddAllTermsChecked] = useState(false);
  const [isIDFQueryChecked, setIsIDFQueryChecked] = useState(false);
  const [isCosineQueryChecked, setIsCosineQueryChecked] = useState(false);
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(0);

  const [params, setParams] = useState<SearchParams>({
    q: '',
    'weights.docs.tf': 'n',
    'weights.docs.idf': 'n',
    'weights.docs.norm': 'n',
    'weights.query.tf': 'n',
    'weights.query.idf': 'n',
    'weights.query.norm': 'n',
    'config.do_stemming': false,
    'config.do_remove_stop_words': false,
    top_k: 0,
  });

  const updateParam = <T extends keyof SearchParams>(key: T, value: SearchParams[T]) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = () => {
    const updatedParams = {
      ...params,
      q: query,
      top_k: topK,
    };
    setParams(updatedParams);
    console.log("Submitting parameters:", updatedParams);
    onSubmit(updatedParams);
  };

  const handleStemmingToggle = () => {
    const newValue = !isStemmingChecked;
    setIsStemmingChecked(newValue);

    if (newValue) {
      // Handling checked state
      console.log("🔍 Stemming is checked");
      updateParam('config.do_stemming', true);
    } else {
      // Handling unchecked state
      console.log("❌ Stemming is unchecked");
      updateParam('config.do_stemming', false);
    }
  };

  const handleEliminationToggle = () => {
    const newValue = !isEliminationChecked;
    setIsEliminationChecked(newValue);

    if (newValue) {
      // Handling checked state
      console.log("🔍 Elimination is checked");
      updateParam('config.do_remove_stop_words', true);
    } else {
      // Handling unchecked state
      console.log("❌ Elimination is unchecked");
      updateParam('config.do_remove_stop_words', false);
    }
  };

  const handleIDFDocumentToggle = () => {
    const newValue = !isIDFDocumentChecked;
    setIsIDFDocumentChecked(newValue);
    
    if (newValue) {
      // Handling checked state
      console.log("🔍 IDF Document is checked");
      updateParam('weights.docs.idf', 't');
    } else {
      // Handling unchecked state
      console.log("❌ IDF Document is unchecked");
      updateParam('weights.docs.idf', 'n');
    }
  };

  const handleCosineDocumentToggle = () => {
    const newValue = !isCosineDocumentChecked;
    setIsCosineDocumentChecked(newValue);

    if (newValue) {
      // Handling checked state
      console.log("🔍 Cosine Document is checked");
      updateParam('weights.docs.norm', 'c');
    } else {
      // Handling unchecked state
      console.log("❌ Cosine Document is unchecked");
      updateParam('weights.docs.norm', 'n');
    }
  };

  const handleAddAllTermsToggle = () => {
    const newValue = !isAddAllTermsChecked;
    setIsAddAllTermsChecked(newValue);
    
    if (newValue) {
      // Handling checked state
      console.log("🔍 Add All Terms is checked");
    } else {
      // Handling unchecked state
      console.log("❌ Add All Terms is unchecked");
    }
  };

  const handleIDFQueryToggle = () => {
    const newValue = !isIDFQueryChecked;
    setIsIDFQueryChecked(newValue);
    
    if (newValue) {
      // Handling checked state
      console.log("🔍 IDF Query is checked");
      updateParam('weights.query.idf', 't');
    } else {
      // Handling unchecked state
      console.log("❌ IDF Query is unchecked");
      updateParam('weights.query.idf', 'n');
    }
  };

  const handleCosineQueryToggle = () => {
    const newValue = !isCosineQueryChecked;
    setIsCosineQueryChecked(newValue);
    
    if (newValue) {
      // Handling checked state
      console.log("🔍 Cosine Query is checked");
      updateParam('weights.query.norm', 'c');
    } else {
      // Handling unchecked state
      console.log("❌ Cosine Query is unchecked");
      updateParam('weights.query.norm', 'n');
    }
  };
  
  const handleQueryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Handle query file upload logic
  };

  const handleDocumentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Handle document file upload logic
  };

  const handleRelevanceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Handle relevance file upload logic
  };

  return (
    <div className="p-4 border rounded-xl text-white bg-gray-800 shadow-lg w-full">
      <div className="flex flex-row gap-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center pb-4 border-b-2">

            {/* Stemming Toggle */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold">Stemming:</h2>
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  checked={isStemmingChecked}
                  onChange={handleStemmingToggle}
                  className="sr-only peer"
                />
                <div className="w-6 h-6 bg-gray-300 rounded-lg relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
                  {isStemmingChecked && (
                    <span className="text-white text-xs font-bold">✔</span>
                  )}
                </div>
              </label>
            </div>

            {/* Elimination Toggle */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold">Elimination Stop Word:</h2>
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  checked={isEliminationChecked}
                  onChange={handleEliminationToggle}
                  className="sr-only peer"
                />
                <div className="w-6 h-6 bg-gray-300 rounded-lg relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
                  {isEliminationChecked && (
                    <span className="text-white text-xs font-bold">✔</span>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Document Weighting */}
          <div className="flex flex-row gap-7">
            <h2 className="text-base font-semibold">Document Weighting:</h2>
            
            {/* TF */}
            <div className="flex flex-row justify-between items-center ml-auto">
              <h3 className="text-sm justify-center align-center text-center mr-2 font-semibold"> 
                TF
              </h3>
              <select
                className="p-1 bg-gray-700 text-white rounded-md text-sm"
                value={params['weights.docs.tf']}
                onChange={(e) => updateParam('weights.docs.tf', e.target.value as SearchParams['weights.docs.tf'])}
              >
                <option value="">Select a method</option>
                <option value="l">Logarithmic</option>
                <option value="b">Binary</option>
                <option value="a">Augmented</option>
                <option value="n">Raw</option>
              </select>
            </div>

            {/* IDF */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm justify-center align-center text-center mr-2 font-semibold">IDF</h2>
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  checked={isIDFDocumentChecked}
                  onChange={handleIDFDocumentToggle}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 bg-gray-300 rounded-md relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
                  {isIDFDocumentChecked && (
                    <span className="text-white text-xs font-bold">✔</span>
                  )}
                </div>
              </label>
            </div>

            {/* Cosine */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm justify-center align-center text-center mr-2 font-semibold">Cosine</h2>
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  checked={isCosineDocumentChecked}
                  onChange={handleCosineDocumentToggle}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 bg-gray-300 rounded-md relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
                  {isCosineDocumentChecked && (
                    <span className="text-white text-xs font-bold">✔</span>
                  )}
                </div>
              </label>
            </div>
          </div>
          
          {/* Terms */}
          <div className="flex flex-row w-full pt-4 border-t-2 justify-between items-center">
            {/* Max Terms */}
            <div className="flex items-center gap-3 w-full">
              <h2 className="text-base font-semibold mt-[0.125rem]">Max Terms:</h2>
              <input
                type="number"
                className="p-1 bg-gray-700 text-white rounded-md text-sm w-20"
                placeholder="Enter"
                min={1}
                onChange={(e) => setTopK(Number(e.target.value))}
              />
            </div>

            {/* Add All Terms */}
            <div className="flex flex-row items-center w-full">
              <h2 className="text-base font-semibold ml-auto">Add All Terms:</h2>
                <label className="inline-flex items-center cursor-pointer relative ml-auto">
                  <input
                    type="checkbox"
                    checked={isAddAllTermsChecked}
                    onChange={handleAddAllTermsToggle}
                    className="sr-only peer"
                  />
                  <div className="w-6 h-6 bg-gray-300 rounded-md relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
                    {isAddAllTermsChecked && (
                      <span className="text-white text-xs font-bold">✔</span>
                    )}
                  </div>
                </label>
              </div>
            </div>

        {/* Add vertical line separator */}
        {/* <div className="border-1 border-white h-auto"></div> */}

          {/* Query Method */}
          <div className="flex flex-col gap-2 w-full justify-center align-middle pt-4 pb-6 border-y-2">
            <h2 className="text-base font-semibold">Query Method:</h2>
            <div className="flex flex-col gap-2 w-full">
              {/* Interactive */}
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="radio"
                  name="queryMethod"
                  value="interactive"
                  // onChange={() => setSelectedOption("interactive")}
                  className="sr-only peer"
                />
                <span className="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200"></span>
                <span className="ml-2 text-sm font-semibold">Interactive</span>
              </label>
              <textarea
                rows={2}
                className="p-1 bg-gray-700 text-white rounded-md text-sm w-full resize-none"
                placeholder="Enter your query input"
                onChange={(e) => setQuery(e.target.value)}
              />

              {/* Query Weighting */}
              <div className="flex flex-row gap-7 mt-1">
                <h2 className="text-sm font-semibold">Query Weighting:</h2>
                
                {/* TF */}
                <div className="flex flex-row justify-between items-center ml-auto">
                  <h3 className="text-sm justify-center align-center text-center mr-2 font-semibold"> 
                    TF
                  </h3>
                  <select
                    className="p-1 bg-gray-700 text-white rounded-md text-sm"
                    onChange={(e) => updateParam('weights.query.tf', e.target.value as SearchParams['weights.query.tf'])}
                  >
                    <option value="">Select a method</option>
                    <option value="l">Logarithmic</option>
                    <option value="b">Binary</option>
                    <option value="a">Augmented</option>
                    <option value="n">Raw</option>
                  </select>
                </div>

                {/* IDF */}
                <div className="flex items-center justify-between">
                  <h2 className="text-sm justify-center align-center text-center mr-2 font-semibold">IDF</h2>
                  <label className="inline-flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      checked={isIDFQueryChecked}
                      onChange={handleIDFQueryToggle}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 bg-gray-300 rounded-md relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
                      {isIDFQueryChecked && (
                        <span className="text-white text-xs font-bold">✔</span>
                      )}
                    </div>
                  </label>
                </div>

                {/* Cosine */}
                <div className="flex items-center justify-between">
                  <h2 className="text-sm justify-center align-center text-center mr-2 font-semibold">Cosine</h2>
                  <label className="inline-flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      checked={isCosineQueryChecked}
                      onChange={handleCosineQueryToggle}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 bg-gray-300 rounded-md relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
                      {isCosineQueryChecked && (
                        <span className="text-white text-xs font-bold">✔</span>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Batch */}
              <label className="inline-flex items-center cursor-pointer relative mt-4">
                <input
                  type="radio"
                  name="queryMethod"
                  value="batch"
                  // onChange={() => setSelectedOption("batch")}
                  className="sr-only peer"
                />
                <span className="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200"></span>
                <span className="ml-2 text-sm font-semibold">Batch</span>
              </label>

              {/* Load files in 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {/* Query file */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-white mb-1">Query File</label>
                  <input
                    type="file"
                    accept=".txt, .csv"
                    className="p-1 bg-gray-700 text-white rounded-md text-sm border border-gray-600 hover:border-blue-400 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                    onChange={(e) => handleQueryFileUpload(e)}
                  />
                </div>

                {/* Document file */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-white mb-1">Document File</label>
                  <input
                    type="file"
                    accept=".txt, .csv"
                    className="p-1 bg-gray-700 text-white rounded-md text-sm border border-gray-600 hover:border-blue-400 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                    onChange={(e) => handleDocumentFileUpload(e)}
                  />
                </div>

                {/* Relevance Judgment file */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-white mb-1">Relevance Judgement File</label>
                  <input
                    type="file"
                    accept=".txt, .csv"
                    className="p-1 bg-gray-700 text-white rounded-md text-sm border border-gray-600 hover:border-blue-400 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                    onChange={(e) => handleRelevanceFileUpload(e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <button
        onClick={handleFormSubmit}
        className="mt-6 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 w-full transition-colors duration-300"
      >
        Submit
      </button>
    </div>
  );
}