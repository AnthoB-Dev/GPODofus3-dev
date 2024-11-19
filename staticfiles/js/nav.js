/**
 * - Met à jour le titre du guide de topNav.
 * - Puis updateSelectedGuide()
 */
document.addEventListener("turbo:before-render", (event) => {
  
  // Récupère le nouveau titre depuis la réponse
  const newTitle = event.detail.newBody.querySelector(
    "#topNav .guide-header h2"
  )?.textContent;

  if (newTitle) {
    const currentTitle = document.querySelector(
      "#topNav .guide-header h2"
    );
    if (currentTitle) {
      currentTitle.textContent = newTitle;
    }
    updateSelectedGuide();
  }
});

// Appel topNavHandler() après chaque chargement Turbo.
// Appel clickFirstAchievementNotCompleted() après 200ms pour laisser le temps à topNavHandler() de faire ce qu'il a à faire. Délais min : 100ms
document.addEventListener("turbo:load", () => {
  topNavHandler();
  setTimeout(() => {
    clickFirstAchievementNotCompleted();
  }, 200);
});

/**
 * - Met à jour la sélection du dropdown.
 * - Puis clickFirstAchievementNotCompleted()
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
};

/**
 * - Simule un clique sur le premier achievement non complété.
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
  notCompletedAchievements[0] ? notCompletedAchievements[0].querySelector(".achievementName a").click() : null;
}

/**
 * - Ajoute un état "initialized".
 * - Ajoute un listener sur la topNav (guide-header) pour ouvrir / fermer le dropdown\
 * avec toggleDropDown()
 * - Ajoute un listener sur chaque guide-item pour changer de guide + Remplace .selected pour le mettre sur l'item nouvellement sélectionné\
 * puis toggleDropdown()
 * - Ajoute un listener sur le document pour fermer le dropdown lors d'un clique en dehors du dropdown.
 */
const topNavHandler = () => {
  const topNav = document.getElementById("topNav");
  const guideHeader = topNav.querySelector(".guide-header");
  const dropDownContent = topNav.querySelector(".dropdown-content");
  const overflow = dropDownContent.querySelector(".overflow");

  if (!guideHeader.hasAttribute("data-initialized")) {
    guideHeader.setAttribute("data-initialized", "true");

    // Listener sur le guide-header pour ouvrir / fermer le dropdown
    guideHeader.addEventListener("click", (event) => {
      event.stopPropagation(); // Empêche la propagation de l'événement pour éviter de fermer immédiatement
      if (!topNav.classList.contains("js-open")) {
        toggleDropdown();
        
        // Scroll vers l'élément sélectionné lors de l'ouverture du dropdown
        setTimeout(() => {
          const selectedItem = overflow.querySelector(".guide-item.selected");
          if (selectedItem) {
            selectedItem.scrollIntoView({
              behavior: "auto",
              block: "center",
            });
          }
        }, 10);
      } else {
        toggleDropdown();
      }
    });

    // Listener sur chaque guide-item pour changer de guide
    overflow.querySelectorAll(".guide-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();

        // Mise à jour de l'item sélectionné .selected
        document
          .querySelectorAll(".guide-item")
          .forEach((i) => i.classList.remove("selected"));
        item.classList.add("selected");

        // Ajout d'un timeout avant le toggle pour permettre la fermeture du dropdown de manière fluide.
        setTimeout(() => {
          toggleDropdown();
        }, 100);

        Turbo.visit(item.dataset.url, {
          action: "replace",
          frame: "frame_main",
        });
      });
      
    });

    // Listener sur le document pour fermer le dropdown lors d'un clique en dehors du dropdown
    document.addEventListener("click", (e) => {
      if (!topNav.contains(e.target) && !e.target.classList.contains("guide-item") && topNav.classList.contains("js-open")) {
        toggleDropdown();
      }
    })
  }
};

/**
 * - Toggle l'ouverture / fermeture du dropdown.
 * - Ajuste le border-radius du topNav selon l'état du dropdown.
 * - Puis toggleCaret()
 */
const toggleDropdown = () => {
  const topNav = document.getElementById("topNav");
  const overflow = document.querySelector('.overflow');
  const dropDownContent = topNav.querySelector(".dropdown-content");

  if (!topNav.classList.contains("js-open")) {
    topNav.classList.remove('js-close');
    topNav.classList.add('js-open');
    overflow.classList.remove('hidden');
    dropDownContent.classList.remove('hidden');

    // Force le recalcul du style permettant à la transition de se jouer
    overflow.offsetHeight;
    overflow.classList.add('overflowOpen');
    overflow.classList.remove('overflowClose');
  } else {
    topNav.classList.remove('js-open');
    topNav.classList.add('js-close');
    overflow.classList.remove('overflowOpen');
    overflow.classList.add('overflowClose');
    setTimeout(() => {
      overflow.classList.add('hidden');
      dropDownContent.classList.add('hidden');
    }, 100); // Correspond à la durée de la transition
  }
  toggleCaret();
}

/**
 * - Toggle l'icône du dropdown.
 */
const toggleCaret = () => {
  const caret = document.querySelector("#topNav i");
  caret.classList.toggle("caretClose");
  caret.classList.toggle("caretOpen");
}