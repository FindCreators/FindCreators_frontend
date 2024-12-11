import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/LoginSignup/Login";
import Signup from "./pages/LoginSignup/Signup";
import Profile from "./pages/Profile/Profile";
import NavBar from "./components/Navbar/Navbar";

import DashboardLayout from "./components/dashboard/layout/DashboardLayout";
import ApplicationTracker from "./components/dashboard/creator/ApplicationTracker";
import PostJob from "./pages/dashboard/brand/PostJob";
import AvailableJobs from "./pages/dashboard/creator/AvailableJobs";
import BrandDashboard from "./pages/dashboard/brand/BrandDashboard";
import CreatorDashboard from "./pages/dashboard/creator/CreatorDashboard";
import MyJobs from "./pages/dashboard/brand/MyJobs";
import JobProposals from "./pages/dashboard/brand/JobProposals";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/brand" element={<DashboardLayout userType="brand" />}>
          <Route index element={<BrandDashboard />} />
          <Route path="jobs" element={<MyJobs />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="jobs/:jobId/proposals" element={<JobProposals />} />
        </Route>

        <Route path="/creator" element={<DashboardLayout userType="creator" />}>
          <Route index element={<CreatorDashboard />} />
          <Route path="available-jobs" element={<AvailableJobs />} />
          <Route path="my-applications" element={<ApplicationTracker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
