import { getAchievements } from "./achievements.js";

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

const getSummaryBtns = () => {
    return new Promise((resolve) => {
        const summaryBtns = document.querySelectorAll('.jsToggleSummaryBtn');
        resolve(summaryBtns);
    })
}

const getImages = () => {
    return new Promise((resolve) => {
        const images = document.querySelectorAll('.guide_element img');
        resolve(images);
    })
}

const getGuideId = () => {
    return new Promise((resolve) => {
        const guideId = document.querySelector('main').dataset.guide;
        resolve(guideId);
    })
}

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