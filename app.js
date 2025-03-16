// Initialize Supabase
const supabase = supabase.createClient('https://mrshshpjrspcsfjfydnw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc2hzaHBqcnNwY3NmamZ5ZG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTEyMTMsImV4cCI6MjA1NzcyNzIxM30.207BZGQvM9MJdQTPxfOAxYLYAHM5pKMaZ36WnBwGQR8');

const searchForm = document.getElementById("search-form");
const searchNumberInput = document.getElementById("search-number");
const searchResultsDiv = document.getElementById("search-results");
const commentTextArea = document.getElementById("comment-text");
const submitCommentBtn = document.getElementById("submit-comment");
const historyList = document.getElementById("history-list");

// Handle search form submission
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phoneNumber = searchNumberInput.value.trim();
    
    if (phoneNumber) {
        // Fetch number details (for now, we'll mock this)
        const result = await fetchPhoneNumberDetails(phoneNumber);

        if (result.success) {
            displaySearchResults(result.data);
        }

        // Save the search history
        saveSearchHistory(phoneNumber);
    }
});

// Handle comment submission
submitCommentBtn.addEventListener("click", async () => {
    const comment = commentTextArea.value.trim();
    const phoneNumber = searchNumberInput.value.trim();

    if (comment && phoneNumber) {
        // Insert the comment into Supabase
        const { data, error } = await supabase
            .from('phone_comments') // Your table name
            .insert([
                { phone_number: phoneNumber, comment: comment }
            ]);

        if (error) {
            console.error("Error submitting comment:", error);
            alert("There was an error submitting your comment.");
        } else {
            alert("Comment submitted successfully!");
            commentTextArea.value = ''; // Clear the comment box
        }
    }
});

// Fetch phone number details (mocking a response)
async function fetchPhoneNumberDetails(phoneNumber) {
    // Here you would fetch details from an API or database.
    // For now, we are simulating the response:
    return {
        success: true,
        data: {
            phone: phoneNumber,
            comments: []
        }
    };
}

// Display search results (phone number and comments)
async function displaySearchResults(data) {
    searchResultsDiv.style.display = 'block';
    searchResultsDiv.innerHTML = `
        <p><strong>Phone Number:</strong> ${data.phone}</p>
        <p><strong>Previous Comments:</strong></p>
        <ul id="comments-list"></ul>
    `;

    // Fetch the comments for this phone number from Supabase
    const { data: comments, error } = await supabase
        .from('phone_comments') // Your table name
        .select('*')
        .eq('phone_number', data.phone); // Filter by the phone number

    if (error) {
        console.error("Error fetching comments:", error);
    } else {
        const commentsList = document.getElementById("comments-list");
        commentsList.innerHTML = comments.map(comment => `<li>${comment.comment}</li>`).join('');
    }
}

// Save phone number to search history (display in history list)
function saveSearchHistory(phone) {
    const historyItem = document.createElement("li");
    historyItem.textContent = phone;
    historyList.appendChild(historyItem);
}
