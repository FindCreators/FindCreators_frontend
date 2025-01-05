import React, { useState } from "react";
import { Instagram, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const InstagramTestComponent = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [instagramData, setInstagramData] = useState({
    followers: null,
    posts: [],
  });

  // Step 1: Connect Instagram Account
  const handleConnectInstagram = async () => {
    try {
      setIsConnecting(true);

      // Redirect to Instagram OAuth URL
      const clientId = "1992628871241050"; // Replace with your Instagram App ID
      const redirectUri = encodeURIComponent(
        "http://localhost:3000/instagram-callback" // Replace with your callback URL
      );
      const scope = encodeURIComponent("user_profile,user_media");

      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting Instagram:", error);
      toast.error("Failed to connect Instagram. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Step 2: Fetch Instagram Data (Followers and Posts)
  const fetchInstagramData = async (accessToken) => {
    try {
      // Fetch Instagram profile data
      const profileResponse = await axios.get(
        `https://graph.instagram.com/me?fields=id,username,media_count,followers_count&access_token=${accessToken}`
      );

      const { followers_count, media_count } = profileResponse.data;

      // Fetch latest posts
      const mediaResponse = await axios.get(
        `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink&access_token=${accessToken}`
      );

      const posts = mediaResponse.data.data;

      // Update state with Instagram data
      setInstagramData({
        followers: followers_count,
        posts: posts,
      });

      toast.success("Instagram data fetched successfully!");
    } catch (error) {
      console.error("Error fetching Instagram data:", error);
      toast.error("Failed to fetch Instagram data. Please try again.");
    }
  };

  // Step 3: Handle Instagram Callback
  const handleInstagramCallback = async (code) => {
    try {
      setIsConnecting(true);

      // Exchange code for access token
      const response = await axios.post("/api/instagram/exchange-token", {
        code,
      });

      const { accessToken } = response.data;

      // Fetch Instagram data using the access token
      await fetchInstagramData(accessToken);
    } catch (error) {
      console.error("Error handling Instagram callback:", error);
      toast.error("Failed to connect Instagram. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Simulate Instagram callback (for testing purposes)
  const simulateInstagramCallback = () => {
    const code = "SIMULATED_CODE"; // Replace with a simulated code for testing
    handleInstagramCallback(code);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Instagram Test Component</h2>

      {/* Connect Instagram Button */}
      <button
        onClick={handleConnectInstagram}
        disabled={isConnecting}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4"
      >
        {isConnecting ? (
          <Loader2 className="w-5 h-5 animate-spin" /> // Show spinner while connecting
        ) : (
          <Instagram className="w-5 h-5" />
        )}
        <span>Connect Instagram</span>
      </button>

      {/* Simulate Instagram Callback (for testing) */}
      <button
        onClick={simulateInstagramCallback}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-4"
      >
        Simulate Instagram Callback
      </button>

      {/* Display Instagram Data */}
      {instagramData.followers !== null && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Instagram Data</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Followers</p>
              <p className="text-xl font-bold">{instagramData.followers}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Posts</p>
              <p className="text-xl font-bold">{instagramData.posts.length}</p>
            </div>
          </div>

          {/* Display Latest Posts */}
          <h4 className="text-lg font-semibold mb-2">Latest Posts</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {instagramData.posts.map((post) => (
              <div key={post.id} className="bg-gray-50 p-4 rounded-lg">
                <img
                  src={post.media_url}
                  alt={post.caption || "Instagram Post"}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <p className="text-sm text-gray-600">
                  {post.caption || "No caption"}
                </p>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on Instagram
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramTestComponent;
