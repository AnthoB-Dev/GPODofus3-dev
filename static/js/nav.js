import { addClipBoardEventListeners } from './guide.js';

/**
 * Gère la modal des options suite au clique sur l'icone des options.
 * - Lance la func de création de la modal d'options `createOptionsModal`.
 * - Lance la func d'ajout de listeners sur la modal `addOptionsListeners`.
 */
const handleOptionGearClick = async() => {
    await createOptionsModal()
    addOptionsListeners();
};

/**
 * Gère le clique pour ouvrir le dropdown menu.
 * - Lance `toggleDropdown`.
 */
const handleGuideHeaderClick = (event) => {    
    event.stopPropagation();
    toggleDropdown();
};

/**
 * Gère le clique sur un des items de la liste du dropdown.
 * - Retire `selected` à tous les elements `.guide-item` puis l'ajoute à l'item cliqué (le guide souhaité).
 * - Suite à 100ms de Timeout, lance `toggleDropdown` pour fermer le dropdown.
 * - Remplace la frame actuelle par la nouvelle via Turbo.
 */
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

/**
 * Gère le clique en dehors du dropdown pour pour le fermer rapidement.
 */
const handleDocumentClick = (e) => {
    const topNav = document.getElementById("topNav");
    if (!topNav.contains(e.target) && !e.target.classList.contains("guide-item") && topNav.classList.contains("js-open")) {
        toggleDropdown();
    }
};

/**
 * Supprime la fenêtre des options.
 */
const closeOptionsModal = () => {
    const modal = document.querySelector('.optionModalBackground');
    if (modal) {
        modal.remove();
    }
}

/**
 * Crée la fenêtre des options.
 * - Résous la promesse seulement lorsque la modal est finie d'être créer.
 * @returns {Promise}
 */
const createOptionsModal = () => {
    return new Promise ((resolve) => {
        const gearIcon = document.querySelector('#gear');
        const createSaveUrl = gearIcon.getAttribute('data-create-save-url');
        const loadSaveUrl = gearIcon.getAttribute('data-load-save-url');
        const isLinux = navigator.userAgent.includes('Linux');
        const winPath = "\\AppData\\Roaming\\GPODofus3\\saves";
        const linuxPath = "/home/.config/GPODofus3/saves";
        let savesPath = winPath;
        if (isLinux) { savesPath = linuxPath };

        // Création du conteneur & background 50% black
        const background = document.createElement('div');
        background.classList.add('optionModalBackground');
        const modal = document.createElement('div');
        modal.classList.add('optionModal')
        const closeButton = document.createElement('div');
        closeButton.classList.add('optionCloseButton');
        closeButton.id = 'optionsCloseBtn';

        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-xmark');
        
        closeButton.appendChild(closeIcon);
        modal.appendChild(closeButton);
    
        // Création du conteneur des settings
        const containerLeft = document.createElement('div');
        containerLeft.classList.add('optionLeftPanel');
        const leftTitle = document.createElement('h4');
        leftTitle.innerText = "Options";
        const settingsContainer = document.createElement('div');
        settingsContainer.classList.add('settingsContainer');
        
        // Création du setting "Thèmes"
        const settingThemes = document.createElement('button');
        settingThemes.classList.add('optionContainer');
        const iconTheme = document.createElement('i');
        iconTheme.classList.add('fa-solid', 'fa-moon')
        const pThemes = document.createElement('p');
        pThemes.innerText = "Thèmes";
        // Désactivé le temps de l'implémenter
        settingThemes.disabled = true;
        settingThemes.style.background = "#999da1";
        settingThemes.style.cursor = "not-allowed";
        
        settingThemes.appendChild(iconTheme);
        settingThemes.appendChild(pThemes);
        
        // Création du setting "Sauvegarde"
        const settingSave = document.createElement('div');
        settingSave.classList.add('optionContainer', 'active');
        const iconSave = document.createElement('i');
        iconSave.classList.add('fa-solid', 'fa-floppy-disk');
        const pSave = document.createElement('p');
        pSave.innerText = "Sauvegarde";
    
        settingSave.appendChild(iconSave);
        settingSave.appendChild(pSave);
    
        settingsContainer.appendChild(settingThemes);
        settingsContainer.appendChild(settingSave);
    
        containerLeft.appendChild(leftTitle);
        containerLeft.appendChild(settingsContainer);
    
        // Création du conteneur des options des settings
        const containerRight = document.createElement('div');
        containerRight.classList.add('optionRightPanel');
        
        // Création de l'option de sauvegarde du setting sauvegarde
        const settingSaveO1 = document.createElement('a');
        settingSaveO1.id = "option-save";
        settingSaveO1.classList.add("confirmDelete");
        settingSaveO1.setAttribute('data-turbo-stream', '');
        settingSaveO1.setAttribute('data-turbo-method', 'post');
        settingSaveO1.href = createSaveUrl;
        settingSaveO1.target = "blank";
        settingSaveO1.classList.add('settingsContainer');
        const o1Icon = document.createElement('i');
        o1Icon.classList.add('fa-solid', 'fa-upload');
        const o1TextsContainer = document.createElement('div');
        o1TextsContainer.classList.add('settingTextsContainer');
        const o1Title = document.createElement('p');
        o1Title.classList.add('settingTitle');
        o1Title.innerText = "Créer un fichier de sauvegarde";
        const o1UnderTitle = document.createElement('p');
        o1UnderTitle.classList.add('settingDescription');
        
        o1UnderTitle.innerHTML = `Créer un fichier dans ${savesPath} qui sauvegarde la progression générale.<br/>À utiliser avant de mettre à jour l’application.`;
    
        o1TextsContainer.appendChild(o1Title);
        o1TextsContainer.appendChild(o1UnderTitle);
        
        settingSaveO1.appendChild(o1Icon);
        settingSaveO1.appendChild(o1TextsContainer);
    
        containerRight.appendChild(settingSaveO1);
        
        // Création de l'option de chargement du setting sauvegarde
        const settingSaveO2 = document.createElement('a');
        settingSaveO2.id = "option-load";
        settingSaveO2.setAttribute('data-turbo-stream', '');
        settingSaveO2.setAttribute('data-turbo-method', 'post');
        settingSaveO2.href = loadSaveUrl;
        settingSaveO2.target = "blank";
        settingSaveO2.classList.add('settingsContainer');
        const o2Icon = document.createElement('i');
        o2Icon.classList.add('fa-solid', 'fa-download');
        const o2TextsContainer = document.createElement('div');
        o2TextsContainer.classList.add('settingTextsContainer');
        const o2Title = document.createElement('p');
        o2Title.classList.add('settingTitle');
        o2Title.innerText = "Charger la sauvegarde";
        const o2UnderTitle = document.createElement('p');
        o2UnderTitle.classList.add('settingDescription');
        o2UnderTitle.innerHTML = `Charge le fichier de sauvegarde le plus récent situé à l’emplacement ${savesPath}.<br/>À utiliser une fois l’application mise à jour.<br>Pour charger une sauvegarde antérieur, renommez la sauvegarde souhaité de sorte a ce qu'elle soit la plus récente.`;
    
        o2TextsContainer.appendChild(o2Title);
        o2TextsContainer.appendChild(o2UnderTitle);
        
        settingSaveO2.appendChild(o2Icon);
        settingSaveO2.appendChild(o2TextsContainer);
    
        containerRight.appendChild(settingSaveO2);

        // Création de l'information comment trouver le dossier saves
        const settingSaveInfo = document.createElement('span');
        settingSaveInfo.id = "option-info";
        settingSaveInfo.classList.add('settingsContainer');
        settingSaveInfo.style.cursor="initial";
        settingSaveInfo.style.background="initial";
        const oInfoTextsContainer = document.createElement('div');
        oInfoTextsContainer.classList.add('settingTextsContainer');
        const oInfoTitle = document.createElement('p');
        oInfoTitle.classList.add('settingTitle');
        oInfoTitle.innerText = "Trouver le dossier de sauvegarde";
        const oInfoUnderTitle = document.createElement('p');
        oInfoUnderTitle.classList.add('settingDescription');
        oInfoUnderTitle.innerHTML = `Pour accéder au dossier de sauvegarde, vous pouvez faire la combinaison de touches <strong>WINDOWS</strong> + <strong>R</strong> et entrer <span class="js-clipboard">%AppData%/GPODofus3/saves</span>`;

        oInfoTextsContainer.appendChild(oInfoTitle);
        oInfoTextsContainer.appendChild(oInfoUnderTitle);
        
        settingSaveInfo.appendChild(oInfoTextsContainer);
    
        containerRight.appendChild(settingSaveInfo);
    
        modal.appendChild(containerLeft);
        modal.appendChild(containerRight);
    
        background.appendChild(modal);

        document.body.appendChild(background);
        resolve();
    })
}

/**
 * Gère la visibilité du dropdown.
 */
const toggleDropdown = () => {
    const topNav = document.getElementById("topNav");
    const overflow = document.querySelector('.overflow');
    const dropDownContent = topNav.querySelector(".dropdown-content");
    const searchDiv = topNav.querySelector("#searchDiv");

    if (!topNav.classList.contains("js-open")) {
        topNav.classList.remove('js-close');
        topNav.classList.add('js-open');
        overflow.classList.remove('hidden');
        dropDownContent.classList.remove('hidden');
        overflow.offsetHeight;
        overflow.classList.add('overflowOpen');
        overflow.classList.remove('overflowClose');
        searchDiv.classList.remove("hidden");

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
        searchDiv.classList.add("hidden");

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

/**
 * Gère les listeners de la modal d'options.
 * TODO - Gérer la fermeture en cliquant en dehors de la fenêtre
 */
const addOptionsListeners = () => {
    const optionsCloseBtn = document.querySelector('#optionsCloseBtn');
    // const confirmDelete = document.querySelector('#option-save');
    // const backgroundModal = document.querySelector('.optionModalBackground');

    optionsCloseBtn.addEventListener('click', () => {
        closeOptionsModal();
    });

    // confirmDelete.addEventListener('click', (e) => {
    //     const confirmSave = confirm("Êtes-vous sûr de vouloir créer un fichier de sauvegarde ? Le fichier précédent sera renommé en old_save.");
    //     if (!confirmSave) {
    //         e.preventDefault();
    //     }
    // })

    // backgroundModal.addEventListener('click', () => {
    //     closeOptionsModal();
    // });

    addClipBoardEventListeners();
}

const handleSearchDivClick = (e) => {
    addSearchListeners();
}

const addSearchListeners = async() => {
    let searchInput = document.querySelector("#search");
    const searchList = await getGuideItemsFormatted();
    
    searchInput.addEventListener("input", () => {
        let input = searchInput.value.trim().toLowerCase();
        searchGuides(input, searchList);
    })
}

const getGuideItemsFormatted = () => {
    return new Promise ((resolve) => {
        const guideItems = document.querySelectorAll(".guide-item");
        resolve(guideItems);
    })
}

const searchGuides = async (searchInput, searchList) => {
    searchList.forEach(item => {
        const originalText = item.textContent.trim();
        const lowerText = originalText.toLowerCase();
        const index = lowerText.indexOf(searchInput);

        if (index !== -1 && searchInput !== "") {
            item.style.display = "list-item";

            const beforeMatch = originalText.slice(0, index);
            const match = originalText.slice(index, index + searchInput.length);
            const afterMatch = originalText.slice(index + searchInput.length);

            item.innerHTML = `${beforeMatch}<mark>${match}</mark>${afterMatch}`;
        } else if (searchInput === "") {
            item.style.display = "list-item";
            item.innerHTML = originalText; // Réinitialise l'affichage
        } else {
            item.style.display = "none";
        }
    });
};


/**
 * Supprime les messages de confirmation de réussite ou d'échec.
 */
export const removeMessages = () => {
    const messages = document.querySelector('#messages');
    let timeout;

    messages.classList.contains('failure') ? timeout = 10000 : timeout = 6000

    setTimeout(() => {
        messages.classList.add('hidden');
    }, timeout);
}

/**
 * Met à jour le titre visible sur la topNav (dropdown menu).
 */
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

/**
 * Met à jour le guide selectionné.
 * - Boucle sur les "guide-item" qui sont les guides cliquables dans le dropdown.
 * - Supprime les 8 premiers caractères "Nv.XX - ".
 * - Ajoute la classe "selected" au nouceau guide selectionné dans le dropdown. (Fond blanc).
 */
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

export const addNavEventListeners = () => {
    const topNav = document.getElementById("topNav");
    const guideHeader = topNav.querySelector(".guide-header");
    const dropDownContent = topNav.querySelector(".dropdown-content");
    const overflow = dropDownContent.querySelector(".overflow");
    const optionsGear = document.querySelector("#gear");
    const searchDiv = document.querySelector("#search");

    if (!guideHeader.hasAttribute("data-initialized")) {
        guideHeader.setAttribute("data-initialized", "true");
        guideHeader.addEventListener("click", handleGuideHeaderClick);
    }

    overflow.querySelectorAll(".guide-item").forEach((item) => {
        item.addEventListener("click", handleGuideItemClick);
    });

    document.addEventListener("click", handleDocumentClick);

    optionsGear.addEventListener("click", handleOptionGearClick);

    searchDiv.addEventListener("click", handleSearchDivClick);

    // Ajout des écouteurs d'événements pour les boutons de navigation de la page
    addPageNavEventListeners();
};

export const removeNavEventListeners = () => {
    const topNav = document.getElementById("topNav");
    const guideHeader = topNav.querySelector(".guide-header");
    const dropDownContent = topNav.querySelector(".dropdown-content");
    const overflow = dropDownContent.querySelector(".overflow");
    const searchDiv = document.querySelector("#search");

    if (guideHeader.hasAttribute("data-initialized")) {
        guideHeader.removeAttribute("data-initialized");
        guideHeader.removeEventListener("click", handleGuideHeaderClick);
    }

    overflow.querySelectorAll(".guide-item").forEach((item) => {
        item.removeEventListener("click", handleGuideItemClick);
    });

    document.removeEventListener("click", handleDocumentClick);

    searchDiv.removeEventListener("click", handleSearchDivClick);

    // Suppression des écouteurs d'événements pour les boutons de navigation de la page
    removePageNavEventListeners();
};