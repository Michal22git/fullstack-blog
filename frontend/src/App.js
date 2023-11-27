import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register/Register"
import Home from "./pages/Home/Home"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
