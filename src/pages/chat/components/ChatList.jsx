import React, { useEffect, useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { useSelector } from "react-redux";

const ChatList = ({ user, client, setChannel }) => {
  const [channels, setChannels] = useState(null);
  const userType = useSelector((state) => state.auth.userType);

  useEffect(() => {
    const getChannels = async () => {
      const filters = { members: { $in: [user?.id] } };
      const sort = { last_message_at: -1 };
      const chans = await client.queryChannels(filters, sort);
      setChannels(chans);
    };

    if (!channels) {
      getChannels();
    }

    const handleNewMessage = (event) => {
      if (event.type === 'message.new') {
        getChannels();
      }
    };

    const handleMessageRead = (event) => {
      if (event.type === 'message.read') {
        getChannels();
      }
    };

    client.on('message.new', handleNewMessage);
    client.on('message.read', handleMessageRead);

    return () => {
      client.off('message.new', handleNewMessage);
      client.off('message.read', handleMessageRead);
    };
  }, [channels, client, user]);

  const formatLastMessageDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return format(new Date(date), 'hh:mm a');
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white overflow-hidden">
      <div className="bg-blue-600 text-white p-4 text-center text-xl font-bold">
        Messages
      </div>
      {channels && channels.length > 0 ? (
        channels.map((channel, index) => {
          const lastMessage = channel.state.messages[channel.state.messages.length - 1];
          const unreadCount = channel.state.read[user.id]?.unread_messages || 0;
          const isOnline = channel.state.members[channel.data.id]?.user?.online;

          // Update channel data based on user type
          const channelName = userType === "creator" ? channel.data.brandName : channel.data.creatorName;
          const channelImage = userType === "creator" ? channel.data.brandImage : channel.data.creatorImage;

          return (
            <div
              key={index}
              className="p-4 border-b border-gray-200 flex items-center justify-between cursor-pointer transition-transform duration-300 ease-in-out"
              onClick={() => setChannel(channel)}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <img src={channelImage} alt={channelName} className="w-10 h-10 rounded-full" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{channelName}</h3>
                  <p className="text-sm text-gray-500">{lastMessage?.text || 'No messages'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-xs text-gray-500 mr-2">
                  {lastMessage && formatLastMessageDate(lastMessage.created_at)}
                </div>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs mr-2">
                    {unreadCount}
                  </span>
                )}
                {isOnline && (
                  <span className="text-green-500 text-xs">Online</span>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-4 text-center text-gray-500">
          <p className="text-lg font-medium">No Chat Yet</p>
          {userType === "brand" && <p className="text-sm">Start a conversation to see your chats here.</p>}
          {userType === "creator" && <p className="text-sm">You will see conversations here when Brands initiate chat with you.</p>}
        </div>
      )}
    </div>
  );
};

export default ChatList;
