const html = document.querySelector('html');
const images = document.querySelectorAll('.guide_element img');

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

const toggleSummary = (button) => {
    console.log('toggleSummary');
    const summaryBtns = document.querySelectorAll('.jsToggleSummaryBtn');
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

export const addGuideEventListeners = () => {
    images.forEach(image => {
        image.addEventListener('click', () => {
            createModal(image);
        })
    })
    const summaryBtns = document.querySelectorAll('.jsToggleSummaryBtn');
    summaryBtns.forEach(button => {
        button.addEventListener('click', () => {
            toggleSummary(button);
        });
    });
}

export const removeGuideEventListeners = () => {
    images.forEach(image => {
        image.removeEventListener('click', () => {
            createModal(image);
        })
    })
    const buttons = document.querySelectorAll('.jsToggleSummaryBtn');
    buttons.forEach(button => {
        button.removeEventListener('click', () => {
            toggleSummary(button);
        });
    });
}