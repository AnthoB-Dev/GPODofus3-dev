const toggleQuest = (questId) => {
  fetch(`/app/toggle-quest/${questId}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
      "Content-Type": "text/html",
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

/**
 * Ouvre tous les liens des quêtes d'un succès avec un délais.
 * Délais qui ne permet malheureusement pas de ne pas se faire spot comme popup par le navigateur même avec 5000ms.
 */
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

/**
 * Appuie sur tous les boutons de toggle de completion des quêtes avec du délais pour éviter des problèmes de chargement.
 */
const pushValidateAll = (buttonType) => {
  const cButtons = document.querySelectorAll(".js-quest .check");
  const uButtons = document.querySelectorAll(".js-quest .uncheck");
  let buttons = [];

  if (buttonType !== "check" && buttonType !== "uncheck") {
    console.error("Type de bouton invalide");
    return;
  } else {
    if (buttonType === "check") {
      buttons = cButtons;
    } else if (buttonType === "uncheck") {
      buttons = uButtons;
    }

    let delay = 0;
    buttons.forEach((button) => {
      setTimeout(() => {
        button.click();
      }, delay);
      delay += 150;
    });
  }
};

/**
 * Ecoute les évènements sur le bouton de validation de toutes les quêtes.
 */
const listenToValidateAll = () => {
  const validateAll = document.querySelector("#validateAll");
  const checkedButtons = document.querySelectorAll(".js-quest .check");
  const uncheckedButtons = document.querySelectorAll(".js-quest .uncheck");
  let buttonsType = "check";

  // S'il n'y a aucun bouton de check, cela signifie que toutes les quêtes sont validées.
  // Préparation pour la dévalidation de toutes les quêtes.
  if (checkedButtons.length === 0) {
    // l'event mouseover et mouseout appliquent la couleur #f37f81 sur les boutons à dévalidés.
    // Les autres boutons restent inchangés.
    buttonsType = "uncheck";

    validateAll.addEventListener("mouseover", () => {
      uncheckedButtons.forEach((cButton) => {
        cButton.style.backgroundColor = "#f37f81";
      });
    });

    validateAll.addEventListener("mouseout", () => {
      uncheckedButtons.forEach((cButton) => {
        cButton.style.backgroundColor = "";
      });
    });
  } else if (checkedButtons.length >= 0 && uncheckedButtons.length >= 0) {
    // S'il y a les deux types de boutons, on privilégie la validation des restant.
    // l'event mouseover et mouseout appliquent la couleur #23DC3D sur les boutons à validés.
    // Les autres boutons restent inchangés.
    validateAll.addEventListener("mouseover", () => {
      checkedButtons.forEach((cButton) => {
        cButton.style.backgroundColor = "#23DC3D";
      });
    });

    validateAll.addEventListener("mouseout", () => {
      checkedButtons.forEach((cButton) => {
        cButton.style.backgroundColor = "";
      });
    });
  }

  validateAll.addEventListener("click", () => {
    pushValidateAll(buttonsType);
  });
};

const launchFunctions = () => {
  listenToOpenAll();
  listenToValidateAll();
};

document.addEventListener("DOMContentLoaded", launchFunctions);
document.addEventListener("turbo:frame-render", launchFunctions);
