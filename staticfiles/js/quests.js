const toggleQuestCompletion = (questId) => {
  fetch(`/app/toggle-quest/${questId}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(`quest_frame_${questId}`).innerHTML = html;
    });
};

const getLinks = () => {
  const jsQuest = document.querySelectorAll(".js-quest");
  const links = [];
  jsQuest.forEach((quest) => {
    const anchor = quest.querySelector("a");
    if (anchor) {
      const link = anchor.href;
      links.push(link);
    }
    links.push(link);
  });
  return links;
};

const openLinks = () => {
  const links = getLinks();
  let delay = 0;

  links.forEach((link) => {
    setTimeout(() => {
      window.open(link, "_blank");
    }, delay);
    delay += 300;
  });
};

const listenToOpenAll = () => {
  const openAll = document.querySelector("#openAll");
  openAll.addEventListener("click", () => {
    openLinks();
  });
};

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

const validateAllStyle = () => {
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
};

const clickCurrentAchievementBtn = (buttonsType) => {
  if (buttonsType.length === 0) return;
  let achievementId = buttonsType[0]?.parentElement.dataset.achievementId; 
  let currentAchievement = document.querySelector("#achievement_" + achievementId);

  setTimeout(() => {
    currentAchievement.classList.add("active")
    currentAchievement.click();
  }, 100);
}

const clickValidateAll = (buttonsType) => {
  if (!Array.isArray(buttonsType)) {
    buttonsType = Array.from(buttonsType);
  }
  let delay = 0;
  const promises = buttonsType.map((button) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        button.click();
        resolve();
      }, delay);
      delay += 100;
    });
  });

  Promise.all(promises).then(() => {
    clickCurrentAchievementBtn(buttonsType);
  });
};

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

const listenToValidateAll = () => {
  const validateAll = document.querySelector("#validateAll");
  let buttonsType = getButtons();
  validateAll.addEventListener("click", () => {
    clickValidateAll(buttonsType);
  });
};

const activeButton = () => {
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

const launchFunctions = () => {
  listenToOpenAll();
  toggleBtnBackgroundStyle();
  listenToValidateAll();
  validateAllStyle();
  activeButton();
};

document.addEventListener("DOMContentLoaded", launchFunctions);
document.addEventListener("turbo:frame-render", launchFunctions);

