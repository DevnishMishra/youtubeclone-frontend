import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import ChannelPage from "./pages/ChannelPage";
import CreateChannel from "./pages/CreateChannel";
import { AuthProvider } from "../../../output 3/frontend/src/utils/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/channel/:id" element={<ChannelPage />} />
          {/* Create channel only after signed in */}
          <Route path="/my-channel" element={<CreateChannel />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
