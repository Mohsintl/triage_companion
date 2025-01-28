console.log('popup.js is loading');

// Import necessary functions from other modules
import { addInfoIconAndModal, setupRadioButtons, showToast } from './uiHelpers.js';
import { displayBugs } from './displayFunctions.js';
import { copyAllBugs } from './copyFunctions.js';
import { initCommentManager } from './commentManager.js';

// Main Execution
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    try {
        // Select DOM elements
        const triageButton = document.getElementById('triageButton');
        const searchInput = document.getElementById('searchInput');
        const copyAllButton = document.getElementById('copyAllButton');
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');

        console.log('Elements selected:', {
            triageButton,
            searchInput,
            copyAllButton,
            navItems: navItems.length,
            contentSections: contentSections.length
        });

        // Initialize UI components
        addInfoIconAndModal();
        const radioContainer = setupRadioButtons(triageButton);

        // Navigation functionality
        function handleNavigation() {
            const navItems = document.querySelectorAll('.nav-item');
            const contentSections = document.querySelectorAll('.content-section');

            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    // Remove 'active' class from all nav items and content sections
                    navItems.forEach(navItem => navItem.classList.remove('active'));
                    contentSections.forEach(section => section.classList.remove('active'));

                    // Add 'active' class to clicked nav item
                    item.classList.add('active');

                    // Show corresponding content section
                    const targetId = item.getAttribute('data-target');
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        targetSection.classList.add('active');
                    }
                });
            });
        }

        handleNavigation();

        // Event Listeners
        // Search input event listener
        searchInput.addEventListener('input', function() {
            displayBugs(this.value);
        });

        // Copy all button event listener
        copyAllButton.addEventListener('click', function() {
            if (!this.disabled) {
                copyAllBugs();
            }
        });

        // Radio button container event listener
        radioContainer.addEventListener('change', function() {
            displayBugs(searchInput.value);
        });

        // Triage button event listener
        triageButton.addEventListener('click', function() {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                console.log(tabs[0]);  
                const tab = tabs[0];
                if (tab.url.includes("https://jira.sc-corp.net/browse/")) {
                    // Execute script to scrape bug data from Jira page
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        function: scrapeBugData
                    }, handleScrapedData);
                } else {
                    console.log('Not a Jira page.');
                    showToast('Not a valid Jira page');
                }
            });
        });

        // Initialize comment manager
        initCommentManager();

        // Initial display of bugs
        displayBugs();

    } catch (error) {
        console.error('Error in popup.js:', error);
    }
});

// Function to scrape bug data from Jira page
function scrapeBugData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                // Scrape various bug details from the Jira page
                const bugIdElement = document.querySelector('a.issue-link#key-val');
                const bugId = bugIdElement ? bugIdElement.outerHTML : 'N/A';
                const title = document.querySelector('h1#summary-val')?.textContent.trim() || 'N/A';
                const priorityElement = document.querySelector('span#priority-val');
                const priority = priorityElement ? priorityElement.textContent.trim() : 'N/A';
                const severityElement = document.querySelector('div#customfield_12250-val');
                const severity = severityElement ? severityElement.textContent.trim() : 'N/A';
                const assignedToElement = document.querySelector('span.user-hover[id^="issue_summary_assignee_"]');
                let assignedTo = assignedToElement ? assignedToElement.textContent.trim() : 'N/A';

                if (assignedTo === "NA" || assignedTo === "N/A") {
                    assignedTo = "Unassigned";
                }

                const statusElement = document.querySelector('.jira-issue-status-lozenge');
                const status = statusElement ? statusElement.textContent.trim() : 'N/A';
                const platformElement = document.querySelector('#customfield_11221-val .shorten span');
                const platform = platformElement ? platformElement.textContent.trim() : 'N/A';
                const issueTypeElement = document.querySelector('#type-val');
                const issueType = issueTypeElement ? issueTypeElement.textContent.trim() : 'N/A';

                console.log('Scraped data:', { bugId, title, priority, severity, assignedTo, status, platform, issueType });

                resolve({
                    triageDate: new Date().toLocaleDateString(),
                    bugId,
                    title,
                    priority,
                    severity,
                    assignedTo,
                    status,
                    platform,
                    issueType
                });
            } catch (error) {
                console.error('Error scraping bug data:', error);
                resolve(null);
            }
        }, 1000);
    });
}

// Function to handle scraped bug data
function handleScrapedData(result) {
    console.log(result);
    if (result && result[0] && result[0].result) {
        const bugData = result[0].result;
        
        const issueType = bugData.issueType.toLowerCase();

        // Check issue type and status
        if (issueType === 'bug') {
            if (bugData.status.toLowerCase() === 'initial triage') {
                showToast('Triaged bug should not be in Initial Triage');
                return; // Stop further processing for bugs in Initial Triage
            }
        } else if (issueType === 'feedback') {
            // Process Feedback regardless of status
        } else {
            showToast('Issue is neither Bug nor Feedback');
            return; // Stop processing for other issue types
        }

        // Get the existing bugs and check for duplicates
        chrome.storage.sync.get({ bugList: [] }, function (storageResult) {
            const updatedBugList = storageResult.bugList;
            
            // Check if a bug with the same bugId already exists
            const isDuplicate = updatedBugList.some(existingBug => 
                existingBug.bugId === bugData.bugId
            );

            if (isDuplicate) {
                console.log('Issue with this ID already exists.');
                showToast('Issue already exists in the list');
            } else {
                // Add the new issue if it's not a duplicate
                updatedBugList.push(bugData);

                // Save the updated issue list
                chrome.storage.sync.set({ bugList: updatedBugList }, function () {
                    console.log('Issue data saved from Jira:', bugData);
                    showToast('New issue added to the list');
                    // Refresh the displayed issues after saving
                    displayBugs();
                });
            }
        });
    } else {
        console.log('No issue details found or scraping failed.');
        showToast('Failed to scrape issue data');
    }
}

console.log('popup.js finished loading');