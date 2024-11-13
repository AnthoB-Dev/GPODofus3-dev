const url = "/app/guide";


document.addEventListener("turbo:load", () => {
  let hasRedirected = localStorage.getItem("hasRedirected");

  if (!hasRedirected) {
    const lastGuideId = localStorage.getItem("lastGuideId");
    const lastAchievementId = localStorage.getItem("lastAchievementId");

    if (lastGuideId) {
      if (lastAchievementId) {
        // Rediriger vers le succès non complété
        Turbo.visit(`${url}/${lastGuideId}/achievements/${lastAchievementId}/`);
      } else {
        // Rediriger vers le dernier guide vu
        Turbo.visit(`${url}/${lastGuideId}/`);
      }
      hasRedirected = true;  // Marquer comme redirigé
    }
  }
  initializeDropdown();
  updateSelectedGuide();
});

document.addEventListener("turbo:before-render", (event) => {
  // Récupérer le nouveau titre depuis la réponse
  const newTitle = event.detail.newBody.querySelector(
    "#guide-dropdown .guide-header h2"
  )?.textContent;

  if (newTitle) {
    // Mettre à jour le titre dans topNav
    const currentTitle = document.querySelector(
      "#guide-dropdown .guide-header h2"
    );
    if (currentTitle) {
      currentTitle.textContent = newTitle;
    }
    // Mettre à jour la sélection dans le dropdown
    updateSelectedGuide();
  }
});

const updateSelectedGuide = () => {
  const currentTitle = document.querySelector(
    "#guide-dropdown .guide-header h2"
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

const initializeDropdown = () => {
  const dropdown = document.getElementById("guide-dropdown");
  if (!dropdown) return;

  const header = dropdown.querySelector(".guide-header");
  const content = dropdown.querySelector(".dropdown-content");

  if (!header.hasAttribute("data-initialized")) {
    header.setAttribute("data-initialized", "true");

    header.addEventListener("click", () => {
      content.classList.toggle("hidden");

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