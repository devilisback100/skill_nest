import React, { useMemo } from 'react';
import './SkillRecommendations.css';

const SkillRecommendations = ({ userSkills, techSkillPoints, projectSkills }) => {
    const getRecommendations = useMemo(() => {
        // Get skills user doesn't have
        const unusedSkills = Object.keys(techSkillPoints).filter(
            skill => !Object.keys(userSkills).includes(skill)
        );

        // Create scoring system for skills
        const scoredSkills = unusedSkills.map(skill => {
            let score = 0;

            // Higher score for skills used in projects
            if (projectSkills.includes(skill)) {
                score += 5;
            }

            // Higher score for skills with higher points
            score += techSkillPoints[skill] / 20;

            // Add some randomization to avoid same recommendations
            score += Math.random() * 2;

            return { skill, score };
        });

        // Sort by score and get top 3 unique recommendations
        const uniqueRecommendations = [...new Set(
            scoredSkills
                .sort((a, b) => b.score - a.score)
                .map(item => item.skill)
        )].slice(0, 3);

        return uniqueRecommendations.map(skill => ({
            name: skill,
            points: techSkillPoints[skill],
            isProjectSkill: projectSkills.includes(skill)
        }));
    }, [userSkills, techSkillPoints, projectSkills]);

    return (
        <div className="recommendations-container">
            {getRecommendations.map((skill, index) => (
                <div key={index} className="recommendation-card">
                    <h3>{skill.name}</h3>
                    <p className="skill-points">Skill Points: {skill.points}</p>
                    {skill.isProjectSkill && (
                        <span className="project-skill-badge">
                            Used in Projects
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SkillRecommendations;
