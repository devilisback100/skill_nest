import React, { useMemo } from 'react';
import './SkillRecommendations.css';

const SkillRecommendations = ({ userSkills, techSkillPoints, projectSkills }) => {
    // Move these objects outside of the component or make them useMemo dependencies
    const skillPairs = useMemo(() => ({
        "Machine Learning": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "NumPy", "Pandas"],
        "Deep Learning": ["Python", "TensorFlow", "PyTorch", "CUDA", "NumPy"],
        "Web Development": ["JavaScript", "React.js", "HTML", "CSS", "Node.js", "TypeScript"],
        "Mobile Development": ["Flutter", "React Native", "Kotlin", "Swift"],
        "DevOps": ["Docker", "Kubernetes", "Jenkins", "AWS", "Azure"],
        "Data Science": ["Python", "Pandas", "NumPy", "Scikit-learn", "Jupyter"],
        "Game Development": ["Unity", "C#", "Unreal Engine", "C++", "GameMaker Studio"]
    }), []); // Empty dependency array since this object never changes

    const careerPaths = useMemo(() => ({
        "AI Engineer": ["Machine Learning", "Deep Learning", "Python", "TensorFlow"],
        "Full Stack Developer": ["JavaScript", "React.js", "Node.js", "MongoDB"],
        "Mobile Developer": ["Flutter", "React Native", "Firebase"],
        "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "Jenkins"],
        "Data Scientist": ["Python", "Machine Learning", "Pandas", "NumPy"]
    }), []); // Empty dependency array since this object never changes

    const getRecommendations = useMemo(() => {
        const recommendations = new Set();
        const userTechSkills = Object.keys(userSkills);
        const projectSkillSet = new Set(projectSkills);

        // Career path based recommendations
        Object.entries(careerPaths).forEach(([career, requiredSkills]) => {
            const hasPartialSkills = requiredSkills.some(skill => userTechSkills.includes(skill));
            const needsMoreSkills = requiredSkills.some(skill => !userTechSkills.includes(skill));

            if (hasPartialSkills && needsMoreSkills) {
                requiredSkills
                    .filter(skill => !userTechSkills.includes(skill))
                    .forEach(skill => {
                        if (techSkillPoints[skill]) {
                            recommendations.add({
                                skill,
                                points: techSkillPoints[skill],
                                reason: `Recommended for ${career} career path`
                            });
                        }
                    });
            }
        });

        // Project skills based recommendations
        projectSkillSet.forEach(skill => {
            if (!userTechSkills.includes(skill) && techSkillPoints[skill]) {
                recommendations.add({
                    skill,
                    points: techSkillPoints[skill],
                    reason: "Used in your project stack"
                });
            }
        });

        // Complementary skills recommendations
        Object.entries(skillPairs).forEach(([mainSkill, relatedSkills]) => {
            if (userTechSkills.includes(mainSkill)) {
                relatedSkills.forEach(skill => {
                    if (!userTechSkills.includes(skill) && techSkillPoints[skill]) {
                        recommendations.add({
                            skill,
                            points: techSkillPoints[skill],
                            reason: `Complements your ${mainSkill} skills`
                        });
                    }
                });
            }
        });

        return Array.from(recommendations).sort((a, b) => b.points - a.points).slice(0, 3);
    }, [userSkills, techSkillPoints, projectSkills, skillPairs, careerPaths]);

    return (
        <div className="recommendations-container">
            <h3>Recommended Skills</h3>
            <div className="recommendations-grid">
                {getRecommendations.map((rec, index) => (
                    <div key={index} className="recommendation-card">
                        <div className="skill-name">{rec.skill}</div>
                        <div className="skill-reason">{rec.reason}</div>
                        <div className="skill-points">+{rec.points} points</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillRecommendations;
