import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import "./index.css"; // Ensure you have this file to include Tailwind CSS

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
import MyChat from "./pages/chat/MyChat";

function AppContent() {
  const location = useLocation();

  // Fetch user token and initialize Stream Chat user

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
        <Route path="/chat" element={<MyChat />} />
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
