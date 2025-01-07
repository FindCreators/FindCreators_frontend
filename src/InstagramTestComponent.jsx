import React, { useEffect, useState } from "react";

const InstagramAuth = () => {
  const [error, setError] = useState(null);

  const CLIENT_ID = process.env.REACT_APP_INSTAGRAM_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_INSTAGRAM_REDIRECT_URI;

  // Correct scopes for Instagram Basic Display API
  const SCOPE = "user_profile,user_media";

  // Generate Instagram authorization URL
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=code`;

  useEffect(() => {
    const handleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const response = await fetch("/api/instagram/exchange-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          });

          const data = await response.json();

          if (data.access_token) {
            localStorage.setItem("instagram_access_token", data.access_token);
            window.location.href = "/profile";
          }
        } catch (err) {
          setError("Failed to exchange code for access token");
          console.error(err);
        }
      }
    };

    handleAuth();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-400 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">
        Connect Your Instagram Account
      </h1>
      <button
        onClick={() => (window.location.href = authUrl)}
        className="px-4 py-2 text-white rounded bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        Connect Instagram
      </button>
    </div>
  );
};

export default InstagramAuth;
