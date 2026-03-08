import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import VideoPlayer from "./pages/VideoPlayer";

function App() {
  return (
    <Router>
      <Navbar />

      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 ml-0 md:ml-64 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
