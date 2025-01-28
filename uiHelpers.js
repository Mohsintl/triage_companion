import { storageInfo } from './constants.js';

export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
}

export function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }, 100);
}

// UI Setup Functions
export function addInfoIconAndModal() {
    const title = document.querySelector('h2');
    if (title) {
        const infoIcon = document.createElement('span');
        infoIcon.innerHTML = ' &#9432;';
        infoIcon.className = 'info-icon';
        title.appendChild(infoIcon);

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Extension Information</h3>
                <p>${storageInfo}</p>
            </div>
        `;
        document.body.appendChild(modal);

        infoIcon.addEventListener('click', () => modal.style.display = 'block');
        modal.querySelector('.close').addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (event) => {
            if (event.target == modal) modal.style.display = 'none';
        });
    } else {
        console.error('Could not find the h2 element to append the info icon');
    }
}

export function setupRadioButtons(triageButton) {
    const radioContainer = document.createElement('div');
    radioContainer.className = 'radio-container';
    radioContainer.style.display = 'flex';
    radioContainer.style.justifyContent = 'space-around';
    radioContainer.style.alignItems = 'center';
    radioContainer.style.marginBottom = '10px';
    radioContainer.innerHTML = `
        <label style="display: flex; align-items: center;">
            <input type="radio" name="displayFormat" value="default" checked>
            <span style="margin-left: 5px;">Default</span>
        </label>
        <label style="display: flex; align-items: center;">
            <input type="radio" name="displayFormat" value="format2">
            <span style="margin-left: 5px;">Triaging</span>
        </label>
        <label style="display: flex; align-items: center;">
            <input type="radio" name="displayFormat" value="format3">
            <span style="margin-left: 5px;">QATestTriage</span>
        </label>
    `;
    triageButton.parentNode.insertBefore(radioContainer, triageButton.nextSibling);
    return radioContainer;
}
