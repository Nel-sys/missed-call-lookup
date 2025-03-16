// Initialize Supabase client
const supabaseUrl = 'https://mrshshpjrspcsfjfydnw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc2hzaHBqcnNwY3NmamZ5ZG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTEyMTMsImV4cCI6MjA1NzcyNzIxM30.207BZGQvM9MJdQTPxfOAxYLYAHM5pKMaZ36WnBwGQR8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const searchForm = document.getElementById("search-form");
const searchNumberInput = document.getElementById("search-number");
const searchResultsDiv = document.getElementById("search-results");
const commentTextArea = document.getElementById("comment-text");
const submitCommentBtn = document.getElementById("submit-comment");
const historyList = document.getElementById("history-list");

// Check if the user is logged in
let userId = null;
supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
        userId = session.user.id; // Store the user ID
    } else {
        alert('You need to log in to submit comments');
    }
});

// Handle search form submission
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

// Handle comment submission
submitCommentBtn.addEventListener("click", async () => {
    const comment = commentTextArea.value.trim();
    const phoneNumber = searchNumberInput.value.trim();

    if (comment && phoneNumber && userId) {
        const response = await fetch('/submit-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: phoneNumber,
                comment: comment,
                user_id: userId  // Use authenticated user ID
            })
        });

        const result = await response.json();
        if (result.success) {
            alert("Comment submitted!");
            commentTextArea.value = ''; // Clear comment box
        }
    }
});

// Display search results
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

// Save search history
function saveSearchHistory(phone) {
    const historyItem = document.createElement("li");
    historyItem.textContent = phone;
    historyList.appendChild(historyItem);
}
