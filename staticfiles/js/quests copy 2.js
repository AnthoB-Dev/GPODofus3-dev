import { clickNextAchievementBtn, getAchievements } from "./achievements.js";

const openLinksOfQuests = () => {
    console.log("openLinks0: Entrée dans la fonction openLinksOfQuests");
    const links = getLinksOfQuests();
    if (!links) return;
    console.log("openLinks1: Liens récupérés");
    let delay = 0;

    links.forEach((link) => {
        
        setTimeout(() => {
            // window.open(link, "_blank");
            console.log("openLinks2: Ouverture de la quête");
        }, delay);
        delay += 300;
    });
}

const getLinksOfQuests = () => {
    const jsQuest = document.querySelectorAll(".js-quest");
    if (jsQuest.length === 0) return;
    console.log("getLinks1: Entrée dans la fonction getLinksOfQuests");
    const links = [];

    jsQuest.forEach((quest) => {
        console.log("getLinks2: Récupération du lien de la quête");
        const anchor = quest.querySelector("a");
        const link = anchor.href;
        links.push(link);
    });
    return links;
}

export const listenToOpenAllBtn = () => {
    console.log("listenToOpenAllBtn1: Entrée");
    
    const openAll = document.querySelector("#openAll");
    openAll.addEventListener("click", () => {
        console.log("listenToOpenAllBtn2: Clic sur le bouton openAll");
        
        openLinksOfQuests();
    });
}

export const validateAllBtnStyle = () => {
    const validateAll = document.querySelector("#validateAll");
    const icon = validateAll.querySelector("i");
    let buttons = getButtons();
    const newIcon = document.createElement("i");

    if (buttons.length > 0 && buttons[0].classList.contains("uncheck")) {
        newIcon.classList.add("fa-solid", "fa-xmark");
        validateAll.removeChild(icon);
        validateAll.textContent = "Dévalider tout";
        validateAll.appendChild(newIcon);
    } else {
        newIcon.classList.add("fa-solid", "fa-check-double");
        validateAll.removeChild(icon);
        validateAll.textContent = "Valider tout";
        validateAll.appendChild(newIcon);
    }
}

export const toggleBtnBackgroundStyle = () => {
    const validateAll = document.querySelector("#validateAll");
    let buttons = getButtons();

    if (buttons.length === 0) return;

    const color = buttons[0].classList.contains("check")
    ? "#23dc3c91"
    : "#f37f81";

    validateAll.addEventListener("mouseover", () => {
        buttons.forEach((button) => {
            button.style.backgroundColor = color;
        });
    });
    validateAll.addEventListener("mouseout", () => {
        buttons.forEach((button) => {
            button.style.backgroundColor = "";
        });
    });
}

export const listenToValidateAllBtn = () => {
    const validateAll = document.querySelector("#validateAll");
    validateAll.addEventListener("click", () => {
        clickValidateAll();
    });
}

const getButtons = () => {
    const cButtons = document.querySelectorAll(".js-quest .check");
    const uButtons = document.querySelectorAll(".js-quest .uncheck");
    let buttonsType = [];

    if (cButtons.length === 0) {
        buttonsType = uButtons;
    } else if (cButtons.length > 0) {
        buttonsType = cButtons;
    }
    return buttonsType;
}

const clickValidateAll =  async() => {
    let buttonsType = getButtons();

    if (!Array.isArray(buttonsType)) {
        buttonsType = Array.from(buttonsType);
    }

    for (const button of buttonsType) {
        if (document.body.contains(button)) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    button.click();
                    resolve();
                }, 50);
            });
        }
    }

    await clickNextAchievementBtn();
}

export const updateQuestsAchievementTitle = () => {
    const questsAchievementId = document.querySelector(".js-quest")?.dataset.achievementId;
    if (questsAchievementId === undefined) return;
    const questsAchievementTitle = document.querySelector(
        "#quest_frame_achievement_title h4"
    );

    const achievements = getAchievements();
    let currentAchievement;

    achievements.forEach((achievement) => {
        const currentAchievementId = achievement.dataset.achievementId;
        if (currentAchievementId === questsAchievementId) {
            currentAchievement = achievement.parentElement.querySelector("p");
        }
        return;
    });
    questsAchievementTitle.textContent = currentAchievement.textContent;
}
