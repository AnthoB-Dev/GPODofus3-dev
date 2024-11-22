import { Nav } from "./nav.js";
import { Quests } from "./quests.js";
import { Achievements } from "./achievements.js";

const launchFunctions = () => {
    Quests.listenToOpenAllBtn();
    Quests.toggleBtnBackgroundStyle();
    Quests.listenToValidateAllBtn();
    Quests.validateAllBtnStyle();
    Quests.updateQuestsAchievementTitle();
    Achievements.toggleActiveStateOnAchievements();
};

let hasLaunchedFunctions = false;

const init = () => {
    Nav.init();
      
    const handleLaunch = () => {
        if (!hasLaunchedFunctions) {
            console.log("First LaunchFuncs");
            launchFunctions();
            hasLaunchedFunctions = true;
        } else {
            console.log("LaunchFuncs");
            launchFunctions();
        }
    }

    document.addEventListener("turbo:load", handleLaunch);
    document.addEventListener("turbo:frame-render", handleLaunch);
}

init();