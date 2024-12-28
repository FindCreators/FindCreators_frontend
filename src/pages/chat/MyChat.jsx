import React, { useState, useEffect } from 'react';
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { getUserToken } from '../../network/networkCalls';
import ChatList from './components/ChatList';
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import { MessageCircle } from 'lucide-react'; // Import the MessageCircle icon from Lucide React

// Initialize Stream Chat
const apiKey = "drugqfqnfynm"; // Replace with your actual API key
const client = StreamChat.getInstance(apiKey);

const MyChat = () => {
  const location = useLocation();
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [channel, setChannel] = useState(null);
  const [user, setUser] = useState(null);
  const userType = useSelector((state) => state.auth.userType);

  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        setIsLoading(true);
        const data = await getUserToken();
        console.log("Fetched token data:", data);

        // Set user data for Stream Chat
        setUserToken(data.token);
        setUser({
          id: data.userId,
          name: data.name,
          image: data.image,
        });
      } catch (error) {
        console.error("Error fetching user token:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserToken();
  }, []);

  // Connect user to Stream Chat client and create channel
  useEffect(() => {
    const connectUser = async () => {
      if (!userToken || !user) {
        return;
      }
      await client.connectUser(user, userToken);
      console.log("User connected successfully");

      const channelData = location.state?.channelData;
      if (channelData) {
        const channelId = `${channelData.brandId}-${channelData.creatorId}`;
        const chan = client.channel("messaging", channelId, {
            name: "FindCreators Chat",
            image: "https://bit.ly/2O35mws",
            members: [channelData.creatorId, channelData.brandId],
            creatorId: channelData.creatorId,
            creatorName: channelData.creatorName,
            brandId: channelData.brandId,
            brandName: channelData.brandName,
            creatorImage: channelData.creatorImage,
            brandImage: channelData.brandImage,
          });
          setChannel(chan)
          console.log("Channel created successfully");
      }
    };

    connectUser();

    if (client) {
      client.on("connection.recovered", () => {
        console.log("Connection recovered");
      });
    }
  }, [userToken, user, location.state?.channelData, userType]);

  // Display error or loading state
  if (hasError) {
    return (
      <div>Error initializing the application. Please try again later.</div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Chat client={client} theme="messaging light">
      <div className="flex h-screen">
        <div className="w-1/4 border-r border-gray-200">
          <ChatList user={user} client={client} setChannel={setChannel} />
        </div>
        {channel ? (
          <div className="w-3/4">
            <Channel channel={channel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </div>
        ) : (
          <div className="w-3/4 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="mx-auto mb-4 w-24 h-24 text-gray-400" />
              <p className="text-lg font-medium text-gray-900">Your Messages</p>
              <p className="text-sm text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </Chat>
  );
};

export default MyChat;
