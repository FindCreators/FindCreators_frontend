import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import debounce from "lodash/debounce";
import CreatorProfileModal from "../../../components/dashboard/creator/CreatorProfileModal";
import { getBrandProfile } from "../../../network/networkCalls";

const CreatorSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showCreatorProfile, setShowCreatorProfile] = useState(false);
  const [brandData, setBrandData] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await getBrandProfile();
        if (response.data) {
          setBrandData(response.data?.[0] || response.data);
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    fetchBrandData();
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery?.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://findcreators-537037621947.asia-south2.run.app/api/creator-search-suggestion?query=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token") || "",
          },
        }
      );
      const data = await response.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCreatorProfile = async (fullName) => {
    if (!fullName) return;

    try {
      const response = await fetch(
        `https://findcreators-537037621947.asia-south2.run.app/api/creator?fullName=${encodeURIComponent(
          fullName
        )}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token") || "",
          },
        }
      );
      const data = await response.json();
      if (data?.data?.[0]) {
        setSelectedCreator(data.data[0]);
        setShowCreatorProfile(true);
      }
    } catch (error) {
      console.error("Error fetching creator profile:", error);
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

  const handleSuggestionClick = (suggestion) => {
    if (!suggestion?.fullName) return;

    setQuery(suggestion.fullName);
    setShowSuggestions(false);
    fetchCreatorProfile(suggestion.fullName);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
  };

  return (
    <>
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

        {showSuggestions && suggestions && suggestions.length > 0 && (
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
                {suggestion?.fullName || "Unnamed Creator"}
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

      <CreatorProfileModal
        creator={selectedCreator}
        isOpen={showCreatorProfile}
        onClose={() => setShowCreatorProfile(false)}
        brandId={brandData?.id}
      />
    </>
  );
};

export default CreatorSearch;
