import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from './utils/PrivateRoute'
import Register from "./pages/Register/Register"
import Home from "./pages/Home/Home"
import Login from './pages/Login/Login'
import SideHeader from './components/SideHeader'
import Profile from './pages/Profile/Profile'
import { AuthProvider } from './context/AuthContex';


function App() {
  return (
    <Router>
      <AuthProvider>
        <SideHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route exact path='/' element={<PrivateRoute/>}>
            <Route exact path='/profile' element={<Profile/>}/>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
