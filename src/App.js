import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from '../src/Components/Login_Page/Login';
import ProfilePage from '../src/Components/Profile Page/Profile_Page';
import Leaderboard from '../src/Components/Leaderboard/Leaderboard';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);

  // Centralized Tech Skills and Soft Skills
  const techSkillPoints = {
    "JavaScript": 60,
    "React.js": 70,
    "Python": 70,
    "Node.js": 75,
    "Java (Android)": 60,
    "Kotlin": 70,
    "Swift (iOS)": 65,
    "Flutter": 80,
    "C#": 65,
    "C++": 75,
    "Unity": 80,
    "Unreal Engine": 85,
    "MongoDB": 70,
    "SQL": 60,
    "Docker": 75,
    "Kubernetes": 80,
    "AWS": 85,
    "Azure": 80,
    "GitHub": 40,
    "Git": 45,
    "Firebase": 70,
    "TensorFlow": 80,
    "PyTorch": 85,
    "Scikit-learn": 65,
    "Pandas": 50,
    "NumPy": 45,
    "React Native": 75,
    "Next.js": 80,
    "Tailwind CSS": 50,
    "Bootstrap": 35,
    "GraphQL": 75,
    "TypeScript": 70,
    "Dart": 65,
    "XGBoost": 70,
    "LightGBM": 75,
    "GameMaker Studio": 55,
    "Jenkins": 70,
    "Blender": 60,
    "SASS": 45,
    "Three.js": 85,
    "Gatsby.js": 70,
    "Phaser": 65,
  };

  const softSkillsPoints = {
    "Communication": 20,
    "Teamwork": 15,
    "Leadership": 25,
    "Problem-solving": 30,
    "Adaptability": 20,
    "Creativity": 25,
    "Time management": 15,
    "Critical thinking": 20,
    "Conflict resolution": 15,
    "Collaboration": 20,
    "Emotional Intelligence": 20,
    "Work ethic": 25,
    "Decision making": 20,
    "Organization": 15,
  };

  const handleSignOut = () => {
    setUserData(null);
  };

  return (
    <Router>
      <nav>
        {userData ? (
          <>
            <Link to="/profile"><button>Profile</button></Link>
            <Link to="/leaderboard"><button>Leaderboard</button></Link>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : null}
      </nav>

      <Routes>
        <Route
          path="/"
          element={userData ? <Navigate to="/profile" /> : <Login setUserData={setUserData} />}
        />
        <Route
          path="/profile"
          element={
            userData ? (
              <ProfilePage
                userData={userData}
                setUserData={setUserData}
                techSkillPoints={techSkillPoints}
                softSkillsPoints={softSkillsPoints}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/leaderboard"
          element={
            userData ? (
              <Leaderboard
                userData={userData}
                techSkillPoints={techSkillPoints}
                softSkillsPoints={softSkillsPoints}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
