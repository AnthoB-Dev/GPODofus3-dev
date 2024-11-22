export const Achievements = {
    /**
     * Clique sur le succès suivant de la liste des succès du guide.
     */
    clickNextAchievementBtn: function() {
        const questsAchievementId = document.querySelector(".js-quest").dataset.achievementId;
        const achievements = this.getAchievements();
        let nextAchievement;
    
        achievements.forEach((achievement) => {
            const currentAchievementId = achievement.dataset.achievementId;
            if (currentAchievementId === questsAchievementId) {
                nextAchievement = achievement.parentElement.nextElementSibling?.querySelector(".achievementName a");
            }
            return; 
        });
    
        setTimeout(() => {
            if (!nextAchievement) {
                this.clickCurrentAchievementBtn();
                this.toggleActiveStateOnAchievements();
            } else {
                nextAchievement.click();
            }
        }, 100);
    },

    /**
     * Met en surbrillance le succès cliqué.
     */
    toggleActiveStateOnAchievements: function() {
        const buttons = document.querySelectorAll(".achievement-button");
        const jsAchievements = this.getAchievements();
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                jsAchievements.forEach((e) => {
                    e.classList.remove("active");
                })
                button.parentElement.parentElement.classList.add("active");
            });
        });
    },

    /**
     * Clique sur le succès actuel (sert surtout lors du validateAll pour refocus le dernier succès de la liste)
     */
    clickCurrentAchievementBtn: function() {
        const questsAchievementId = document.querySelector(".js-quest").dataset.achievementId;
        const achievements = this.getAchievements();
        let currentAchievement;
        
        achievements.forEach((achievement) => {
            const currentAchievementId = achievement.dataset.achievementId;
            if (currentAchievementId === questsAchievementId) {
                currentAchievement = achievement.parentElement.querySelector(".achievementName a");
            }
            return; 
        });
        
        setTimeout(() => {
            currentAchievement.click();
        }, 100);
    },

    /**
     * @returns {NodeListOf<Element>} Liste des succès du guide.
     */
    getAchievements: function() {
        return document.querySelectorAll(".js-achievement");
    }
};
