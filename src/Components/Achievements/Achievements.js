import React from 'react';
import './Achievements.css';

const Achievements = ({ userData }) => {
    if (!userData) {
        return <div>No achievement data available</div>;
    }

    const calculateAchievements = () => {
        const achievements = [];

        // Calculate achievements based on the passed userData
        const techSkillsCount = Object.keys(userData['Tech-skills'] || {}).length;
        const softSkillsCount = (userData['Soft-skills'] || []).length;
        const projectsCount = (userData.projects || []).length;
        const totalPoints = userData.points || 0;
        const totalSkills = techSkillsCount + softSkillsCount;

        // Add achievements based on counts
        if (techSkillsCount >= 5) {
            achievements.push({ title: "Tech Explorer", description: "Mastered 5+ technical skills", icon: "🔧" });
        }
        if (techSkillsCount >= 10) {
            achievements.push({ title: "Tech Enthusiast", description: "Mastered 10+ technical skills", icon: "🔧" });
        }
        if (techSkillsCount >= 20) {
            achievements.push({ title: "Tech Specialist", description: "Mastered 20+ technical skills", icon: "🔧" });
        }
        if (techSkillsCount >= 35) {
            achievements.push({ title: "Tech Expert", description: "Mastered 35+ technical skills", icon: "🔧" });
        }
        if (techSkillsCount >= 50) {
            achievements.push({ title: "Tech Master", description: "Mastered 50+ technical skills", icon: "🔧" });
        }

        if (softSkillsCount >= 3) {
            achievements.push({ title: "Soft Skills Champion", description: "Developed 3+ soft skills", icon: "💬" });
        }
        if (softSkillsCount >= 5) {
            achievements.push({ title: "Soft Skills Expert", description: "Developed 5+ soft skills", icon: "💬" });
        }
        if (softSkillsCount >= 10) {
            achievements.push({ title: "Soft Skills Master", description: "Developed 10+ soft skills", icon: "💬" });
        }

        if (projectsCount >= 2) {
            achievements.push({ title: "Project Maven", description: "Completed 2+ projects", icon: "📁" });
        }
        if (projectsCount >= 5) {
            achievements.push({ title: "Project Pro", description: "Completed 5+ projects", icon: "📁" });
        }
        if (projectsCount >= 10) {
            achievements.push({ title: "Project Master", description: "Completed 10+ projects", icon: "📁" });
        }

        if (totalPoints >= 1000) {
            achievements.push({ title: "Point Master", description: "Earned 1000+ points", icon: "🏆" });
        }
        if (totalPoints >= 2000) {
            achievements.push({ title: "Point Legend", description: "Earned 2000+ points", icon: "🏆" });
        }
        if (totalPoints >= 3500) {
            achievements.push({ title: "Point Grandmaster", description: "Earned 3500+ points", icon: "🏆" });
        }

        // Combination achievements
        if (totalSkills >= 15 && projectsCount >= 3) {
            achievements.push({ title: "Rising Star", description: "Acquired 15+ skills and completed 3+ projects", icon: "🌟" });
        }
        if (totalSkills >= 25 && projectsCount >= 5) {
            achievements.push({ title: "Skillful Project Manager", description: "Mastered 25+ skills and completed 5+ projects", icon: "🎯" });
        }
        if (totalSkills >= 35 && projectsCount >= 7) {
            achievements.push({ title: "Tech Virtuoso", description: "Achieved 35+ skills and completed 7+ projects", icon: "🏅" });
        }
        if (totalPoints >= 1000 && projectsCount >= 5) {
            achievements.push({ title: "Project Champion", description: "Earned 1000+ points and completed 5+ projects", icon: "🏆" });
        }
        if (softSkillsCount >= 5 && techSkillsCount >= 20) {
            achievements.push({ title: "Balanced Professional", description: "Mastered 20+ technical skills and 5+ soft skills", icon: "⚖️" });
        }
        if (totalSkills >= 30 && totalPoints >= 1500) {
            achievements.push({ title: "Skill Grandmaster", description: "Acquired 30+ skills and earned 1500+ points", icon: "👑" });
        }
        if (projectsCount >= 8 && softSkillsCount >= 8) {
            achievements.push({ title: "Team Leader", description: "Completed 8+ projects with strong soft skills", icon: "🎓" });
        }
        if (totalPoints >= 2000 && techSkillsCount >= 25) {
            achievements.push({ title: "Technical Expert", description: "Earned 2000+ points with 25+ technical skills", icon: "💫" });
        }
        if (totalSkills >= 40 && projectsCount >= 10 && totalPoints >= 2500) {
            achievements.push({ title: "Ultimate Achiever", description: "40+ skills, 10+ projects, and 2500+ points", icon: "🌠" });
        }
        if (softSkillsCount >= 10 && projectsCount >= 5 && totalPoints >= 1500) {
            achievements.push({ title: "Complete Professional", description: "Mastered soft skills, projects, and earned high points", icon: "🎭" });
        }

        return achievements;
    };

    const achievements = calculateAchievements();

    return (
        <div className="achievements-container">
            <h2>Achievements ({achievements.length})</h2>
            <div className="achievements-grid">
                {achievements.length > 0 ? (
                    achievements.map((achievement, index) => (
                        <div key={index} className="achievement-card">
                            <div className="achievement-icon">{achievement.icon}</div>
                            <h3>{achievement.title}</h3>
                            <p>{achievement.description}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-achievements">No achievements yet</div>
                )}
            </div>
        </div>
    );
};

export default Achievements;
