import React from 'react';
import './SkillProgress.css';

const SkillProgress = ({ skillsData, type, usedSkills }) => {
    const skills = type === 'tech' ? Object.keys(skillsData) : skillsData;

    const normalizeSkill = (skill) => {
        return skill.trim().toLowerCase().replace(/\s+/g, ' ');
    };

    // Sort skills: verified first, then alphabetically
    const sortedSkills = skills.sort((a, b) => {
        const aVerified = usedSkills.has(normalizeSkill(a));
        const bVerified = usedSkills.has(normalizeSkill(b));
        if (aVerified && !bVerified) return -1;
        if (!aVerified && bVerified) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="skills-container">
            <div className="skills-header">
                <h3 className="skills-title">
                    {type === 'tech' ? 'Technical Skills' : 'Soft Skills'}
                </h3>
                <div className="skills-row">
                    {sortedSkills.map((skill) => (
                        <div
                            key={skill}
                            className={`skill-chip ${usedSkills.has(normalizeSkill(skill)) ? 'verified' : ''}`}
                            title={usedSkills.has(normalizeSkill(skill)) ? 'Verified in Projects' : 'Not Yet Used in Projects'}
                        >
                            <span>{skill}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkillProgress;
