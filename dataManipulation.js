export function updateRepro(index, value) {
    chrome.storage.sync.get({ bugList: [] }, function(result) {
        const updatedBugList = result.bugList.map((bug, i) => {
            if (i === index) {
                return { ...bug, repro: value };
            }
            return bug;
        });
        chrome.storage.sync.set({ bugList: updatedBugList }, function() {
            console.log('Repro updated');
        });
    });
}