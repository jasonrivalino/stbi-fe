"use client";
import { useState } from "react";
import { SearchParams } from "../api/interactiveSearch";

type MenuProps = {
  onSubmitInteractive: (params: SearchParams) => void;
  onSubmitBatch: (params: SearchParams, formData: FormData) => void; // Add this new prop
};

export function Menu({ onSubmitInteractive, onSubmitBatch }: MenuProps) {
  // State variables for toggles and inputs
  const [isStemmingChecked, setIsStemmingChecked] = useState(false);
  const [isEliminationChecked, setIsEliminationChecked] = useState(false);
  const [isIDFDocumentChecked, setIsIDFDocumentChecked] = useState(false);
  const [isCosineDocumentChecked, setIsCosineDocumentChecked] = useState(false);
  const [isAddAllTermsChecked, setIsAddAllTermsChecked] = useState(false);
  const [isIDFQueryChecked, setIsIDFQueryChecked] = useState(false);
  const [isCosineQueryChecked, setIsCosineQueryChecked] = useState(false);
  const [isInvertedDocumentChecked, setIsInvertedDocumentChecked] = useState(false);
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(0);
  const [maxTerms, setMaxTerms] = useState(0);
  const [windowSize, setWindowSize] = useState(5);
  const [miThreshold, setMiThreshold] = useState(5);

  const [selectedOption, setSelectedOption] = useState('');
  const isInteractive = selectedOption === 'interactive';
  const isBatch = selectedOption === 'batch';
  const [queryFile, setQueryFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [relevanceFile, setRelevanceFile] = useState<File | null>(null);

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
    'config.do_inverted_file': false,
    'config.max_terms': 5,
    'config.window_size': 5,
    'config.mi_threshold': 4,
    'config.do_query_expansion': false,
    top_k: -1,
  });

  // Function to update parameters
  const updateParam = <T extends keyof SearchParams>(key: T, value: SearchParams[T]) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  // Function to handle form submission
  const handleFormSubmit = () => {
    if (!selectedOption) {
      alert("Please select a query method: Interactive or Batch.");
      return;
    }

    // === INTERACTIVE mode validations ===
    if (selectedOption === 'interactive') {
      if (!query.trim()) {
        alert("Please enter your query input.");
        return;
      }

      const updatedParams = {
        ...params,
        q: query,
        'config.max_terms': isAddAllTermsChecked ? -1 : maxTerms,
        'config.window_size': windowSize,
        'config.mi_threshold': miThreshold,
        top_k: -1,
      };

      setParams(updatedParams);
      console.log("Submitting parameters (interactive):", updatedParams);
      onSubmitInteractive(updatedParams);
      return;
    }

    // === BATCH mode validations ===
    if (selectedOption === 'batch') {
      if (!queryFile || !relevanceFile) {
        alert("Please upload all required batch files: Query and Relevance Judgement file.");
        return;
      }
      const updatedParams = {
        ...params,
        'config.max_terms': isAddAllTermsChecked ? -1 : maxTerms,
        'config.window_size': windowSize,
        'config.mi_threshold': miThreshold,
        top_k: 10
      };

      const formData = new FormData();
      formData.append("queries", queryFile);
      // formData.append("documents", documentFile);
      formData.append("relevance", relevanceFile);

      console.log("Submitting parameters (batch):", formData);
      onSubmitBatch(updatedParams,formData);
    }
  };

  // Handlers for toggle switches
  // These handlers update the state and call the updateParam function to set the corresponding parameter
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

  const handleInvertedDocumentToggle = () => {
    const newValue = !isInvertedDocumentChecked;
    setIsInvertedDocumentChecked(newValue);
    if (newValue) {
      // Handling checked state
      console.log("🔍 Inverted Document is checked");
      updateParam('config.do_inverted_file', true);
    } else {
      // Handling unchecked state
      console.log("❌ Inverted Document is unchecked");
      updateParam('config.do_inverted_file', false);
    }
  }

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
  
  // Handlers for file uploads
  // These handlers will be called when the user selects a file for each respective input
  const handleQueryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQueryFile(file);
      console.log("Query file uploaded:", file.name);
      // You can also read the file content here if needed
    } else {
      console.error("No file selected for query upload.");
    }
  };

  const handleDocumentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      console.log("Document file uploaded:", file.name);
      // You can also read the file content here if needed
    } else {
      console.error("No file selected for document upload.");
    }
  };

  const handleRelevanceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRelevanceFile(file);
      console.log("Relevance judgement file uploaded:", file.name);
      // You can also read the file content here if needed
    } else {
      console.error("No file selected for relevance judgement upload.");
    }
  };

  return (
    <div className="py-4 px-4 border rounded-xl text-white bg-gray-800 shadow-lg w-full">
      <div className="flex flex-row gap-4">
        
        {/* Left Section: Parameters & Toggles */}
        <div className="flex flex-col gap-4 w-1/3 pr-1 justify-center align-middle">
          <div className="flex flex-row justify-between items-center pb-3 border-b-2">

            {/* Stemming Toggle */}
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">Stemming:</h2>
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  checked={isStemmingChecked}
                  onChange={handleStemmingToggle}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 bg-gray-300 rounded-md relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
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
                <div className="w-5 h-5 bg-gray-300 rounded-md relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
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
          <div className="flex flex-row w-full pt-3 border-t-2 justify-between items-center">
            {/* Max Terms */}
            <div className="flex items-center gap-3 w-full">
              <h2 className="text-base font-semibold mt-[0.125rem]">Max Terms:</h2>
              <input
                type="number"
                disabled={isAddAllTermsChecked}
                className={`p-1 bg-gray-700 text-white rounded-md text-sm w-20
                  ${isAddAllTermsChecked ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                placeholder="Enter"
                min={0}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                value={maxTerms}
                onChange={(e) => setMaxTerms(Number(e.target.value))}
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
                  <div className="w-5 h-5 bg-gray-300 rounded-md relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
                    {isAddAllTermsChecked && (
                      <span className="text-white text-xs font-bold">✔</span>
                    )}
                  </div>
                </label>
              </div>
            </div>
          
          {/* Thesaurus Options */}
          <div className="flex flex-row w-full pt-3 border-t-2 align-middle justify-between items-center">
            <h2 className="text-base font-semibold">Thesaurus Options:</h2>

            <div className="flex flex-row gap-5 items-center">
              {/* Window Size */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold">Window Size:</label>
                <input
                  type="number"
                  className="p-1 bg-gray-700 text-white rounded-md text-sm w-[3.5rem]"
                  placeholder="Enter"
                  min={1}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(e) => setWindowSize(Number(e.target.value))}
                  value={windowSize}
                />
              </div>

              {/* MI Threshold */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold">MI Threshold:</label>
                <input
                  type="number"
                  className="p-1 bg-gray-700 text-white rounded-md text-sm w-[3.5rem]"
                  placeholder="Enter"
                  min={1}
                  onChange={(e) => setMiThreshold(Number(e.target.value))}
                  value={miThreshold}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-[0.125rem] bg-white" />

        {/* Right Section: Query Method */}
        <div className="flex flex-col w-2/3 pl-1">
          {/* Query Weighting */}
          <div className="flex flex-row gap-7 mb-2 border-b-2 pb-3">
            <h2 className={`font-semibold text-white`}>
              Query Weighting:
            </h2>

            {/* TF */}
            <div className="flex flex-row justify-between items-center ml-auto">
              <h2 className={`text-sm justify-center align-center text-center mr-2 font-semibold text-white`}>
                TF
              </h2>
              <select
                className={`p-1 bg-gray-700 text-white rounded-md text-sm`}
                value={params['weights.query.tf']}
                onChange={(e) =>
                  updateParam('weights.query.tf', e.target.value as SearchParams['weights.query.tf'])
                }
              >
                <option value="l">Logarithmic</option>
                <option value="b">Binary</option>
                <option value="a">Augmented</option>
                <option value="n">Raw</option>
              </select>
            </div>

            {/* IDF */}
            <div className="flex items-center justify-between">
              <h2 className={`text-sm justify-center align-center text-center mr-2 font-semibold text-white`}>
                IDF
              </h2>
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  checked={isIDFQueryChecked}
                  onChange={handleIDFQueryToggle}
                  className="sr-only peer"
                />
                <div
                  className={`w-5 h-5 rounded-md transition-colors duration-300 flex items-center justify-center
                    bg-gray-300 peer-checked:bg-blue-500 cursor-pointer`}
                >
                  {isIDFQueryChecked && (
                    <span className="text-white text-xs font-bold">✔</span>
                  )}
                </div>
              </label>
            </div>

            {/* Cosine */}
            <div className="flex items-center justify-between">
              <h2 className={`text-sm justify-center align-center text-center mr-2 font-semibold text-white`}>
                Cosine
              </h2>
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  checked={isCosineQueryChecked}
                  onChange={handleCosineQueryToggle}
                  className="sr-only peer"
                />
                <div
                  className={`w-5 h-5 rounded-md transition-colors duration-300 flex items-center justify-center
                    bg-gray-300 peer-checked:bg-blue-500 cursor-pointer`}
                >
                  {isCosineQueryChecked && (
                    <span className="text-white text-xs font-bold">✔</span>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Query Method Section */}
          <div className="flex flex-col gap-2 w-full justify-center align-middle">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold mt-1">Query Method:</h2>
              </div>

              {/* Interactive */}
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="radio"
                  name="queryMethod"
                  value="interactive"
                  onChange={() => setSelectedOption("interactive")}
                  className="sr-only peer"
                />
                <span className="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200"></span>
                <span className="ml-2 text-sm font-semibold">Interactive</span>
              </label>
              <textarea
                rows={2}
                disabled={!isInteractive}
                className={`p-1 bg-gray-700 text-white rounded-md text-sm w-full resize-none
                  ${!isInteractive ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                placeholder="Enter your query input"
                onChange={(e) => setQuery(e.target.value)}
              />

              {/* Batch */}
              <label className="inline-flex items-center cursor-pointer relative mt-2">
                <input
                  type="radio"
                  name="queryMethod"
                  value="batch"
                  onChange={() => setSelectedOption("batch")}
                  className="sr-only peer"
                />
                <span className="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200"></span>
                <span className="ml-2 text-sm font-semibold">Batch</span>
              </label>

              {/* Load files in 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {/* Query file */}
                <div className="flex flex-col">
                  <label className={`text-xs font-medium mb-1 ${!isBatch ? 'text-gray-500' : 'text-white'}`}>
                    Query File
                  </label>
                  <input
                    type="file"
                    accept="*"
                    disabled={!isBatch}
                    className={`p-1 bg-gray-700 text-white rounded-md text-xs border border-gray-600 transition-colors duration-200 cursor-pointer
                      ${!isBatch ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-gray-600'}`}
                    onChange={handleQueryFileUpload}
                  />
                </div>

                {/* Relevance Judgment file */}
                <div className="flex flex-col">
                  <label className={`text-xs font-medium mb-1 ${!isBatch ? 'text-gray-500' : 'text-white'}`}>
                    Relevance Judgement File
                  </label>
                  <input
                    type="file"
                    accept="*"
                    disabled={!isBatch}
                    className={`p-1 bg-gray-700 text-white rounded-md text-xs border border-gray-600 transition-colors duration-200 cursor-pointer
                      ${!isBatch ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-gray-600'}`}
                    onChange={handleRelevanceFileUpload}
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
        className="font-semibold mt-7 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 w-full transition-colors duration-300"
      >
        Submit
      </button>
    </div>
  );
}