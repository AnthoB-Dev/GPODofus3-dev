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
    console.log('toggleSummary');
    const summaryBtns = await getSummaryBtns();
    console.log(summaryBtns);
    
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

const handleAlignmentForm = (alignmentForm) => {
    alignmentForm.submit();
}

const getGuideId = () => {
    return new Promise((resolve) => {
        const guideId = document.querySelector('main').dataset.guide;
        resolve(guideId);
    })
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
    const guideId = await getGuideId();
    if (guideId == 1) {
        const alignmentForm = document.querySelector('#alignment_form');
        const alignmentSelect = document.getElementById("alignment");
        if (alignmentSelect) {
            alignmentSelect.addEventListener("change", function() {
                handleAlignmentForm(alignmentForm);
            });
        }
    }
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
    const main = document.querySelector('main');
    if (main.dataset.guide == 1) {
        const alignment = document.querySelector('#alignment_form');
        alignment.removeEventListener('change', () => {
            handleAlignmentForm(alignment);
        });
    }
}