const toggleQuest = (questId) => {
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
    const link = quest.querySelector("a").href;
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

  if (buttons.length > 0 && buttons[0].classList.contains("uncheck")) {
    const newIcon = document.createElement("i");
    newIcon.classList.add("fa-solid", "fa-xmark");
    validateAll.removeChild(icon);
    validateAll.textContent = "Dévalider tout";
    validateAll.appendChild(newIcon);
  }
};

const pushValidateAll = (buttonsType) => {
  let delay = 0;
  buttonsType.forEach((button) => {
    setTimeout(() => {
      button.click();
    }, delay);
    delay += 100;
  });
};

const toggleBtnBackgroundStyle = () => {
  const validateAll = document.querySelector("#validateAll");
  let buttons = getButtons();
  const color = buttons[0].classList.contains("check") ? "#23DC3D" : "#f37f81";

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
    pushValidateAll(buttonsType);
  });
};

const launchFunctions = () => {
  listenToOpenAll();
  toggleBtnBackgroundStyle();
  listenToValidateAll();
  validateAllStyle();
};

document.addEventListener("DOMContentLoaded", launchFunctions);
document.addEventListener("turbo:frame-render", launchFunctions);
