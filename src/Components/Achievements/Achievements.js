import React from 'react';
import './Achievements.css';

const Achievements = ({ userData }) => {
    const calculateAchievements = () => {
        const achievements = [];
        const totalPoints = userData.points;
        const totalSkills = userData['Soft-skills'].length + Object.keys(userData['Tech-skills']).length;
        const projectCount = userData.projects ? userData.projects.length : 0;

        const skillBadges = [
            { threshold: 5, title: 'Skill Initiate', description: 'Beginning your skill journey with 5+ skills', icon: '🌱' },
            { threshold: 15, title: 'Skill Explorer', description: 'Expanding horizons with 15+ skills', icon: '⭐' },
            { threshold: 25, title: 'Skill Enthusiast', description: 'Growing strong with 25+ skills', icon: '🌟' },
            { threshold: 30, title: 'Skill Professional', description: 'Mastering 30+ diverse skills', icon: '💫' },
            { threshold: 35, title: 'Skill Expert', description: 'Achieving expertise with 35+ skills', icon: '🌠' },
            { threshold: 45, title: 'Skill Master', description: 'Reaching mastery with 45+ skills', icon: '👑' },
            { threshold: 50, title: 'Ultimate Virtuoso', description: 'Legendary status with 50+ skills', icon: '🏆' }
        ];

        skillBadges.forEach(badge => {
            if (totalSkills >= badge.threshold) {
                achievements.push(badge);
            }
        });

        if (projectCount >= 3) achievements.push({
            title: 'Project Starter',
            description: 'Completed 3+ projects',
            icon: '📝'
        });

        if (projectCount >= 5) achievements.push({
            title: 'Project Pro',
            description: 'Completed 5+ projects',
            icon: '💼'
        });

        if (projectCount >= 10) achievements.push({
            title: 'Project Master',
            description: 'Completed 10+ projects',
            icon: '🏆'
        });

        const combinationBadges = [
            {
                condition: totalSkills >= 15 && projectCount >= 3,
                title: 'Rising Star',
                description: 'Acquired 15+ skills and completed 3+ projects',
                icon: '🌟'
            },
            {
                condition: totalSkills >= 25 && projectCount >= 5,
                title: 'Skillful Project Manager',
                description: 'Mastered 25+ skills and completed 5+ projects',
                icon: '🎯'
            },
            {
                condition: totalSkills >= 35 && projectCount >= 7,
                title: 'Tech Virtuoso',
                description: 'Achieved 35+ skills and completed 7+ projects',
                icon: '🏅'
            },
            {
                condition: totalPoints >= 1000 && projectCount >= 5,
                title: 'Project Champion',
                description: 'Earned 1000+ points and completed 5+ projects',
                icon: '🏆'
            },
            {
                condition: userData['Soft-skills'].length >= 5 && Object.keys(userData['Tech-skills']).length >= 20,
                title: 'Balanced Professional',
                description: 'Mastered 20+ technical skills and 5+ soft skills',
                icon: '⚖️'
            },
            {
                condition: totalSkills >= 30 && totalPoints >= 1500,
                title: 'Skill Grandmaster',
                description: 'Acquired 30+ skills and earned 1500+ points',
                icon: '👑'
            },
            {
                condition: projectCount >= 8 && userData['Soft-skills'].length >= 8,
                title: 'Team Leader',
                description: 'Completed 8+ projects with strong soft skills',
                icon: '🎓'
            },
            {
                condition: totalPoints >= 2000 && Object.keys(userData['Tech-skills']).length >= 25,
                title: 'Technical Expert',
                description: 'Earned 2000+ points with 25+ technical skills',
                icon: '💫'
            },
            {
                condition: totalSkills >= 40 && projectCount >= 10 && totalPoints >= 2500,
                title: 'Ultimate Achiever',
                description: '40+ skills, 10+ projects, and 2500+ points',
                icon: '🌠'
            },
            {
                condition: userData['Soft-skills'].length >= 10 && projectCount >= 5 && totalPoints >= 1500,
                title: 'Complete Professional',
                description: 'Mastered soft skills, projects, and earned high points',
                icon: '🎭'
            }
        ];

        combinationBadges.forEach(badge => {
            if (badge.condition) {
                achievements.push(badge);
            }
        });

        if (totalPoints >= 500) achievements.push({
            title: 'Point Collector',
            description: 'Earned 500+ points',
            icon: '🎖️'
        });

        if (totalPoints >= 1000) achievements.push({
            title: 'Point Master',
            description: 'Earned 1000+ points',
            icon: '🏆'
        });

        return achievements.sort((a, b) => {
            // Priority order: Combined > Skills > Projects > Points
            const getPriority = (achievement) => {
                const desc = achievement.description.toLowerCase();
                const thresholds = achievement.threshold || 0;

                // Check if it's a combination achievement (contains multiple metrics)
                const metrics = [
                    desc.includes('skills'),
                    desc.includes('projects'),
                    desc.includes('points')
                ].filter(Boolean).length;

                if (metrics > 1) {
                    return 4000 + thresholds; // Combination achievements at top
                }

                if (desc.includes('skills')) {
                    return 3000 + thresholds; // Skill achievements second
                }

                if (desc.includes('projects')) {
                    return 2000 + (parseInt(desc.match(/\d+/)?.[0] || '0')); // Project achievements third
                }

                if (desc.includes('points')) {
                    return 1000 + (parseInt(desc.match(/\d+/)?.[0] || '0')); // Points achievements last
                }

                return 0;
            };

            const priorityA = getPriority(a);
            const priorityB = getPriority(b);

            if (priorityA !== priorityB) {
                return priorityB - priorityA; // Higher priority first
            }

            // If same priority, sort by threshold/level
            const levelA = parseInt(a.description.match(/\d+/)?.[0] || '0');
            const levelB = parseInt(b.description.match(/\d+/)?.[0] || '0');
            return levelB - levelA; // Higher level first
        });
    };

    const achievements = calculateAchievements();

    return (
        <div className="achievements-container">
            <h2>Achievements ({achievements.length})</h2>
            <div className="achievements-grid">
                {achievements.map((achievement, index) => (
                    <div key={index} className="achievement-card">
                        <div className="achievement-icon">{achievement.icon}</div>
                        <h3>{achievement.title}</h3>
                        <p>{achievement.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Achievements;
