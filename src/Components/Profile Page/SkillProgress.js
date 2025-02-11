import React from 'react';
import './SkillProgress.css';

const SkillProgress = ({ skillsData, type, usedSkills }) => {
    const skills = type === 'tech' ? Object.keys(skillsData) : skillsData;

    // Sort skills: verified first, then alphabetically
    const sortedSkills = skills.sort((a, b) => {
        const aVerified = usedSkills.has(a);
        const bVerified = usedSkills.has(b);
        if (aVerified && !bVerified) return -1;
        if (!aVerified && bVerified) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="skills-container">
            <h3 className="skills-title">
                {type === 'tech' ? 'Technical Skills' : 'Soft Skills'}
            </h3>
            <div className="skills-row">
                {sortedSkills.map((skill) => (
                    <div
                        key={skill}
                        className={`skill-chip ${usedSkills.has(skill) ? 'verified' : ''}`}
                        title={usedSkills.has(skill) ? 'Verified in Projects' : 'Not Yet Used in Projects'}
                    >
                        <span>{skill}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillProgress;
