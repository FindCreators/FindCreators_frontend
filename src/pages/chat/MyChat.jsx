import React, { useState, useEffect } from "react";
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
import { getUserToken } from "../../network/networkCalls";
import ChatList from "./components/ChatList";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { MessageCircle, Loader } from "lucide-react";
import axios from "axios";
import { makeRequest } from "../../network/apiHelpers";

const apiKey = "drugqfqnfynm";
const client = StreamChat.getInstance(apiKey);

const createStreamUser = async (userId, name, image) => {
  try {
    console.log("Creating Stream user:", userId);
    await makeRequest({
      method: "post",
      url: `api/chat-upsert-users?creatorId=${userId}`,
    });
  } catch (error) {
    console.error(`Error creating Stream user (${userId}):`, error);
    throw new Error("Failed to create or update Stream user.");
  }
};

const initializeStreamChannel = async (client, channelData) => {
  try {
    const channelId = `${channelData.brandId}-${channelData.creatorId}`;
    const channel = client.channel("messaging", channelId, {
      members: [channelData.brandId, channelData.creatorId],
      data: channelData,
      name: "FindCreators Chat",
    });

    await channel.watch();
    return channel;
  } catch (error) {
    console.error("Error initializing Stream channel:", error);
    throw new Error("Failed to initialize chat channel.");
  }
};

const MyChat = () => {
  const location = useLocation();
  const userType = useSelector((state) => state.auth.userType);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [channel, setChannel] = useState(null);
  const [user, setUser] = useState(null);
  const channelData = location.state?.channelData;

  useEffect(() => {
    let mounted = true;

    const initializeChat = async () => {
      setIsLoading(true);

      try {
        const tokenData = await getUserToken();
        if (!mounted) return;

        const currentUser = {
          id: tokenData.userId,
          name: tokenData.name,
          image: tokenData.image,
        };
        setUser(currentUser);

        if (channelData) {
          await createStreamUser(
            channelData.creatorId,
            channelData.creatorName,
            channelData.creatorImage
          );
        }

        if (client.userID) await client.disconnectUser();

        await client.connectUser(currentUser, tokenData.token);

        if (channelData) {
          const newChannel = await initializeStreamChannel(client, channelData);
          if (mounted) setChannel(newChannel);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (mounted) {
          setHasError(true);
          setErrorMessage("Failed to initialize chat. Please try again later.");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      mounted = false;
      if (client.userID) client.disconnectUser();
    };
  }, [location.state?.channelData, userType]);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-sm text-gray-500">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
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
              <MessageCircle className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">Your Messages</p>
              <p className="text-sm text-gray-500">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </Chat>
  );
};

export default MyChat;
