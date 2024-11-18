import React, { useState, useEffect } from "react";
import "./Leaderboard.css";

const Leaderboard = ({ userData, techSkillPoints, softSkillsPoints }) => {
    const [users, setUsers] = useState([]);
    const [view, setView] = useState("overall"); // "overall", "monthly", or "filtered"
    const [selectedTechSkills, setSelectedTechSkills] = useState([]);
    const [selectedSoftSkills, setSelectedSoftSkills] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        fetch("https://skill-nest-backend.onrender.com/get_all_users_data")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setUsers(data.data);
                } else {
                    console.error("Failed to fetch user data.");
                }
            });
    }, []);

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

    return (
        <div className="leaderboard-container">
            <h1 className="title">Leaderboard</h1>

            {view === "filtered" && (
                <div className="skill-filters">
                    <div className="dropdown">
                        <h3>Select Tech Skills:</h3>
                        <div className="skill-options">
                            {Object.keys(techSkillPoints).map((skill, index) => (
                                <button
                                    key={index}
                                    className={`skill-btn ${selectedTechSkills.includes(skill) ? "selected" : ""}`}
                                    onClick={() => handleSkillSelection(skill, "tech")}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="dropdown">
                        <h3>Select Soft Skills:</h3>
                        <div className="skill-options">
                            {Object.keys(softSkillsPoints).map((skill, index) => (
                                <button
                                    key={index}
                                    className={`skill-btn ${selectedSoftSkills.includes(skill) ? "selected" : ""}`}
                                    onClick={() => handleSkillSelection(skill, "soft")}
                                >
                                    {skill}
                                </button>
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
                                <td>{user.name}</td>
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
