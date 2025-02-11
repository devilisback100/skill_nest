import React, { useState, useEffect, useContext } from "react"; // Add useContext
import { useNavigate } from "react-router-dom";
import { ApiContext } from '../../contexts/ApiContext'; // Add this import
import "./Leaderboard.css";

const Leaderboard = ({ userData, techSkillPoints, softSkillsPoints }) => {
    const [users, setUsers] = useState([]);
    const [view, setView] = useState("overall");
    const [selectedTechSkills, setSelectedTechSkills] = useState([]);
    const [selectedSoftSkills, setSelectedSoftSkills] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [techSearchTerm, setTechSearchTerm] = useState("");
    const [softSearchTerm, setSoftSearchTerm] = useState("");
    const navigate = useNavigate();
    const apiConfig = useContext(ApiContext); // Add this line

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const response = await fetch(`${apiConfig.baseUrl}/get_all_users_data`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ batch_id: userData.batch_id })
                });
                const data = await response.json();
                if (data.status === "success") {
                    setUsers(data.data);
                    setFilteredUsers(data.data);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        if (userData?.batch_id) {
            fetchUsersData();
        }
    }, [userData, apiConfig.baseUrl]); // Add apiConfig.baseUrl to dependencies

    const handleSkillSelection = (skill, skillType) => {
        if (skillType === "tech") {
            setSelectedTechSkills((prev) =>
                prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
            );
        } else {
            setSelectedSoftSkills((prev) =>
                prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
            );
        }
    };

    const handleSearch = () => {
        const filtered = users.filter((user) => {
            const hasTechSkills =
                selectedTechSkills.length === 0 ||
                selectedTechSkills.every((skill) =>
                    Object.keys(user["Tech-skills"] || {}).includes(skill)
                );

            const hasSoftSkills =
                selectedSoftSkills.length === 0 ||
                selectedSoftSkills.every((skill) =>
                    (user["Soft-skills"] || []).includes(skill)
                );

            return hasTechSkills && hasSoftSkills;
        });

        setFilteredUsers(filtered);
        setView("filtered");
    };

    const calculateGrowth = (points, prevMonthPoints) => points - prevMonthPoints;

    const getSortedLeaderboard = (usersList) =>
        [...usersList].sort((a, b) => b.points - a.points);

    const assignRanks = (usersList) =>
        getSortedLeaderboard(usersList).map((user, index) => ({
            ...user,
            rank: index + 1,
        }));

    const sortedUsers =
        view === "overall"
            ? assignRanks(users)
            : view === "monthly"
                ? assignRanks(
                    users.map((user) => ({
                        ...user,
                        growth: calculateGrowth(user.points, user.prev_month_points),
                    }))
                )
                : assignRanks(filteredUsers);

    const handleViewProfile = (user) => {
        navigate('/profile', {
            state: {
                user: {
                    ...user,
                    'Tech-skills': user['Tech-skills'] || {},
                    'Soft-skills': user['Soft-skills'] || [],
                    projects: user.Projects || [],
                    'Social_profiles': user['Social_profiles'] || [],
                    batch_id: user.batch_id,
                    batch_name: user.batch_name,
                    points: user.points || 0,
                    prev_month_points: user.prev_month_points || 0
                },
                readOnly: true
            }
        });
    };

    const filterSkills = (skills, searchTerm) => {
        return Object.keys(skills).filter(skill =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <div className="leaderboard-container">
            <h1 className="title">Leaderboard</h1>

            {view === "filtered" && (
                <div className="skill-filters">
                    <div className="dropdown">
                        <h3>Select Tech Skills:</h3>
                        <input
                            type="text"
                            className="skill-search"
                            placeholder="Search tech skills..."
                            value={techSearchTerm}
                            onChange={(e) => setTechSearchTerm(e.target.value)}
                        />
                        <div className="selected-skills">
                            {selectedTechSkills.map((skill, index) => (
                                <span key={index} className="selected-skill-tag">
                                    {skill}
                                    <button onClick={() => handleSkillSelection(skill, "tech")}>×</button>
                                </span>
                            ))}
                        </div>
                        <div className="skill-options scrollable">
                            {filterSkills(techSkillPoints, techSearchTerm).map((skill, index) => (
                                !selectedTechSkills.includes(skill) && (
                                    <button
                                        key={index}
                                        className="skill-btn"
                                        onClick={() => handleSkillSelection(skill, "tech")}
                                    >
                                        {skill}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>

                    <div className="dropdown">
                        <h3>Select Soft Skills:</h3>
                        <input
                            type="text"
                            className="skill-search"
                            placeholder="Search soft skills..."
                            value={softSearchTerm}
                            onChange={(e) => setSoftSearchTerm(e.target.value)}
                        />
                        <div className="selected-skills">
                            {selectedSoftSkills.map((skill, index) => (
                                <span key={index} className="selected-skill-tag">
                                    {skill}
                                    <button onClick={() => handleSkillSelection(skill, "soft")}>×</button>
                                </span>
                            ))}
                        </div>
                        <div className="skill-options scrollable">
                            {filterSkills(softSkillsPoints, softSearchTerm).map((skill, index) => (
                                !selectedSoftSkills.includes(skill) && (
                                    <button
                                        key={index}
                                        className="skill-btn"
                                        onClick={() => handleSkillSelection(skill, "soft")}
                                    >
                                        {skill}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>

                    <button className="search-btn" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            )}

            <div className="toggle-buttons">
                <button
                    className={view === "overall" ? "active" : ""}
                    onClick={() => setView("overall")}
                >
                    Overall Leaderboard
                </button>
                <button
                    className={view === "monthly" ? "active" : ""}
                    onClick={() => setView("monthly")}
                >
                    Monthly Leaderboard
                </button>
                <button
                    className={view === "filtered" ? "active" : ""}
                    onClick={() => setView("filtered")}
                >
                    Filtered Leaderboard
                </button>
            </div>

            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Points</th>
                        {view === "monthly" && <th>Growth</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.length > 0 ? (
                        sortedUsers.map((user) => (
                            <tr key={user.USN}>
                                <td>{user.rank}</td>
                                <td className="name-column">
                                    <button className="view-profile-btn" onClick={() => handleViewProfile(user)}>
                                        {user.name}
                                    </button>
                                </td>
                                <td>{user.points}</td>
                                {view === "monthly" && <td>{user.growth || 0}</td>}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                                No data available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
