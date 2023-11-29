import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from './utils/PrivateRoute'
import Register from "./pages/Register/Register"
import Home from "./pages/Home/Home"
import Login from './pages/Login/Login'
import Profile from './pages/Profile/Profile'
import { AuthProvider } from './context/AuthContex';
import Layout from './pages/Layout';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
