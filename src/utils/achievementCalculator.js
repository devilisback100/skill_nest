export const calculateAchievements = (totalPoints, totalSkills, projectCount) => {
    const achievements = [];
    if (totalPoints >= 1000) achievements.push('Skills Master');
    if (totalSkills >= 10) achievements.push('Jack of All Trades');
    if (projectCount >= 5) achievements.push('Project Guru');
    if (totalSkills >= 20 && projectCount >= 5) achievements.push('Skillful Project Manager');
    if (totalSkills >= 45) achievements.push('Skill Legend');
    return achievements;
};
