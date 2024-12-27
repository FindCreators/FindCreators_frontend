import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { StreamChat } from "stream-chat";
import {
  Chat,
  ChannelList,
  Channel,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/LoginSignup/Login";
import Signup from "./pages/LoginSignup/Signup";
import BrandProfile from "./pages/dashboard/brand/BrandProfile";
import CreatorProfile from "./components/dashboard/creator/CreatorProfile";

// Components
import NavBar from "./components/Navbar/Navbar";
import DashboardLayout from "./components/dashboard/layout/DashboardLayout";
import CreatorDashboardLayout from "./components/dashboard/layout/CreatorDashboardLayout";

// Brand Dashboard Pages
import BrandDashboard from "./pages/dashboard/brand/BrandDashboard";
import MyJobs from "./pages/dashboard/brand/MyJobs";
import PostJob from "./pages/dashboard/brand/PostJob";
import JobProposals from "./pages/dashboard/brand/JobProposals";

// Creator Dashboard Pages
import CreatorDashboard from "./pages/dashboard/creator/CreatorDashboard";
import AvailableJobs from "./pages/dashboard/creator/AvailableJobs";
import ApplicationTracker from "./components/dashboard/creator/ApplicationTracker";

// API
import { getUserToken } from "./network/networkCalls";

// Initialize Stream Chat
const apiKey = "drugqfqnfynm"; // Replace with your actual API key
const client = StreamChat.getInstance(apiKey);

function AppContent() {
  const location = useLocation();
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [channel, setChannel] = useState(null);

  // Fetch user token and initialize Stream Chat user
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
    const connectUserAndCreateChannel = async () => {
      if (!userToken || !user) {
        return;
      }
      await client.connectUser(user, client.devToken(user.id));
      console.log("User connected successfully");

      // Create a channel for messaging
      // const channel = client.channel("messaging", "findcreators", {
      //   name: "FindCreators Chat",
      //   image: "https://bit.ly/2O35mws",
      //   members: ["67646e356fce57a11e76bfc2",],
      // });

      const channel = client.channel("messaging", "findcreators", {
        name: "FindCreators Chat",
        image: "https://bit.ly/2O35mws",
        members: [user.id],
      });
      await channel.watch();
      console.log("Channel created successfully");
      setChannel(channel);
    };

    connectUserAndCreateChannel();

    if (client) {
      client.on("connection.recovered", () => {
        console.log("Connection recovered");
      });
    }
  }, [userToken, user]);

  // Display error or loading state

  if (hasError) {
    return (
      <div>Error initializing the application. Please try again later.</div>
    );
  }

  return (
    <>
      {/* Show NavBar only on the Home route */}
      {location.pathname === "/" && <NavBar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Brand Dashboard Routes */}
        <Route path="/brand" element={<DashboardLayout userType="brand" />}>
          <Route index element={<BrandDashboard />} />
          <Route path="profile" element={<BrandProfile />} />
          <Route path="jobs" element={<MyJobs />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="jobs/:jobId/proposals" element={<JobProposals />} />
        </Route>

        {/* Creator Dashboard Routes */}
        <Route
          path="/creator"
          element={<CreatorDashboardLayout userType="creator" />}
        >
          <Route index element={<CreatorDashboard />} />
          <Route path="profile" element={<CreatorProfile />} />
          <Route path="available-jobs" element={<AvailableJobs />} />
          <Route path="my-applications" element={<ApplicationTracker />} />
        </Route>

        {/* Stream Chat Route */}
        <Route
          path="/chat"
          element={
            <Chat client={client} theme="messaging light">
              <ChannelList
                filters={{ type: "messaging", members: { $in: [user?.id] } }}
                sort={{ last_message_at: -1 }}
                options={{ limit: 20 }}
                ListEmptyIndicator={() => <p>No channels available</p>}
              />
              <Channel channel={channel}>
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            </Chat>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
