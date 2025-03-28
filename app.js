// Initialize Supabase
const { createClient } = supabase;

// Supabase URL and Key (replace with your actual values)
const supabaseUrl = "https://mrshshpjrspcsfjfydnw.supabase.co";
const supabaseKey = "your_supabase_anon_key";
const supabase = createClient(supabaseUrl, supabaseKey);

// Select DOM elements
const searchForm = document.getElementById("search-form");
const searchNumberInput = document.getElementById("search-number");
const searchResultsDiv = document.getElementById("search-results");
const commentTextArea = document.getElementById("comment-text");
const submitCommentBtn = document.getElementById("submit-comment");
const historyList = document.getElementById("history-list");

// Event listener for search form submission
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phoneNumber = searchNumberInput.value.trim();

    if (phoneNumber) {
        // Fetch search results (including similar numbers)
        const { data, error } = await supabase
            .from('phone_comments')
            .select('*')
            .ilike('phone', `%${phoneNumber}%`); // Partial match for similar numbers

        if (error) {
            alert("Error fetching data: " + error.message);
            return;
        }

        if (data.length > 0) {
            displaySearchResults(data);
        } else {
            searchResultsDiv.innerHTML = "<p>No results found.</p>";
            searchResultsDiv.style.display = 'block';
        }

        // Save search history (without requiring login)
        const { error: searchError } = await supabase
            .from('search_history')
            .insert([{ phone: phoneNumber }]);

        if (searchError) {
            console.log("Error saving search history:", searchError.message);
        }
    }
});

// Event listener for comment submission
submitCommentBtn.addEventListener("click", async () => {
    const comment = commentTextArea.value.trim();
    const phoneNumber = searchNumberInput.value.trim();

    if (comment && phoneNumber) {
        const { data, error } = await supabase
            .from('phone_comments')
            .insert([{ phone: phoneNumber, comment: comment }]);

        if (error) {
            alert("Failed to submit comment: " + error.message);
            return;
        }

        alert("Comment submitted!");
        commentTextArea.value = ''; // Clear the comment box
        displaySearchResults([{ phone: phoneNumber, comment: comment }]); // Update UI
    } else {
        alert("Please provide both a comment and a phone number.");
    }
});

// Function to display search results (now includes all similar numbers)
function displaySearchResults(data) {
    searchResultsDiv.style.display = 'block';
    searchResultsDiv.innerHTML = `
        <h3>Search Results</h3>
        ${data.map(item => `
            <div class="result-item">
                <p><strong>Phone:</strong> ${item.phone}</p>
                <p><strong>Comment:</strong> ${item.comment}</p>
            </div>
        `).join('')}
    `;
}

// Function to display search history on page load
async function displaySearchHistory() {
    const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.log("Error fetching search history:", error.message);
        return;
    }

    historyList.innerHTML = data.map(record => `<li>${record.phone}</li>`).join('');
}

// Load previous searches when the page loads
document.addEventListener("DOMContentLoaded", () => {
    displaySearchHistory();
});
