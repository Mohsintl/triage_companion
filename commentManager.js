// Function to load comments from storage
function loadComments() {
    chrome.storage.sync.get({ comments: [] }, function(result) {
        const commentTableBody = document.querySelector('#commentList tbody');
        if (!commentTableBody) {
            console.error('Comment table body not found');
            return;
        }
        
        // Clear existing content
        commentTableBody.innerHTML = '';
        
        result.comments.forEach((comment, index) => {
            const row = commentTableBody.insertRow(-1);
            
            const serialCell = row.insertCell(0);
            serialCell.textContent = index + 1;
            serialCell.className = 'serial-number';
            
            const commentCell = row.insertCell(1);
            commentCell.textContent = comment;
            commentCell.className = 'comment-text';
            commentCell.title = comment; // For tooltip on hover
            
            const actionsCell = row.insertCell(2);
            actionsCell.className = 'comment-actions';
            
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.className = 'action-button copy-comment';
            copyButton.addEventListener('click', () => copyComment(comment));
            actionsCell.appendChild(copyButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'action-button delete-comment';
            deleteButton.addEventListener('click', () => deleteComment(index));
            actionsCell.appendChild(deleteButton);
        });
    });
}

// Function to add a new comment
function addComment() {
    const newCommentInput = document.getElementById('newComment');
    if (!newCommentInput) {
        console.error('New comment input not found');
        return;
    }
    const comment = newCommentInput.value.trim();
    if (comment) {
        chrome.storage.sync.get({ comments: [] }, function(result) {
            const updatedComments = [...result.comments, comment];
            chrome.storage.sync.set({ comments: updatedComments }, function() {
                newCommentInput.value = '';
                loadComments();
                showToast('Comment added successfully');
            });
        });
    }
}

// Function to delete a comment
function deleteComment(index) {
    chrome.storage.sync.get({ comments: [] }, function(result) {
        const updatedComments = result.comments.filter((_, i) => i !== index);
        chrome.storage.sync.set({ comments: updatedComments }, function() {
            loadComments();
            showToast('Comment deleted successfully');
        });
    });
}

// Function to copy a comment
function copyComment(comment) {
    navigator.clipboard.writeText(comment).then(() => {
        showToast('Comment copied to clipboard');
    }, (err) => {
        console.error('Could not copy text: ', err);
        showToast('Failed to copy comment');
    });
}

// Initialize the comment manager
function initCommentManager() {
    const addCommentButton = document.getElementById('addComment');
    if (addCommentButton) {
        addCommentButton.addEventListener('click', addComment);
    } else {
        console.error('Add comment button not found');
    }

    loadComments();
}

// Helper function to show toast notifications
function showToast(message) {
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

// Export the initCommentManager function
export { initCommentManager };