import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from '../src/Components/Login_Page/Login';
import ProfilePage from '../src/Components/Profile Page/Profile_Page';
import Leaderboard from '../src/Components/Leaderboard/Leaderboard';
import Projects from '../src/Components/Profile Page/Projects';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);

  const techSkillPoints = {
    // AI/ML Skills
    "Machine Learning": 85,
    "Deep Learning": 90,
    "Artificial Intelligence": 90,
    "Neural Networks": 85,
    "Artificial Neural Networks (ANN)": 85,
    "Convolutional Neural Networks (CNN)": 88,
    "Recurrent Neural Networks (RNN)": 88,
    "Long Short-Term Memory (LSTM)": 88,
    "Transformers": 92,
    "Transfer Learning": 85,
    "Reinforcement Learning": 88,
    "Natural Language Processing": 87,
    "Computer Vision": 87,
    "GANs": 90,
    "AutoML": 82,
    "Data Mining": 80,
    "Feature Engineering": 75,
    "Model Deployment": 78,
    "MLOps": 85,
    "BERT": 88,
    "GPT": 90,
    "Time Series Analysis": 82,
    "Recommendation Systems": 83,
    "Sentiment Analysis": 80,
    "Object Detection": 85,
    "Image Segmentation": 85,
    "TensorFlow": 80,
    "PyTorch": 85,
    "Scikit-learn": 75,
    "Keras": 78,
    "FastAI": 80,
    "Pandas": 65,
    "NumPy": 65,
    "OpenCV": 75,
    "Hugging Face": 85,
    "XGBoost": 78,
    "LightGBM": 78,

    // Existing Skills
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
    "Tailwind CSS": 50,
    "Bootstrap": 35,
    "Emotional Intelligence": 20,
    "GraphQL": 75,
    "TypeScript": 70,
    "Organization": 15,
    "Dart": 65,
    "GameMaker Studio": 55,
    "Jenkins": 70,
    "Blender": 60,
    "SASS": 45,
    "Three.js": 85,
    "Gatsby.js": 70,
    "Phaser": 65,
    "HTML": 50,
    "CSS": 50,
    "VS Code": 40,
    "Vercel": 45,
    "Render": 45,
    "Netlify": 45,
    "Heroku": 50,
    "Postman": 40,
    "Figma": 50,
    "JIRA": 40
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
            <Link to="/projects"><button>Projects</button></Link>
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
          }        />        <Route
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
        <Route
          path="/projects"
          element={
            userData ? (
              <Projects
                techSkillPoints={techSkillPoints}
                userData={userData}
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
