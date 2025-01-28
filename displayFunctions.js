import { formatDate, showToast } from './uiHelpers.js';
import { baseUrl } from './constants.js';
import { updateRepro } from './dataManipulation.js';
import { copyRow } from './copyFunctions.js';

export function displayBugs(filter = '') {
    chrome.storage.sync.get({ bugList: [] }, function(result) {
        const bugTable = document.getElementById('bugTable');
        bugTable.innerHTML = '';
        const tbody = bugTable.createTBody();

        const filteredBugs = result.bugList.filter(bug => 
            bug.bugId.toLowerCase().includes(filter.toLowerCase()) || 
            bug.title.toLowerCase().includes(filter.toLowerCase())
        );

        const selectedFormat = document.querySelector('input[name="displayFormat"]:checked').value;

        createTableHeader(bugTable, selectedFormat);
        
        if (filteredBugs.length === 0) {
            handleEmptyTable(tbody, selectedFormat);
        } else {
            populateTable(tbody, filteredBugs, selectedFormat);
        }
    });
}

function createTableHeader(bugTable, selectedFormat) {
    const headerRow = bugTable.createTHead().insertRow(0);
    const headers = {
        'default': ['Triage Date', 'Repro', 'Bug ID', 'Title', 'Status', 'Severity', 'Priority', 'Assigned To', 'Platform', 'Issue Type', 'Actions'],
        'format2': ['Date', 'Defect ID', 'Title', 'Repro', 'Status', 'Empty', 'Priority', 'Assigned To', 'Actions'],
        'format3': ['Date', 'Defect ID', 'Repro', 'Empty', 'Severity', 'Priority', 'Status', 'Actions']
    };
    headers[selectedFormat].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
}

function handleEmptyTable(tbody, selectedFormat) {
    copyAllButton.disabled = true;
    copyAllButton.classList.add('button-disabled');
    
    const row = tbody.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = selectedFormat === 'default' ? 10 : 8;
    cell.textContent = 'No Defect Details Captured';
    cell.style.textAlign = 'center';
}

function populateTable(tbody, filteredBugs, selectedFormat) {
    copyAllButton.disabled = false;
    copyAllButton.classList.remove('button-disabled');

    filteredBugs.forEach((bug, index) => {
        const row = tbody.insertRow();
        populateRow(row, bug, index, selectedFormat);
        addActionButtons(row, bug, index, selectedFormat);
    });
}

function populateRow(row, bug, index, selectedFormat) {
    const setCellContent = (cell, content, isHTML = false) => {
        if (isHTML) {
            cell.innerHTML = content;
            const links = cell.getElementsByTagName('a');
            for (let link of links) {
                link.setAttribute('target', '_blank');
                const bugKey = link.textContent.trim();
                link.href = `${baseUrl}/browse/${bugKey}`;
            }
        } else {
            cell.textContent = content;
        }
        cell.title = cell.textContent;
    };

    const createReproDropdown = (cell, bug, index) => {
        const reproDropdown = document.createElement('select');
        reproDropdown.className = 'repro-dropdown';
        ['N/A', 'Yes', 'No'].forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            reproDropdown.appendChild(optionElement);
        });
        reproDropdown.value = bug.repro || 'N/A';
        reproDropdown.addEventListener('change', (event) => updateRepro(index, event.target.value));
        cell.appendChild(reproDropdown);
    };

    const cellContents = {
        'default': [
            formatDate(bug.triageDate),
            null, // Placeholder for Repro dropdown
            bug.bugId,
            bug.title,
            bug.status,
            bug.severity,
            bug.priority,
            bug.assignedTo,
            bug.platform,
            bug.issueType
        ],
        'format2': [
            formatDate(bug.triageDate),
            bug.bugId,
            bug.title,
            bug.repro || 'N/A',
            bug.status,
            '',
            bug.priority,
            bug.assignedTo
        ],
        'format3': [
            formatDate(bug.triageDate),
            bug.bugId,
            bug.repro || 'N/A',
            '',
            bug.severity,
            bug.priority,
            bug.status
        ]
    };

    cellContents[selectedFormat].forEach((content, i) => {
        if (selectedFormat === 'default' && i === 1) {
            createReproDropdown(row.insertCell(), bug, index);
        } else {
            const isHTML = (selectedFormat === 'default' && i === 2) || 
                           ((selectedFormat === 'format2' || selectedFormat === 'format3') && i === 1);
            setCellContent(row.insertCell(), content, isHTML);
        }
    });
}

function addActionButtons(row, bug, index, selectedFormat) {
    const actionCell = row.insertCell();
    
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = 'action-button';
    copyButton.addEventListener('click', () => copyRow(bug, selectedFormat));
    actionCell.appendChild(copyButton);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'action-button';
    deleteButton.addEventListener('click', () => deleteBug(index));
    actionCell.appendChild(deleteButton);
}

function deleteBug(index) {
    chrome.storage.sync.get({ bugList: [] }, function(result) {
        const updatedBugList = result.bugList.filter((_, i) => i !== index);
        chrome.storage.sync.set({ bugList: updatedBugList }, function() {
            console.log('Bug deleted');
            displayBugs(); // Refresh the displayed bugs after deleting
        });
    });
}