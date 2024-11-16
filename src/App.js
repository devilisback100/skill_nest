import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Components/Login_Page/Login';
import ProfilePage from './Components/Profile Page/Profile_Page';
import Leaderboard from './Components/Leaderboard/Leaderboard';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);

  // Handle sign out
  const handleSignOut = () => {
    setUserData(null);
  };

  return (
    <Router>
      <nav>
        {/* Only show Profile and Leaderboard buttons if the user is logged in */}
        {userData && (
          <>
            <Link to="/profile"><button>Profile</button></Link>
            <Link to="/leaderboard"><button>Leaderboard</button></Link>
          </>
        )}
        <button onClick={handleSignOut}>Sign Out</button>
      </nav>

      <Routes>
        {/* Redirect to profile if the user is already logged in */}
        <Route
          path="/"
          element={userData ? <Navigate to="/profile" /> : <Login setUserData={setUserData} />}
        />
        {/* Only allow access to ProfilePage if user is logged in */}
        <Route
          path="/profile"
          element={userData ? <ProfilePage userData={userData} /> : <Navigate to="/" />}
        />
        {/* Only allow access to Leaderboard if user is logged in */}
        <Route
          path="/leaderboard"
          element={userData ? <Leaderboard userData={userData} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
