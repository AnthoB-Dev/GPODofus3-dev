import { getAchievements } from "./achievements.js";

/**
 * Créer une modal pour enlargir les images.
 */
const createModal = (image) => {
    const modal = document.createElement('div');
    const img = document.createElement('img');
    
    img.src = image.src;
    img.classList.add('is-open');

    modal.classList.add('modalImage');
    modal.classList.remove('modal-close');

    document.body.appendChild(modal);

    if (img.naturalWidth < 600) {
        img.style.zoom = 1.5;
    } else if (img.naturalWidth < 800) {
        img.style.zoom = 1.2;
    }

    setTimeout(() => {
        modal.classList.add('modal-open');
    }, 30);
    setTimeout(() => {
        modal.appendChild(img);
    }, 300);

    modal.addEventListener('click', removeModal);
}

/**
 * Supprime la modal du DOM.
 */
const removeModal = () => {
    const modal = document.querySelector('.modalImage');
    if (modal) {
        modal.classList.remove('modal-open');
        modal.classList.add('modal-close');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    modal.removeEventListener('click', removeModal);
}

/**
 * Ouvre les boutons `Afficher`.
 * @param {*} button 
 */
const toggleSummary = async (button) => {
    const summaryBtns = await getSummaryBtns();
    
    let summary;
    summaryBtns.forEach(btn => {
        if (btn !== button) {
            btn.textContent = "Afficher";
            summary = btn.nextElementSibling;
            summary.style="";
            summary.classList.remove('open');
        } else {
            summary = btn.nextElementSibling;
            if (summary.classList.contains('open')) {
                btn.textContent = "Afficher";
                summary.style="";
            } else {
                btn.textContent = "Masquer";
                summary.style="display: block";
            }
            summary.classList.toggle('open');
        }
    })
}

/**
 * Récupère tous les boutons `Afficher` du guide. 
 */
const getSummaryBtns = () => {
    return new Promise((resolve) => {
        const summaryBtns = document.querySelectorAll('.jsToggleSummaryBtn');
        resolve(summaryBtns);
    })
}

/**
 * Récupères toute les images du guide.
 */
const getImages = () => {
    return new Promise((resolve) => {
        const images = document.querySelectorAll('.guide_element img');
        resolve(images);
    })
}

/**
 * Récupère l'id du guide actuel.
 */
const getGuideId = () => {
    return new Promise((resolve) => {
        const guideId = document.querySelector('main').dataset.guide;
        resolve(guideId);
    })
}

/**
 * Met en surbrillance le succès actuellement pointer par le curseur et le met en surbrillance dans la section `Succès`.
 * - Récupère le nom du guide via mouseover et le cherche dans la liste de succès présent dans le guide. Si il y a match, ajoute la classe pour surbrillance.
 */
const toggleHighlight = async(event, guideAchievement) => {
    const achievements = await getAchievements();

    if (!achievements) {
        console.log("Aucun succès récupérés.");
        return;
    };

    switch (event) {
        case "mouseover":
            const displayedAchievements = [...achievements].map(achievement =>
                achievement.querySelector(".achievementName").textContent.trim().toLowerCase()
            );
            const guideAchievementName = guideAchievement.textContent.trim().toLowerCase();

            if (displayedAchievements.includes(guideAchievementName)) {
                guideAchievement.classList.add("highlightInGuide");

                // Optionnel : retrouver et surligner l'élément correspondant
                const matchingAchievement = [...achievements].find(achievement =>
                    achievement.querySelector(".achievementName").textContent.trim().toLowerCase() === guideAchievementName
                );
                if (matchingAchievement) matchingAchievement.classList.add("highlight");

            } else {
                const toolTipText = document.createElement("span");
                toolTipText.classList.add("tooltip-text");
                toolTipText.innerHTML = `<span class="achievement">${guideAchievement.textContent.trim()}</span> n'est pas présent dans ce guide.`;

                guideAchievement.classList.add("tooltip");
                guideAchievement.appendChild(toolTipText);
            }
            break;

        case "mouseout":
            guideAchievement.classList.remove("highlightInGuide");
            achievements.forEach((achievement) => {
                achievement.classList.remove("highlight");
            })

            const tooltips = document.querySelectorAll(".tooltip");
            const toolTipTexts = document.querySelectorAll(".tooltip-text");

            if (tooltips || toolTipTexts) {
                tooltips.forEach(tt => {
                    tt.classList.remove("tooltip");
                }) 
                toolTipTexts.forEach(ttt => {
                    ttt.remove();
                })
            }
            break;

        default:
            console.log(`L'evenement - ${event} - n'est pas valable.`);
            break;
    }
    
}

/**
 * Récupère les succès balisés `.achievement` présents dans le DOM.
 */
const getGuideAchievements = () => {
    return new Promise ((resolve) => {
        const guideAchievementSpans = document.querySelectorAll(".achievement");
        resolve(guideAchievementSpans);
    })
}


export const addGuideAlignmentFormEventListener = () => {
    const alignmentForm = document.querySelector('#alignment_form');
    if (!alignmentForm) return;
    const select = alignmentForm.querySelector('#alignment_select');

    if (select) {
        select.addEventListener('change', () => {
            alignmentForm.requestSubmit();
        });
    }
}

export const removeGuideAlignmentFormEventListener = () => {
    const alignmentForm = document.querySelector('#alignment_form');
    if (!alignmentForm) return;
    const select = alignmentForm.querySelector('#alignment_select');

    if (select) {
        select.removeEventListener('change', () => {
            alignmentForm.requestSubmit();
        });
    }
}

export const addGuideEventListeners = async () => {
    const images = await getImages();
    images.forEach(image => {
        image.addEventListener('click', () => {
            createModal(image);
        })
    })
    const summaryBtns = await getSummaryBtns();
    summaryBtns.forEach(button => {
        button.addEventListener('click', () => {
            toggleSummary(button);
        });
    });
    const choseAlignmentGuideId = 1;
    const guideId = await getGuideId();
    if (guideId === choseAlignmentGuideId) {
        addGuideAlignmentFormEventListener();
    }
    const guideAchievementSpans = await getGuideAchievements();
    // Events JS sur les titres des guides dans Guide.
    guideAchievementSpans.forEach((guideAchievement) => {
        guideAchievement.addEventListener("mouseover", () => {
            toggleHighlight("mouseover", guideAchievement);
        })
    })
    // Event JS sur les titres des guides dans Guide.
    guideAchievementSpans.forEach((guideAchievement) => {
        guideAchievement.addEventListener("mouseout", () => {
            toggleHighlight("mouseout", guideAchievement);
        })
    })
}

export const removeGuideEventListeners = async () => {
    const images = await getImages();
    images.forEach(image => {
        image.removeEventListener('click', () => {
            createModal(image);
        })
    })
    const buttons = await getSummaryBtns();
    buttons.forEach(button => {
        button.removeEventListener('click', () => {
            toggleSummary(button);
        });
    });
    const guideAchievementSpans = await getGuideAchievements();
    // Events JS sur les titres des guides dans Guide.
    guideAchievementSpans.forEach((guideAchievement) => {
        guideAchievement.removeEventListener("mouseover", () => {
            toggleHighlight("mouseover", guideAchievement);
        })
    })
    // Event JS sur les titres des guides dans Guide.
    guideAchievementSpans.forEach((guideAchievement) => {
        guideAchievement.removeEventListener("mouseout", () => {
            toggleHighlight("mouseover", guideAchievement);
        })
    })
    removeGuideAlignmentFormEventListener();
}

/**
 * Copie le contenu de l'élement cliqué dans le clipboard.
 * @param {*} text 
 */
export const addToClipboard = (text) => {
    navigator.clipboard.writeText(text);
}

/**
 * Event listeners lié à la fonction de clipboard.
 * - mouseover : Ajoute une infobulle.
 * - click : Appel `addToClipBoard` et change le text de l'infobulle.
 * - mouseout : Après un clique, retire la span de text de l'infobulle.
 */
export const addClipBoardEventListeners = () => {
    const clipBoardElements = document.querySelectorAll(".js-clipboard");
    
    clipBoardElements.forEach(e => {
        e.addEventListener("mouseover", () => {
            const toolTipText = document.createElement("span");
            toolTipText.classList.add("tooltip-text");
            toolTipText.innerHTML = `🗒️ Cliquez pour copier.`;
            
            e.classList.add("tooltip");
            e.appendChild(toolTipText);
        })
    })

    clipBoardElements.forEach(e => {
        e.addEventListener("click", () => {
            addToClipboard(e.firstChild.textContent);
            const toolTipText = document.querySelector(".tooltip-text");
            toolTipText.innerHTML = `✅ Copié.`;
        })
    })

    clipBoardElements.forEach(e => {
        e.addEventListener("mouseout", () => {
            if (e.querySelector(".tooltip-text")) {
                e.querySelector(".tooltip-text").remove();
            } 
            e.classList.remove("tooltip");
        })
    })
}