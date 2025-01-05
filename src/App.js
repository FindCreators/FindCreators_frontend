//App.js
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useAuth } from "./hooks/useAuth";
import "./index.css";

// Import components
import Login from "./pages/LoginSignup/Login";
import Signup from "./pages/LoginSignup/Signup";
import NavBar from "./components/Navbar/Navbar";
import DashboardLayout from "./components/dashboard/layout/DashboardLayout";
import CreatorDashboardLayout from "./components/dashboard/layout/CreatorDashboardLayout";
import BrandDashboard from "./pages/dashboard/brand/BrandDashboard";
import CreatorDashboard from "./pages/dashboard/creator/CreatorDashboard";
import MyJobs from "./pages/dashboard/brand/MyJobs";
import PostJob from "./pages/dashboard/brand/PostJob";
import JobProposals from "./pages/dashboard/brand/JobProposals";
import SendOffer from "./pages/dashboard/brand/SendOffer";
import EditJob from "./pages/dashboard/brand/EditJob";
import AvailableJobs from "./pages/dashboard/creator/AvailableJobs";
import JobDetails from "./pages/dashboard/creator/JobDetails";
import MyApplications from "./pages/dashboard/creator/MyApplications";
import InProgressJobs from "./pages/dashboard/creator/InProgressJobs";
import ReceivedOffers from "./pages/dashboard/creator/ReceivedOffers";
import MyChat from "./pages/chat/MyChat";
import BrandProfile from "./pages/dashboard/brand/BrandProfile";
import CreatorProfile from "./components/dashboard/creator/CreatorProfile";
import SearchResults from "./pages/dashboard/creator/SearchResults";
import JobSubmissions from "./pages/dashboard/brand/JobSubmissions";
import CreatorJobSubmissions from "./pages/dashboard/creator/CreatorJobSubmissions";
import OffersManagement from "./pages/dashboard/brand/OffersManagement";
import InstagramTestComponent from "./InstagramTestComponent";

const PrivateRoute = ({ type }) => {
  const { isAuthenticated, userType } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (type && userType !== type) {
    return <Navigate to={`/${userType}`} replace />;
  }

  return <Outlet />;
};

const RedirectBasedOnAuth = () => {
  const { isAuthenticated, userType } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={`/${userType}`} replace />;
  }

  return <Navigate to="/signup" replace />;
};

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();

  useEffect(() => {
    if (
      !isAuthenticated &&
      !["/", "/signup", "/login"].includes(location.pathname)
    ) {
      navigate("/signup");
    } else if (
      isAuthenticated &&
      ["/", "/signup", "/login"].includes(location.pathname)
    ) {
      navigate(`/${userType}`);
    }
  }, [isAuthenticated, userType, location.pathname, navigate]);

  return (
    <>
      {location.pathname === "/" && <NavBar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<RedirectBasedOnAuth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Brand routes */}
        <Route element={<PrivateRoute type="brand" />}>
          <Route path="/brand" element={<DashboardLayout userType="brand" />}>
            <Route index element={<BrandDashboard />} />
            <Route path="profile" element={<BrandProfile />} />
            <Route path="jobs" element={<MyJobs />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="jobs/:jobId/proposals" element={<JobProposals />} />
            <Route path="send-offer" element={<SendOffer />} />
            <Route path="jobs/:jobId/edit" element={<EditJob />} />
            <Route path="in-progress-jobs" element={<InProgressJobs />} />
            <Route path="/brand/offers" element={<OffersManagement />} />
            <Route path="/brand/submissions" element={<JobSubmissions />} />
          </Route>
        </Route>

        {/* Creator routes */}
        <Route element={<PrivateRoute type="creator" />}>
          <Route
            path="/creator"
            element={<CreatorDashboardLayout userType="creator" />}
          >
            <Route index element={<CreatorDashboard />} />
            <Route path="profile" element={<CreatorProfile />} />
            <Route path="available-jobs" element={<AvailableJobs />} />
            <Route path="available-jobs/:id" element={<JobDetails />} />
            <Route path="in-progress-jobs" element={<InProgressJobs />} />
            <Route path="my-applications" element={<MyApplications />} />
            <Route path="received-offers" element={<ReceivedOffers />} />
            <Route path="available-search-jobs" element={<SearchResults />} />
            <Route
              path="/creator/job-submissions"
              element={<CreatorJobSubmissions />}
            />
          </Route>
        </Route>

        {/* Protected shared routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/chat" element={<MyChat />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <InstagramTestComponent />
        {/* <AppContent /> */}
      </BrowserRouter>
    </Provider>
  );
}

export default App;
