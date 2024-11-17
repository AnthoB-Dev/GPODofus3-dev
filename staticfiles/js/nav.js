/**
 * Met à jour le titre.\ 
 * Puis updateSelectedGuide()
 */
document.addEventListener("turbo:before-render", (event) => {
  // Récupérer le nouveau titre depuis la réponse
  const newTitle = event.detail.newBody.querySelector(
    "#topNav .guide-header h2"
  )?.textContent;

  if (newTitle) {
    // Mettre à jour le titre dans topNav
    const currentTitle = document.querySelector(
      "#topNav .guide-header h2"
    );
    if (currentTitle) {
      currentTitle.textContent = newTitle;
    }
    // Mettre à jour la sélection dans le dropdown
    updateSelectedGuide();
  }
});

/**
 * Simule un clique sur le premier achievement non complété
 */
const clickFirstAchievementNotCompleted = () => {
  const percentages = document.querySelectorAll(".js-achievementPercent");
  let notCompletedAchievements = [];
  
  percentages.forEach((item) => {
    const completionPercentage = Number(item.textContent);
    const button = item.parentElement?.parentElement;

    if (completionPercentage < 100) {
      notCompletedAchievements.push(button);
    } 
  });
  notCompletedAchievements[0] ? notCompletedAchievements[0].querySelector("button").click() : null;
}

/**
 * Met à jour la sélection du dropdown.\
 * Puis clickFirstAchievementNotCompleted()
 */
const updateSelectedGuide = () => {
  const currentTitle = document.querySelector(
    "#topNav .guide-header h2"
  )?.textContent;
  const guideItems = document.querySelectorAll(".guide-item");

  guideItems.forEach((item) => {
    if (item.textContent.trim() === currentTitle?.trim()) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });

  clickFirstAchievementNotCompleted();
};


const toggleCaret = () => {
  const caret = document.querySelector("#topNav i");
  caret.classList.toggle("caretClose");
  caret.classList.toggle("caretOpen");
}


/**
 * Ouvre le dropdown
 */
const openDropdown = () => {
  const overflow = document.querySelector('.overflow');

  overflow.classList.remove('overflowClose');
  overflow.classList.remove('hidden');
  setTimeout(() => {
    overflow.classList.add('overflowOpen');
  }, 10);
}

/**
 * Ferme le dropdown.\
 * Classes CSS:\
 * .overflowOpen\
 * .overflowClose
 */
const closeDropdown = () => {
  const overflow = document.querySelector('.overflow');
  overflow.classList.remove('overflowOpen');
  setTimeout(() => {
    overflow.classList.add('overflowClose');
    overflow.classList.add('hidden');
  }, 10);
}

/**
 * Initialisation du dropdown.\
 */
const initializeDropdown = () => {
  const topNav = document.getElementById("topNav");

  const guideHeader = topNav.querySelector(".guide-header");

  const dropDownContent = topNav.querySelector(".dropdown-content");
  const overflow = dropDownContent.querySelector(".overflow");


  if (!guideHeader.hasAttribute("data-initialized")) {
    guideHeader.setAttribute("data-initialized", "true");

    guideHeader.addEventListener("click", () => {
      dropDownContent.classList.toggle("hidden");
      toggleCaret();

      // Scroll vers l'élément sélectionné quand on ouvre le dropdown
      if (!dropDownContent.classList.contains("hidden")) {
        openDropdown()
        setTimeout(() => {
          const selectedItem = overflow.querySelector(".guide-item.selected");
          if (selectedItem) {
            selectedItem.scrollIntoView({
              behavior: "auto",
              block: "center",
            });
          }
        }, 0);
      } else {
        closeDropdown()
      }
    });

    overflow.querySelectorAll(".guide-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();

        // Mise à jour de la sélection
        document
          .querySelectorAll(".guide-item")
          .forEach((i) => i.classList.remove("selected"));
        item.classList.add("selected");

        Turbo.visit(item.dataset.url, {
          action: "replace",
          frame: "frame_main",
        });
        closeDropdown();
        toggleCaret();
      });
    });
  }
};

// Appeler initializeDropdown lors du chargement initial de la page
document.addEventListener("DOMContentLoaded", () => {
  initializeDropdown();
});

// Appeler initializeDropdown après chaque chargement Turbo
document.addEventListener("turbo:load", () => {
  initializeDropdown();
});