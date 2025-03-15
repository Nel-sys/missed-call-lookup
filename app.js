const searchForm = document.getElementById("search-form");
const searchNumberInput = document.getElementById("search-number");
const searchResultsDiv = document.getElementById("search-results");
const commentTextArea = document.getElementById("comment-text");
const submitCommentBtn = document.getElementById("submit-comment");
const historyList = document.getElementById("history-list");

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phoneNumber = searchNumberInput.value.trim();
    
    if (phoneNumber) {
        const response = await fetch(`/search-number?phone=${phoneNumber}`);
        const result = await response.json();
        
        if (result.success) {
            displaySearchResults(result.data);
        }
        
        saveSearchHistory(phoneNumber);
    }
});

submitCommentBtn.addEventListener("click", async () => {
    const comment = commentTextArea.value.trim();
    const phoneNumber = searchNumberInput.value.trim();

    if (comment && phoneNumber) {
        const response = await fetch('/submit-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone: phoneNumber, comment: comment })
        });
        
        const result = await response.json();
        if (result.success) {
            alert("Comment submitted!");
            commentTextArea.value = ''; // Clear comment box
        }
    }
});

function displaySearchResults(data) {
    searchResultsDiv.style.display = 'block';
    searchResultsDiv.innerHTML = `
        <p><strong>Phone Number:</strong> ${data.phone}</p>
        <p><strong>Previous Comments:</strong></p>
        <ul>
            ${data.comments.map(comment => `<li>${comment}</li>`).join('')}
        </ul>
    `;
}

function saveSearchHistory(phone) {
    const historyItem = document.createElement("li");
    historyItem.textContent = phone;
    historyList.appendChild(historyItem);
}
