# Triage Companion v2

A Chrome browser extension designed to streamline the bug triaging process by extracting JIRA bug data and formatting it for easy copying to tracking sheets.

## 📋 Overview

Triage Companion v2 helps triaging teams save time and effort by automating the process of copying bug details from JIRA to tracking sheets. Instead of manually copying and pasting data with different formats across multiple sheets, this extension extracts the data and provides formatted output ready to paste directly into your spreadsheets.

## ✨ Features

- **Data Extraction**: Automatically extracts bug information from JIRA pages
- **Multiple Format Support**: Three different output formats to match various tracking sheet requirements
  - Default format: Comprehensive bug details
  - Format 2 (Triaging): Optimized for triaging workflows
  - Format 3 (QA Test Triage): Tailored for QA testing teams
- **Search Functionality**: Quickly find bugs by Defect ID or title
- **Comment Management**: Store and reuse frequently used comments
- **Copy Functions**: Copy individual rows or all data at once
- **Hyperlink Generation**: Creates Excel-compatible hyperlink formulas for bug IDs

## 🚀 Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/Mohsintl/triage_companion.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the cloned repository folder

5. The extension icon should now appear in your Chrome toolbar

## 💡 Usage

### Extracting Bug Data

1. Navigate to a JIRA bug page (https://jira.sc-corp.net/browse/*)
2. Click on the Triage Companion extension icon
3. Click the "Get Data" button to extract bug information
4. Use the search bar to filter bugs by ID or title
5. Click "Copy" on individual rows or "Copy All" to copy all data

### Managing Comments

1. Click on the "Most Used Comments" tab
2. Enter a new comment in the input field
3. Click "Add Comment" to save it
4. Use "Copy" to copy a comment or "Delete" to remove it

### Format Selection

The extension supports three output formats:

1. **Default Format**: Triage Date | Repro | Bug ID | Title | Status | Severity | Priority | Assigned To | Platform
2. **Format 2 (Triaging)**: Triage Date | Bug ID | Title | Repro | Status | [Empty] | Priority | Assigned To
3. **Format 3 (QA Test)**: Triage Date | Bug ID | Repro | [Empty] | Severity | Priority | Status

## 📁 Project Structure

```
triage_companion/
├── manifest.json          # Chrome extension manifest file
├── popup.html            # Main UI structure
├── popup.js              # Main application logic
├── styles.css            # Styling for the extension
├── commentManager.js     # Comment storage and management
├── constants.js          # Configuration constants
├── copyFunctions.js      # Copy functionality and data formatting
├── dataManipulation.js   # Data processing utilities
├── displayFunctions.js   # UI rendering functions
├── uiHelpers.js         # UI utility functions
└── images/              # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🔧 Technical Details

### Technologies Used

- **JavaScript (72.2%)**: Core functionality
- **CSS (20.7%)**: Styling
- **HTML (7.1%)**: Structure

### Key Components

#### manifest.json
Defines the extension's properties, permissions, and configuration.

#### popup.js
Main entry point that coordinates all modules and handles user interactions.

#### commentManager.js
Manages the storage, addition, deletion, and copying of frequently used comments using Chrome's storage API.

#### copyFunctions.js
Handles the copying of bug data in various formats and generates Excel-compatible hyperlink formulas.

#### displayFunctions.js
Renders the bug table and manages the display of extracted data.

#### uiHelpers.js
Provides utility functions for UI operations like date formatting and toast notifications.

### Permissions

- `activeTab`: Access to the current active tab
- `storage`: Store comments and bug data
- `scripting`: Execute scripts on JIRA pages
- `host_permissions`: Access to `https://jira.sc-corp.net/browse/*`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Mohsin**
- GitHub: [@Mohsintl](https://github.com/Mohsintl)

## 🐛 Known Issues

- The extension currently works only with the specific JIRA instance: `https://jira.sc-corp.net`
- Icon files (icon16.png, icon48.png, icon128.png) need to be added to the `/images` directory

## 📌 Future Enhancements

- Support for multiple JIRA instances
- Customizable output formats
- Export data to CSV/Excel
- Dark mode support
- Keyboard shortcuts

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Mohsintl/triage_companion/issues) on GitHub.

---

**Note**: This extension is designed for internal use with specific JIRA configurations. You may need to modify the `constants.js` file to work with your organization's JIRA instance.