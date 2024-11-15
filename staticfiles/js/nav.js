const url = "/app/guide";
const dropdownContent = document.querySelector('.dropdown-content .overflow');


// Ecouteur pour mettre à jour le titre et la sélection du dropdown
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

// Mettre à jour la sélection du dropdown, plus sauvegarde de lastAchievementId
const updateSelectedGuide = () => {
  const currentTitle = document.querySelector(
    "#topNav .guide-header h2"
  )?.textContent;
  const guideItems = document.querySelectorAll(".guide-item");

  guideItems.forEach((item) => {
    if (item.textContent.trim() === currentTitle?.trim()) {
      item.classList.add("selected");
      // Sauvegarder le dernier guide vu
      localStorage.setItem("lastGuideId", item.dataset.guideId);
    } else {
      item.classList.remove("selected");
    }
  });

  // Sauvegarder le succès non complété
  const percentages = document.querySelectorAll(".js-achievementPercent");
  let notCompletedAchievements = [];
  
  percentages.forEach((item) => {
    const completionPercentage = Number(item.textContent);
    const button = item.parentElement?.parentElement;

    if (completionPercentage < 100) {
      notCompletedAchievements.push(button);
    } 
  });
  localStorage.setItem("lastAchievementId", notCompletedAchievements[0]?.dataset.achievementId);
  notCompletedAchievements[0] ? notCompletedAchievements[0].querySelector("button").click() : null;
};

function openDropdown() {
  dropdownContent.classList.remove('overflowClose');
  setTimeout(() => {
    dropdownContent.classList.add('overflowOpen');
  }, 10);
}

function closeDropdown() {
  dropdownContent.classList.remove('overflowOpen');
  setTimeout(() => {
    dropdownContent.classList.add('overflowClose');
  }, 10);
}

// Initialisation du dropdown
const initializeDropdown = () => {
  const dropdown = document.getElementById("topNav");
  if (!dropdown) return;

  const header = dropdown.querySelector(".guide-header");
  const content = dropdown.querySelector(".dropdown-content");
  const caret  = dropdown.querySelector("i");
  const overflowContainer = content.querySelector(".overflow");

  if (!header.hasAttribute("data-initialized")) {
    header.setAttribute("data-initialized", "true");

    header.addEventListener("click", () => {
      content.classList.toggle("hidden");
      
      dropdown.classList.toggle("topNavOpen");
      caret.classList.toggle("caretOpen");
      caret.classList.toggle("caretClose");
      
      if (content.style.position == "initial") {
        content.style.position = "";
      } else {
        content.style.position = "initial";
      }

      if (dropdown.classList.contains("topNavOpen")) {
        openDropdown();
      } else {
        closeDropdown();
      }

      // Scroll vers l'élément sélectionné quand on ouvre le dropdown
      if (!content.classList.contains("hidden")) {
        setTimeout(() => {
          const selectedItem = content.querySelector(".guide-item.selected");
          if (selectedItem) {
            selectedItem.scrollIntoView({
              behavior: "auto",
              block: "center",
            });
          }
        }, 0);
      }
      
    });

    content.querySelectorAll(".guide-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        content.classList.add("hidden");

        // Mise à jour de la sélection
        document
          .querySelectorAll(".guide-item")
          .forEach((i) => i.classList.remove("selected"));
        item.classList.add("selected");

        Turbo.visit(item.dataset.url, {
          action: "replace",
          frame: "frame_main",
        });
      });
    });
  }
};