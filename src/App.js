import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./index.css";
import Home from "./pages/Home/Home";
import Login from "./pages/LoginSignup/Login";
import Signup from "./pages/LoginSignup/Signup";
import BrandProfile from "./pages/dashboard/brand/BrandProfile";
import CreatorProfile from "./components/dashboard/creator/CreatorProfile";
import NavBar from "./components/Navbar/Navbar";
import DashboardLayout from "./components/dashboard/layout/DashboardLayout";
import CreatorDashboardLayout from "./components/dashboard/layout/CreatorDashboardLayout";
import BrandDashboard from "./pages/dashboard/brand/BrandDashboard";
import MyJobs from "./pages/dashboard/brand/MyJobs";
import PostJob from "./pages/dashboard/brand/PostJob";
import JobProposals from "./pages/dashboard/brand/JobProposals";
import CreatorDashboard from "./pages/dashboard/creator/CreatorDashboard";
import AvailableJobs from "./pages/dashboard/creator/AvailableJobs";
import ApplicationTracker from "./components/dashboard/creator/ApplicationTracker";
import MyChat from "./pages/chat/MyChat";
import EditJob from "./pages/dashboard/brand/EditJob";
import SendOffer from "./pages/dashboard/brand/SendOffer";

function AppContent() {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/brand" element={<DashboardLayout userType="brand" />}>
          <Route index element={<BrandDashboard />} />
          <Route path="profile" element={<BrandProfile />} />
          <Route path="jobs" element={<MyJobs />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="jobs/:jobId/proposals" element={<JobProposals />} />
          <Route path="send-offer" element={<SendOffer />} />
          <Route path="jobs/:jobId/edit" element={<EditJob />} />{" "}
        </Route>
        <Route
          path="/creator"
          element={<CreatorDashboardLayout userType="creator" />}
        >
          <Route index element={<CreatorDashboard />} />
          <Route path="profile" element={<CreatorProfile />} />
          <Route path="available-jobs" element={<AvailableJobs />} />
          <Route path="my-applications" element={<ApplicationTracker />} />
        </Route>
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
