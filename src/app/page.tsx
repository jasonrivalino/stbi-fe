"use client";
import { useState } from "react";

type MenuProps = {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  onSubmit: () => void;
};

export function Menu({ setSelectedOption, onSubmit }: MenuProps) {
  const [isStemmingChecked, setIsStemmingChecked] = useState(false);
  const [isEliminationChecked, setIsEliminationChecked] = useState(false);
  const [isIDFChecked, setIsIDFChecked] = useState(false);
  const [isCosineChecked, setIsCosineChecked] = useState(false);
  const [isAddAllTermsChecked, setIsAddAllTermsChecked] = useState(false);

  const handleStemmingToggle = () => {
    const newValue = !isStemmingChecked;
    setIsStemmingChecked(newValue);
    setSelectedOption(newValue ? "stemming" : "");

    if (newValue) {
      // Handling checked state
      console.log("🔍 Stemming is checked");
    } else {
      // Handling unchecked state
      console.log("❌ Stemming is unchecked");
    }
  };

  const handleEliminationToggle = () => {
    const newValue = !isEliminationChecked;
    setIsEliminationChecked(newValue);
    setSelectedOption(newValue ? "elimination" : "");

    if (newValue) {
      // Handling checked state
      console.log("🔍 Elimination is checked");
    } else {
      // Handling unchecked state
      console.log("❌ Elimination is unchecked");
    }
  };

  const handleIDFToggle = () => {
    const newValue = !isIDFChecked;
    setIsIDFChecked(newValue);
    setSelectedOption(newValue ? "idf" : "");
    
    if (newValue) {
      // Handling checked state
      console.log("🔍 IDF is checked");
    } else {
      // Handling unchecked state
      console.log("❌ IDF is unchecked");
    }
  };

  const handleCosineToggle = () => {
    const newValue = !isCosineChecked;
    setIsCosineChecked(newValue);
    setSelectedOption(newValue ? "cosine" : "");

    if (newValue) {
      // Handling checked state
      console.log("🔍 Cosine is checked");
    } else {
      // Handling unchecked state
      console.log("❌ Cosine is unchecked");
    }
  };

  const handleAddAllTermsToggle = () => {
    const newValue = !isAddAllTermsChecked;
    setIsAddAllTermsChecked(newValue);
    setSelectedOption(newValue ? "addAllTerms" : "");
    
    if (newValue) {
      // Handling checked state
      console.log("🔍 Add All Terms is checked");
    } else {
      // Handling unchecked state
      console.log("❌ Add All Terms is unchecked");
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


          {/* Weighting Method */}
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">Weighting Method:</h2>
            
            {/* TF */}
            <div className="flex flex-row justify-between items-center">
              <h3 className="text-sm justify-center align-center text-center mt-1"> 
                Term Frequency
              </h3>
              <select
                className="p-1 bg-gray-700 text-white rounded-md text-sm"
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">Select a method</option>
                <option value="logarithmic">Logarithmic</option>
                <option value="binary">Binary</option>
                <option value="augmented">Augmented</option>
                <option value="raw">Raw</option>
              </select>
            </div>

            {/* IDF */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm justify-center align-center text-center">Inverse Document Frequency</h2>
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  checked={isIDFChecked}
                  onChange={handleIDFToggle}
                  className="sr-only peer"
                />
                <div className="mt-1 w-5 h-5 bg-gray-300 rounded-md relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
                  {isIDFChecked && (
                    <span className="text-white text-xs font-bold">✔</span>
                  )}
                </div>
              </label>
            </div>

            {/* Cosine */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm justify-center align-center text-center">Cosine Normalization</h2>
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  checked={isCosineChecked}
                  onChange={handleCosineToggle}
                  className="sr-only peer"
                />
                <div className="mt-1 w-5 h-5 bg-gray-300 rounded-md relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
                  {isCosineChecked && (
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
                onChange={(e) => setSelectedOption(e.target.value)}
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
                  <div className="-mt-2 w-6 h-6 bg-gray-300 rounded-md relative transition-colors duration-300 peer-checked:bg-blue-500 flex items-center justify-center">
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
                  onChange={() => setSelectedOption("interactive")}
                  className="sr-only peer"
                />
                <span className="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200"></span>
                <span className="ml-2 text-sm font-semibold">Interactive</span>
              </label>
              <textarea
                rows={2}
                className="p-1 bg-gray-700 text-white rounded-md text-sm w-full resize-none"
                placeholder="Enter your query input"
                onChange={(e) => setSelectedOption(e.target.value)}
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
        onClick={onSubmit}
        className="mt-6 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 w-full transition-colors duration-300"
      >
        Submit
      </button>
    </div>
  );
}

type ResultProps = {
  selected: string;
};

export function Result({ selected }: ResultProps) {
  return (
    <div className="p-4 border rounded-md bg-gray-100 h-full shadow-lg">
      <h1 className="text-xl font-bold mb-2 text-black">Result</h1>
      <p className="text-black">
        {selected
          ? `You selected: ${selected}`
          : "Please select a menu option and submit."}
      </p>
    </div>
  );
}

export default function Home() {
  const [selectedOption, setSelectedOption] = useState("");
  const [submittedOption, setSubmittedOption] = useState("");

  const handleSubmit = () => {
    setSubmittedOption(selectedOption);
    alert(`You selected: ${selectedOption}`);
    // Here you can add logic to handle the selected option
    // For example, you could navigate to a different page or fetch data based on the selection
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-16">
      <div className="flex flex-col gap-4 items-center justify-center w-full">
        <h1 className="text-3xl font-bold pt-8 pb-4 text-center">
          Query Expansion: Automatically Generated Thesaurus Method
        </h1>
        <div className="flex flex-row w-full gap-6">
          <div className="w-4/5">
             <Menu
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onSubmit={handleSubmit}
            />
          </div>
          <div className="w-full">
            <Result selected={submittedOption} />
          </div>
        </div>
      </div>
    </main>
  );
}
