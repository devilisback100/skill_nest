import React, { useState, useEffect } from "react";
import "./Leaderboard.css";

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [view, setView] = useState("overall"); // "overall" or "monthly"

    useEffect(() => {
        // Fetch data from the `get_all_user_data` endpoint
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

    const calculateGrowth = (points, prevMonthPoints) => points - prevMonthPoints;

    // Sort the data based on the current view
    const sortedUsers =
        view === "overall"
            ? [...users].sort((a, b) => b.points - a.points)
            : [...users].sort(
                (a, b) =>
                    calculateGrowth(b.points, b.prev_month_points) -
                    calculateGrowth(a.points, a.prev_month_points)
            );

    return (
        <div className="leaderboard-container">
            <h1 className="title">Leaderboard</h1>
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
            </div>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Place</th>
                        <th>Name</th>
                        <th>Points</th>
                        {view === "monthly" && <th>Growth</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.map((user, index) => (
                        <tr key={user.USN}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.points}</td>
                            {view === "monthly" && (
                                <td>
                                    {calculateGrowth(
                                        user.points,
                                        user.prev_month_points
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
