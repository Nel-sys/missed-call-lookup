// Initialize Supabase
const { createClient } = supabase;

// Supabase URL and Key (you can find this in your Supabase project settings)
const supabaseUrl = "https://mrshshpjrspcsfjfydnw.supabase.co";  // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc2hzaHBqcnNwY3NmamZ5ZG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTEyMTMsImV4cCI6MjA1NzcyNzIxM30.207BZGQvM9MJdQTPxfOAxYLYAHM5pKMaZ36WnBwGQR8";  // Replace with your Supabase Anon Key
const supabase = createClient(supabaseUrl, supabaseKey);

// Select DOM elements
const searchForm = document.getElementById("search-form");
const searchNumberInput = document.getElementById("search-number");
const searchResultsDiv = document.getElementById("search-results");
const resultPhone = document.getElementById("result-phone");
const resultComments = document.getElementById("result-comments");
const commentTextArea = document.getElementById("comment-text");
const submitCommentBtn = document.getElementById("submit-comment");
const historyList = document.getElementById("history-list");

// Event listener for search form submission
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phoneNumber = searchNumberInput.value.trim();
    
    if (phoneNumber) {
        // Fetch search results from Supabase (matches the exact phone number)
        const { data, error } = await supabase
            .from('phone_comments')
            .select('*')
            .eq('phone', phoneNumber);  // Exact match (without `%`)

        if (error) {
            alert("Error fetching data: " + error.message);
            return;
        }

        if (data.length > 0) {
            displaySearchResults(data);
        } else {
            alert("No results found.");
        }

        // Save search history to the database
        const user = await supabase.auth.getUser();
        if (user) {
            const { error: historyError } = await supabase
                .from('search_history')
                .insert([{ phone: phoneNumber, user_id: user.data.id }]);
            
            if (historyError) {
                console.log("Error saving search history:", historyError.message);
            }
        }
    }
});

// Event listener for comment submission
submitCommentBtn.addEventListener("click", async () => {
    const comment = commentTextArea.value.trim();
    const phoneNumber = searchNumberInput.value.trim();

    if (comment && phoneNumber) {
        const user = await supabase.auth.getUser();
        const userId = user.data.id;

        if (!userId) {
            alert("You must be logged in to submit a comment.");
            return;
        }

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
        displaySearchResults(data);  // Refresh the search results with the new comment
    } else {
        alert("Please provide both a comment and a phone number.");
    }
});

// Function to display search results
function displaySearchResults(data) {
    searchResultsDiv.style.display = 'block';
    resultPhone.textContent = data[0].phone;
    resultComments.innerHTML = data.map(comment => `<li>${comment.comment}</li>`).join('');
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

// Call displaySearchHistory on page load to show past searches
displaySearchHistory();
