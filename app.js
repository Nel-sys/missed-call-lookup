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

// Check if the user is logged in and get user details
let userId = null;
supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
        userId = session.user.id; // Store the user ID for submitting comments
    } else {
        alert('You need to log in to submit comments');
    }
});

// Handle login and sign-up
const loginUser = async (email, password) => {
    const { user, error } = await supabase.auth.signIn({
        email: email,
        password: password
    });
    if (error) {
        console.error('Login error:', error.message);
    }
    return user;
};

// Handle search form submission
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phoneNumber = searchNumberInput.value.trim();

    if (phoneNumber) {
        const { data, error } = await supabase
            .from('phone_comments')
            .select('phone, comment')
            .eq('phone', phoneNumber);

        if (error) {
            console.error('Error fetching comments:', error.message);
        } else {
            displaySearchResults({ phone: phoneNumber, comments: data.map(d => d.comment) });
        }

        saveSearchHistory(phoneNumber);
    }
});

// Handle comment submission
submitCommentBtn.addEventListener("click", async () => {
    const comment = commentTextArea.value.trim();
    const phoneNumber = searchNumberInput.value.trim();

    if (comment && phoneNumber && userId) {
        const { data, error } = await supabase
            .from('phone_comments')
            .insert([{ phone: phoneNumber, comment: comment, user_id: userId }]);

        if (error) {
            console.error('Error submitting comment:', error.message);
        } else {
            alert("Comment submitted!");
            commentTextArea.value = ''; // Clear comment box
        }
    } else {
        alert('Please log in to submit a comment.');
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

// Save search history (just appends to a list in UI)
function saveSearchHistory(phone) {
    const historyItem = document.createElement("li");
    historyItem.textContent = phone;
    historyList.appendChild(historyItem);
}
