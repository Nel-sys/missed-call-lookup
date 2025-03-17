// Initialize Supabase
const { createClient } = supabase;

// Supabase URL and Key (you can find this in your Supabase project settings)
const supabaseUrl = "https://mrshshpjrspcsfjfydnw.supabase.co";  // Replace with your Supabase URL
const supabaseKey = "your_supabase_anon_key";  // Replace with your Supabase Anon Key
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
            displaySearchResults(data);
        } else {
            alert("No results found.");
        }

        // Save search history to the database (no user_id needed)
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
            .insert([{
                phone: phoneNumber,
                comment: comment
            }]);

        if (error) {
            alert("Failed to submit comment: " + error.message);
            return;
        }

        alert("Comment submitted!");
        commentTextArea.value = ''; // Clear the comment box
    } else {
        alert("Please provide both a comment and a phone number.");
    }
});

// Function to display search results
function displaySearchResults(data) {
    searchResultsDiv.style.display = 'block';
    searchResultsDiv.innerHTML = `
        <p><strong>Phone Number:</strong> ${data[0].phone}</p>
        <p><strong>Previous Comments:</strong></p>
        <ul>
            ${data.map(item => `<li>${item.comment}</li>`).join('')}
        </ul>
    `;
}

// Function to display search history (all users)
async function displaySearchHistory() {
    const { data, error } = await supabase.from('search_history').select('*');
    if (error) {
        console.log("Error fetching search history:", error.message);
        return;
    }

    historyList.innerHTML = '';
    data.forEach(record => {
        const listItem = document.createElement('li');
        listItem.textContent = `Phone Number: ${record.phone}`;
        historyList.appendChild(listItem);
    });
}

displaySearchHistory();
