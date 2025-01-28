import { formatDate, showToast } from './uiHelpers.js';
import { baseUrl } from './constants.js';

export function copyRow(bug, format) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = bug.bugId;
    const bugIdLink = tempElement.querySelector('a');
    
    let bugIdText = bugIdLink ? bugIdLink.textContent.trim() : 'N/A';
    let bugIdUrl = bugIdLink ? `${baseUrl}/browse/${bugIdText}` : '';
    
    const hyperlinkFormula = `=HYPERLINK("${bugIdUrl}","${bugIdText}")`;

    const rowData = formatRowData(bug, format, hyperlinkFormula);

    navigator.clipboard.writeText(rowData).then(() => {
        console.log('Row data copied to clipboard');
        showToast('Copied this row');
    }, (err) => {
        console.error('Could not copy text: ', err);
        showToast('Failed to copy row data');
    });
}

export function copyAllBugs() {
    chrome.storage.sync.get({ bugList: [] }, function(result) {
        if (result.bugList.length === 0) {
            showToast('No data to copy');
            return;
        }

        const selectedFormat = document.querySelector('input[name="displayFormat"]:checked').value;

        const bugData = result.bugList.map(bug => {
            const tempElement = document.createElement('div');
            tempElement.innerHTML = bug.bugId;
            const bugIdLink = tempElement.querySelector('a');
            
            let bugIdText = bugIdLink ? bugIdLink.textContent.trim() : 'N/A';
            let bugIdUrl = bugIdLink ? `${baseUrl}/browse/${bugIdText}` : '';
            
            const hyperlinkFormula = `=HYPERLINK("${bugIdUrl}","${bugIdText}")`;

            return formatRowData(bug, selectedFormat, hyperlinkFormula);
        }).join('\n');

        navigator.clipboard.writeText(bugData).then(() => {
            console.log('All bug data copied to clipboard');
            showToast('Copied all to clipboard');
        }, (err) => {
            console.error('Could not copy text: ', err);
            showToast('Failed to copy all bug data');
        });
    });
}

function formatRowData(bug, format, hyperlinkFormula) {
    const formatters = {
        'default': () => [
            formatDate(bug.triageDate),
            bug.repro || 'N/A',
            hyperlinkFormula,
            bug.title,
            bug.status,
            bug.severity,
            bug.priority,
            bug.assignedTo,
            bug.platform
        ],
        'format2': () => [ // Triaging format
            formatDate(bug.triageDate),
            hyperlinkFormula,
            bug.title,
            bug.repro || 'N/A',
            bug.status,
            '',
            bug.priority,
            bug.assignedTo
        ],
        'format3': () => [ // QATestTriage format
            formatDate(bug.triageDate),
            hyperlinkFormula,
            bug.repro || 'N/A',
            '',
            bug.severity,
            bug.priority,
            bug.status
        ]
    };

    return formatters[format]().join('\t');
}
