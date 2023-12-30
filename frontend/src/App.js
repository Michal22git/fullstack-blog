import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from './utils/PrivateRoute';
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import Search from './pages/Search/Search';
import Chat from './pages/chat/Chat';
import { AuthProvider } from './context/AuthContex';
import Layout from './pages/Layout';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/search" element={<Search />} />
            </Route>
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
