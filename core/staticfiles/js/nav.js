document.addEventListener("turbo:load", () => {
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
    } else {
      item.classList.remove("selected");
    }
  });
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
