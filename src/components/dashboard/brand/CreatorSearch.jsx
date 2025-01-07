import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import debounce from "lodash/debounce";

const CreatorSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showCreatorProfile, setShowCreatorProfile] = useState(false);
  const searchRef = useRef(null);

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

  useEffect(() => {
    if (showCreatorProfile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCreatorProfile]);

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

  const formatFollowers = (count) => {
    if (!count && count !== 0) return "0";
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
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

      {/* Modal */}
      {showCreatorProfile && selectedCreator && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowCreatorProfile(false)}
          ></div>

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-xl font-semibold">Creator Profile</h3>
                <button
                  onClick={() => setShowCreatorProfile(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Profile Header */}
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex-shrink-0">
                    {selectedCreator.profilePicture && (
                      <img
                        src={selectedCreator.profilePicture}
                        alt={selectedCreator.fullName}
                        className="h-full w-full object-cover rounded-full"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedCreator.fullName || "Unnamed Creator"}
                    </h3>
                    <p className="text-gray-600">
                      {selectedCreator.location?.city || "City"},{" "}
                      {selectedCreator.location?.country || "Country"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedCreator.bio || "No bio available"}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Minimum Rate</p>
                    <p className="text-lg font-semibold">
                      ${selectedCreator.minimumRate || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-lg font-semibold">
                      {(selectedCreator.rating || 0).toFixed(1)} (
                      {selectedCreator.reviewCount || 0})
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                    <p className="text-lg font-semibold">
                      {(selectedCreator.engagementRate || 0).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Total Earned</p>
                    <p className="text-lg font-semibold">
                      ${selectedCreator.totalEarned || 0}
                    </p>
                  </div>
                </div>

                {/* Social Handles */}
                {selectedCreator.socialHandles &&
                  selectedCreator.socialHandles.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">
                        Social Media Presence
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCreator.socialHandles.map((social, index) => (
                          <a
                            key={index}
                            href={social?.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <span className="font-medium">
                              {social?.platform || "Platform"}
                            </span>
                            <span className="text-gray-600">
                              {formatFollowers(social?.followers)} followers
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Skills & Expertise */}
                {selectedCreator.skills &&
                  selectedCreator.skills.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">
                        Skills & Expertise
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCreator.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Languages */}
                {selectedCreator.languages &&
                  selectedCreator.languages.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCreator.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatorSearch;
