import { getAchievements } from './achievements.js';

export const updateTopNavTitle = (event = null) => {
    let newTitle;

    if (event && event.detail && event.detail.newBody) {
        // Si event.detail.newBody est disponible (dans turbo:before-render)
        newTitle = event.detail.newBody.querySelector("#topNav .guide-header h2")?.textContent;
    } else {
        // Sinon, on prend le titre actuel
        newTitle = document.querySelector("#topNav .guide-header h2")?.textContent;
    }

    if (newTitle) {
        const currentTitle = document.querySelector("#topNav .guide-header h2");
        if (currentTitle) {
            currentTitle.textContent = newTitle;
        }
    }
};

export const updateSelectedGuide = () => {
    const currentTitle = document.querySelector("#topNav .guide-header h2")?.textContent;
    const guideItems = document.querySelectorAll(".guide-item");

    guideItems.forEach((item) => {
        const itemTitle = item.textContent.trim().split(" ").slice(7).join(" ");

        if (itemTitle == currentTitle?.trim()) {
            item.classList.add("selected");
        } else {
            item.classList.remove("selected");
        }
    });
};

const handleOptionGearClick = async() => {
    await createOptionsModal()
    addOptionsListeners();
};

const handleGuideHeaderClick = (event) => {
    event.stopPropagation();
    toggleDropdown();
};

const handleGuideItemClick = (e) => {
    e.preventDefault();
    document.querySelectorAll(".guide-item").forEach((i) => i.classList.remove("selected"));
    e.currentTarget.classList.add("selected");
    setTimeout(() => {
        toggleDropdown();
    }, 100);
    Turbo.visit(e.currentTarget.dataset.url, {
        action: "replace",
        frame: "frame_main",
    });
};

const handleDocumentClick = (e) => {
    const topNav = document.getElementById("topNav");
    if (!topNav.contains(e.target) && !e.target.classList.contains("guide-item") && topNav.classList.contains("js-open")) {
        toggleDropdown();
    }
};

export const addNavEventListeners = () => {
    const topNav = document.getElementById("topNav");
    const guideHeader = topNav.querySelector(".guide-header");
    const dropDownContent = topNav.querySelector(".dropdown-content");
    const overflow = dropDownContent.querySelector(".overflow");
    const optionGear = document.querySelector("#gear");

    if (!guideHeader.hasAttribute("data-initialized")) {
        guideHeader.setAttribute("data-initialized", "true");
        guideHeader.addEventListener("click", handleGuideHeaderClick);
    }

    overflow.querySelectorAll(".guide-item").forEach((item) => {
        item.addEventListener("click", handleGuideItemClick);
    });

    document.addEventListener("click", handleDocumentClick);

    optionGear.addEventListener("click", handleOptionGearClick)

    // Ajout des écouteurs d'événements pour les boutons de navigation de la page
    addPageNavEventListeners();
};

export const removeNavEventListeners = () => {
    const topNav = document.getElementById("topNav");
    const guideHeader = topNav.querySelector(".guide-header");
    const dropDownContent = topNav.querySelector(".dropdown-content");
    const overflow = dropDownContent.querySelector(".overflow");

    if (guideHeader.hasAttribute("data-initialized")) {
        guideHeader.removeAttribute("data-initialized");
        guideHeader.removeEventListener("click", handleGuideHeaderClick);
    }

    overflow.querySelectorAll(".guide-item").forEach((item) => {
        item.removeEventListener("click", handleGuideItemClick);
    });

    document.removeEventListener("click", handleDocumentClick);

    // Suppression des écouteurs d'événements pour les boutons de navigation de la page
    removePageNavEventListeners();
};

/**
 * Ajoute la fenêtre des options.
 */
const createOptionsModal = () => {
    return new Promise ((resolve) => {

        const background = document.createElement('div');
        background.classList.add('optionModalBackground');
        const modal = document.createElement('div');
        modal.classList.add('optionModal')
    
        const containerLeft = document.createElement('div');
        containerLeft.classList.add('optionLeftPanel');
        const leftTitle = document.createElement('h4');
        leftTitle.innerText = "Options";
        const leftOptionsContainer = document.createElement('div');
        leftOptionsContainer.classList.add('leftOptionsContainer');
        
        const optionContainer1 = document.createElement('div');
        optionContainer1.classList.add('optionContainer');
        const iconTheme = document.createElement('i');
        iconTheme.classList.add('fa-solid', 'fa-moon')
        const pThemes = document.createElement('p');
        pThemes.innerText = "Thèmes";
        
        optionContainer1.appendChild(iconTheme);
        optionContainer1.appendChild(pThemes);
    
        const optionContainer2 = document.createElement('div');
        optionContainer2.classList.add('optionContainer', 'active');
        const iconSave = document.createElement('i');
        iconSave.classList.add('fa-solid', 'fa-floppy-disk');
        const pSave = document.createElement('p');
        pSave.innerText = "Sauvegarde";
    
        optionContainer2.appendChild(iconSave);
        optionContainer2.appendChild(pSave);
    
        leftOptionsContainer.appendChild(optionContainer2);
        leftOptionsContainer.appendChild(optionContainer1);
    
        containerLeft.appendChild(leftTitle);
        containerLeft.appendChild(leftOptionsContainer);
    
    
        const containerRight = document.createElement('div');
        containerRight.classList.add('optionRightPanel');
        
        const option1 = document.createElement('a');
        option1.id = "option-save";
        option1.href = "http://localhost:8000/create-save";
        option1.target = "blank";
        option1.classList.add('settingsContainer');
        const iconCreateSave = document.createElement('i');
        iconCreateSave.classList.add('fa-solid', 'fa-upload');
        const option1TextDiv = document.createElement('div');
        option1TextDiv.classList.add('settingTextsContainer');
        const titleOption1 = document.createElement('p');
        titleOption1.classList.add('settingTitle');
        titleOption1.innerText = "Créer un fichier de sauvegarde";
        const underTitleOption1 = document.createElement('p');
        underTitleOption1.classList.add('settingDescription');
        underTitleOption1.innerHTML = "Créer un fichier dans AppData\Roaming\GPODofus3 qui sauvegarde la progression des quêtes.<br/>À utiliser avant de mettre à jour l’application.";
    
        option1TextDiv.appendChild(titleOption1);
        option1TextDiv.appendChild(underTitleOption1);
        
        option1.appendChild(iconCreateSave);
        option1.appendChild(option1TextDiv);
    
        containerRight.appendChild(option1);
        
        const option2 = document.createElement('a');
        option2.id = "option-load";
        option2.href = "http://localhost:8000/load-save";
        option2.target = "blank";
        option2.classList.add('settingsContainer');
        const iconLoadSave = document.createElement('i');
        iconLoadSave.classList.add('fa-solid', 'fa-download');
        const option2TextDiv = document.createElement('div');
        option2TextDiv.classList.add('settingTextsContainer');
        const titleOption2 = document.createElement('p');
        titleOption2.classList.add('settingTitle');
        titleOption2.innerText = "Charger la sauvegarde";
        const underTitleOption2 = document.createElement('p');
        underTitleOption2.classList.add('settingDescription');
        underTitleOption2.innerHTML = "Charge le fichier de sauvegarde situé à l’emplacement AppData\Roaming\GPODofus3.<br/>À utiliser une fois l’application mise à jour.";
    
        option2TextDiv.appendChild(titleOption2);
        option2TextDiv.appendChild(underTitleOption2);
        
        option2.appendChild(iconLoadSave);
        option2.appendChild(option2TextDiv);
    
        containerRight.appendChild(option2);
    
    
        modal.appendChild(containerLeft);
        modal.appendChild(containerRight);
    
        background.appendChild(modal);

        document.body.appendChild(background);
        resolve();
    })
}

const createSave = () => {
    const isElectron = navigator.userAgent.toLowerCase().includes('electron');

    if (isElectron) {
        // Code pour Electron (Node.js modules disponibles)
        const path = require('path');
        console.log('Exécution dans Electron');
        batFile = path.join(__dirname, '../scripts/create_save.bat');
        exec(batFile)
    } else {
        // Code pour un navigateur (Node.js modules non disponibles)
        console.log('Exécution dans un navigateur');
    }
}

const loadSave = () => {
    console.log("Chargement du fichier de sauvegarde");
}

const toggleOptionFunc = (option) => {
    option == "option-save" ? createSave() : null;
    option == "option-load" ? loadSave() : null;
}

const toggleDropdown = () => {
    const topNav = document.getElementById("topNav");
    const overflow = document.querySelector('.overflow');
    const dropDownContent = topNav.querySelector(".dropdown-content");

    if (!topNav.classList.contains("js-open")) {
        topNav.classList.remove('js-close');
        topNav.classList.add('js-open');
        overflow.classList.remove('hidden');
        dropDownContent.classList.remove('hidden');
        overflow.offsetHeight;
        overflow.classList.add('overflowOpen');
        overflow.classList.remove('overflowClose');

        // Assurer que l'élément sélectionné est visible
        const selected = document.querySelector('.guide-item.selected');
        if (selected) {
            selected.scrollIntoView({  block: 'nearest' });
        }
    } else {
        topNav.classList.remove('js-open');
        topNav.classList.add('js-close');
        overflow.classList.remove('overflowOpen');
        overflow.classList.add('overflowClose');
        setTimeout(() => {
            overflow.classList.add('hidden');
            dropDownContent.classList.add('hidden');
        }, 100);
    }
    toggleCaret();
};

const toggleCaret = () => {
    const caret = document.querySelector("#topNav i");
    caret.classList.toggle("caretClose");
    caret.classList.toggle("caretOpen");
};

const handlePageNavButtonClick = (e) => {
    const button = e.currentTarget;
    const url = button.getAttribute('data-url');
    const frame = button.getAttribute('data-frame');
    const action = button.getAttribute('data-action');

    if (url) {
        Turbo.visit(url, { 
            frame: frame,
            action: action
        });
    }
};

let shiftActivated = false;
let ctrlActivated = false;
let altActivated = false;

const handleKeys = async (e) => {
    const pageNavLeft = document.querySelector('#pageNavLeft');
    const pageNavRight = document.querySelector('#pageNavRight');
    const topNav = document.getElementById("topNav");
    const selected = document.querySelector('.selected');
    const openAllbtn = document.querySelector('#openAll');
    const validateAllBtn = document.querySelector('#validateAll');
    const achievements = await getAchievements();
    const activeAchievement = [...achievements].find(achievement => achievement.classList.contains("active"));
    const guideScrollable = document.querySelector('#guide .content');
    const achievementsScrollable = document.querySelector('#achievements .content');
    const guideTitle= document.querySelector('#guide h3');
    const achievementTitle = document.querySelector('#achievements h3');

    document.removeEventListener('keyup', handleKeys);

    // Mettre à jour l'état des touches modificateurs
    if (e.type === 'keydown') {
        if (e.key === 'Shift') {
            if (!shiftActivated) {
                shiftActivated = true;
                achievementTitle.classList.add('keyboardFocusedElement');
                guideTitle.classList.remove('keyboardFocusedElement');
                topNav.classList.contains("js-open") ? toggleDropdown() : null;
                ctrlActivated = false;
            } else {
                shiftActivated = false;
                achievementTitle.classList.remove('keyboardFocusedElement');
            }
        } 
        if (e.key === 'Control') {
            if (!ctrlActivated) {
                ctrlActivated = true;
                guideTitle.classList.add('keyboardFocusedElement');
                achievementTitle.classList.remove('keyboardFocusedElement');
                topNav.classList.contains("js-open") ? toggleDropdown() : null;
                shiftActivated = false;
            } else {
                ctrlActivated = false;
                guideTitle.classList.remove('keyboardFocusedElement');
            }
        };
        if (e.key === 'Tab') {
            e.preventDefault();
            if (ctrlActivated || shiftActivated) {
                ctrlActivated = false;
                shiftActivated = false
            }
        };
        if (e.key === 'Alt') altActivated = true;
    } else if (e.type === 'keyup') {
        if (e.key === 'Alt') altActivated = false;
    }

    const shiftIsActivated = !ctrlActivated && shiftActivated;
    const ctrlIsActivated = ctrlActivated && !shiftActivated;
    const nothingActivated = !ctrlActivated && !shiftActivated;

    const arrowDown = e.type === 'keydown' && e.key === 'ArrowDown';
    const arrowUp = e.type === 'keydown' && e.key === 'ArrowUp';
    const arrowLeft = e.type === 'keydown' && e.key === 'ArrowLeft';
    const arrowRight = e.type === 'keydown' && e.key === 'ArrowRight';
    const enterKey = e.key === 'Enter';
    const escapeKey = e.key === 'Escape';
    const oKey = e.key === 'o';
    const vKey = e.key === 'v';

    if (nothingActivated && arrowLeft) {
        pageNavLeft.click();
    } else if (nothingActivated && arrowRight) {
        pageNavRight.click();
    } else if (nothingActivated && arrowDown) {
        if (!topNav.classList.contains('js-open')) {
            toggleDropdown();
        } else {
            if (selected.nextElementSibling) {
                selected.nextElementSibling?.classList.add('selected');
                selected.classList.remove('selected');
                selected.nextElementSibling?.scrollIntoView({ block: 'nearest' });
            }
        }
    } else if (nothingActivated && arrowUp) {
        if (topNav.classList.contains('js-open')) {
            if (selected.previousElementSibling) {
                selected.previousElementSibling.classList.add('selected');
                selected.classList.remove('selected');
                selected.previousElementSibling.scrollIntoView({ block: 'nearest' });
            } else if (selected.previousElementSibling === null) {
                toggleDropdown();
            }
        }
    } else if (shiftIsActivated && arrowDown) {
        if (achievementsScrollable) {
            achievementsScrollable.scrollBy({ top: 30, behavior: 'smooth' });
        }
        activeAchievement.parentElement.nextElementSibling?.querySelector('.achievementName a').click();
    } else if (shiftIsActivated && arrowUp) {
        if (achievementsScrollable) {
            achievementsScrollable.scrollBy({ top: -30, behavior: 'smooth' });
        }
        activeAchievement.parentElement.previousElementSibling?.querySelector('.achievementName a').click();
    } else if (nothingActivated && enterKey && topNav.classList.contains('js-open')) {
        selected.click();
    } else if (escapeKey && topNav.classList.contains('js-open')) {
        if (topNav.classList.contains('js-open')) {
            toggleDropdown();
        }
    } else if (nothingActivated && oKey) {
        openAllbtn.click();
    } else if (nothingActivated && vKey) {
        validateAllBtn.click();
    } else if (ctrlIsActivated && arrowDown) {
        if (guideScrollable) {
            guideScrollable.scrollBy({ top: 250, behavior: 'smooth' });
        }
    } else if (shiftIsActivated && arrowUp) {
        if (guideScrollable) {
            guideScrollable.scrollBy({ top: -250, behavior: 'smooth' });
        }
    }
}

export const addKeysEventListeners = () => {
    document.addEventListener('keydown', handleKeys);
    document.addEventListener('keyup', handleKeys);
};

export const removeKeysEventListeners = () => {
    document.removeEventListener('keydown', handleKeys);
    document.removeEventListener('keyup', handleKeys);
};

const addPageNavEventListeners = () => {
    const navButtons = document.querySelectorAll('.page-nav-button');

    navButtons.forEach(function(button) {
        button.addEventListener('click', handlePageNavButtonClick);
    });
};

const removePageNavEventListeners = () => {
    const navButtons = document.querySelectorAll('.page-nav-button');

    navButtons.forEach(function(button) {
        button.removeEventListener('click', handlePageNavButtonClick);
    });
};

const addOptionsListeners = () => {
    const options = document.querySelectorAll('.settingsContainer');

    options.forEach(option => {
        option.addEventListener('click', () => { toggleOptionFunc(option.id) });
    });
}
