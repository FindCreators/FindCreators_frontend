import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { makeRequest } from "../../../network/apiHelpers";

const JobSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await makeRequest({
        url: `/api/search-suggestion?query=${encodeURIComponent(searchQuery)}`,
      });

      console.log("data", response);
      setSuggestions(response);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  useEffect(() => {
    debouncedFetchSuggestions(query);
    return () => debouncedFetchSuggestions.cancel();
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      navigate(
        `/creator/available-search-jobs?search=${encodeURIComponent(
          searchQuery
        )}`
      );
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    handleSearch(suggestion.title);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div
      className="relative w-full px-4 sm:px-0 sm:max-w-2xl mx-auto"
      ref={searchRef}
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyPress={(e) => e.key === "Enter" && handleSearch(query)}
          placeholder="Search for creators..."
          className="w-full px-3 sm:px-4 py-2 pl-9 sm:pl-10 pr-8 sm:pr-10 text-sm sm:text-base 
                   border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-2.5 sm:left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 sm:right-3 top-2.5 text-gray-400 
                     hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg 
                      border border-gray-200 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-3 sm:px-4 py-2.5 text-left text-sm sm:text-base
                       hover:bg-gray-50 focus:outline-none focus:bg-gray-50 
                       first:rounded-t-lg last:rounded-b-lg transition-colors
                       border-b last:border-b-0 border-gray-100"
            >
              {suggestion.title}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg 
                      border border-gray-200 p-3 sm:p-4 text-center text-sm sm:text-base 
                      text-gray-500"
        >
          Loading suggestions...
        </div>
      )}
    </div>
  );
};

export default JobSearch;
