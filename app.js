// Initialize Supabase with your project URL and API key
const supabaseUrl = "https://mrshshpjrspcsfjfydnw.supabase.co"; // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc2hzaHBqcnNwY3NmamZ5ZG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTEyMTMsImV4cCI6MjA1NzcyNzIxM30.207BZGQvM9MJdQTPxfOAxYLYAHM5pKMaZ36WnBwGQR8"; // Replace with your Supabase anonymous API key
const supabase = createClient(supabaseUrl, supabaseKey);

// Select elements from the DOM
const searchForm = document.getElementById("search-form");
const searchNumberInput = document.getElementById("search-number");
const searchResultsDiv = document.getElementById("search-results");
const commentTextArea = document.getElementById("comment-text");
const submitCommentBtn = document.getElementById("submit-comment");
const historyList = document.getElementById("history-list");

// Function to load search history from Supabase
async function loadSearchHistory() {
    const { data, error } = await supabase
        .from('search_history')
        .select('phone')
        .order('timestamp', { ascending: false }) // Display most recent searches first
        .limit(10); // Limit the number of history items

    if (error) {
        console.error("Error loading search history:", error.message);
        return;
    }

    historyList.innerHTML = ''; // Clear current history
    data.forEach(item => {
        const historyItem = document.createElement('li');
        historyItem.textContent = item.phone;
        historyItem.addEventListener('click', () => {
            displaySearchResults(item.phone);
        });
        historyList.appendChild(historyItem);
    });
}

// Load search history on page load
loadSearchHistory();

// Event listener for search form submission
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phoneNumber = searchNumberInput.value.trim();
    
    if (phoneNumber) {
        // Fetch search results from Supabase
        const { data, error } = await supabase
            .from('phone_comments')
            .select('*')
            .eq('phone', phoneNumber);

        if (error) {
            alert("Error fetching data: " + error.message);
            return;
        }

        if (data.length > 0) {
            displaySearchResults(data[0]); // Show first result (or modify as needed)
        } else {
            alert("No results found.");
        }

        // Save the search to the history in Supabase
        await saveSearchHistory(phoneNumber);
    }
});

// Event listener for comment submission
submitCommentBtn.addEventListener("click", async () => {
    const comment = commentTextArea.value.trim();
    const phoneNumber = searchNumberInput.value.trim();

    if (comment && phoneNumber) {
        // Assuming you're using Supabase or similar for authentication
        const user = await supabase.auth.getUser(); // Get authenticated user
        const userId = user.data.id; // Get user ID, make sure the user is authenticated

        if (!userId) {
            alert("You must be logged in to submit a comment.");
            return;
        }

        // Submit the comment to Supabase
        const { data, error } = await supabase
            .from('phone_comments')
            .insert([{
                phone: phoneNumber,
                comment: comment,
                user_id: userId
            }]);

        if (error) {
            alert("Failed to submit comment: " + error.message);
            return;
        }

        alert("Comment submitted!");
        commentTextArea.value = ''; // Clear the comment box

        // After submitting, update the history to show new comment
        const updatedData = await supabase
            .from('phone_comments')
            .select('*')
            .eq('phone', phoneNumber);
        displaySearchResults(updatedData[0]); // Refresh the display with the new comment
    } else {
        alert("Please provide both a comment and a phone number.");
    }
});

// Function to display search results
function displaySearchResults(phone) {
    // Fetch the results from Supabase
    supabase
        .from('phone_comments')
        .select('*')
        .eq('phone', phone)
        .then(({ data, error }) => {
            if (error) {
                console.error("Error fetching phone comments:", error.message);
                return;
            }

            searchResultsDiv.style.display = 'block';
            searchResultsDiv.innerHTML = `
                <p><strong>Phone Number:</strong> ${phone}</p>
                <p><strong>Previous Comments:</strong></p>
                <ul>
                    ${data.map(comment => `<li>${comment.comment}</li>`).join('')}
                </ul>
            `;
        });
}

// Function to save the search to the history in Supabase
async function saveSearchHistory(phone) {
    const { error } = await supabase
        .from('search_history')
        .upsert([{ phone }]); // Use upsert to add or update the phone number in the history

    if (error) {
        console.error("Error saving search history:", error.message);
    }

    // Reload the search history list
    loadSearchHistory();
}
