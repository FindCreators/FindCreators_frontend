
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home/Home";
import Login from "./pages/LoginSignup/Login.js";
import Signup from './pages/LoginSignup/Signup';
import NavBar from "./components/Navbar/Navbar.js";
import Profile from "./pages/Profile/Profile.js";
function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/profile" element={<Profile/>} />


    </Routes>
  </BrowserRouter>
  );
}

export default App;
