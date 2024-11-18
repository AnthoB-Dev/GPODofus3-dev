const launchFunctions = () => {
  listenToOpenAllBtn();
  toggleBtnBackgroundStyle();
  listenToValidateAllBtn();
  validateAllBtnStyle();
  toggleActiveStateOnAchievements();
};

document.addEventListener("DOMContentLoaded", launchFunctions);
document.addEventListener("turbo:frame-render", launchFunctions);
/**
 * - Ouvre tous les liens des .js-quest dans un nouvel onglet avec un délais de 300ms.
 */
const openLinksOfQuests = () => {
  const links = getLinksOfQuests();
  let delay = 0;

  links.forEach((link) => {
    setTimeout(() => {
      window.open(link, "_blank");
    }, delay);
    delay += 300;
  });
};

/**
 * - Récupère les liens de tous les .js-quest.
 * @returns {Array}
 */
const getLinksOfQuests = () => {
  const jsQuest = document.querySelectorAll(".js-quest");
  const links = [];

  jsQuest.forEach((quest) => {
    const anchor = quest.querySelector("a");
    const link = anchor.href;
    links.push(link);
  });
  return links;
};

/**
 * - Ajoute un listener "click" sur le bouton #openAll.
 */
const listenToOpenAllBtn = () => {
  const openAll = document.querySelector("#openAll");
  openAll.addEventListener("click", () => {
    openLinksOfQuests();
  });
};

/**
 * - Change le texte et l'icône du bouton #validateAll selon getButtons().
 */
const validateAllBtnStyle = () => {
  const validateAll = document.querySelector("#validateAll");
  const icon = validateAll.querySelector("i");
  let buttons = getButtons();
  const newIcon = document.createElement("i");

  // Si des boutons sont check (et donc validés)
  if (buttons.length > 0 && buttons[0].classList.contains("uncheck")) {
    newIcon.classList.add("fa-solid", "fa-xmark");
    validateAll.removeChild(icon);
    validateAll.textContent = "Dévalider tout";
    validateAll.appendChild(newIcon);
  } else { // Si des boutons sont uncheck (et donc non validés)
    newIcon.classList.add("fa-solid", "fa-check-double");
    validateAll.removeChild(icon);
    validateAll.textContent = "Valider tout";
    validateAll.appendChild(newIcon);
  }
};

/**
 * - Ajoute un listener "mouseover" et "mouseout" sur le bouton #validateAll.
 * - Change le background des boutons de validation lors du survol du bouton #validateAll.
 */
const toggleBtnBackgroundStyle = () => {
  const validateAll = document.querySelector("#validateAll");
  let buttons = getButtons();
  
  if (buttons.length === 0) return;

  const color = buttons[0].classList.contains("check") ? "#23dc3c91" : "#f37f81";

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
};


/**
 * - Ajoute un listener "click" sur le bouton #validateAll.
 */
const listenToValidateAllBtn = () => {
  const validateAll = document.querySelector("#validateAll");
  let buttonsType = getButtons();
  validateAll.addEventListener("click", () => {
    clickValidateAll(buttonsType);
  });
};

/**
 * - Récupère les boutons de validation selon leur class "check" ou "uncheck".
 * @returns {Array}
 */
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
};

/**
 * - Clique sur chacun des boutons de validation des quêtes.
 * - Une fois tous les boutons cliqués, appelle clickNextAchievementBtn() ou clickCurrentAchievementBtn() selon le type de boutons.
 * @param buttonsType 
 */
const clickValidateAll = (buttonsType) => {
  
  if (!Array.isArray(buttonsType)) {
    buttonsType = Array.from(buttonsType);
  }
  let delay = 0;
  const promises = buttonsType.map((button) => {
    return new Promise((resolve) => {
      button.click();
      resolve();
    }, delay += 100);
  });

  Promise.all(promises).then(() => {
    clickNextAchievementBtn();
  });
};

/**
 * - Clique sur le succès suivant du guide s'il existe.
 */
const clickNextAchievementBtn = () => {
  const questsAchievementId = document.querySelector(".js-quest").dataset.achievementId;
  const achievements = getAchievements();
  let nextAchievement;

  achievements.forEach((achievement) => {
    const currentAchievementId = achievement.dataset.achievementId;
    if (currentAchievementId === questsAchievementId) {
      nextAchievement = achievement.parentElement.nextElementSibling?.querySelector("button");
    }
    return; 
  })

  setTimeout(() => {
    if (!nextAchievement) {
      clickCurrentAchievementBtn();
      toggleActiveStateOnAchievements();
    } else {
      nextAchievement.click();
    }
  }, 100);
}

const getAchievements = () => {
  return document.querySelectorAll(".js-achievement");
}

/**
 * - Clique sur le succès actuel du guide.
 */
const clickCurrentAchievementBtn = () => {
  const questsAchievementId = document.querySelector(".js-quest").dataset.achievementId;
  const achievements = getAchievements();
  let currentAchievement;
  
  achievements.forEach((achievement) => {
    const currentAchievementId = achievement.dataset.achievementId;
    if (currentAchievementId === questsAchievementId) {
      currentAchievement = achievement.parentElement.querySelector("button");
    }
    return; 
  })
  
  setTimeout(() => {
    currentAchievement.click();
  }, 100);
}

/**
 * - Ajoute un listener "click" sur les succès.
 * - Ajoute la classe "active" sur le succès cliqué.
 */
const toggleActiveStateOnAchievements = () => {
  const buttons = document.querySelectorAll(".achievement-button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => {
        btn.parentElement.parentElement.classList.remove("active");
      });
      button.parentElement.parentElement.classList.add("active");
    });
  });
};