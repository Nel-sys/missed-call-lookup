// Supabase client setup
const supabaseUrl = 'https://mrshshpjrspcsfjfydnw.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc2hzaHBqcnNwY3NmamZ5ZG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTEyMTMsImV4cCI6MjA1NzcyNzIxM30.207BZGQvM9MJdQTPxfOAxYLYAHM5pKMaZ36WnBwGQR8'; // Replace with your Supabase anon key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Function to search for phone number comments
async function searchPhoneNumber() {
  const phoneNumber = document.getElementById('searchPhone').value.trim();
  if (phoneNumber === "") {
    alert("Please enter a phone number to search.");
    return;
  }

  // Query the Supabase table to get comments for the phone number
  const { data, error } = await supabase
    .from('phone_comments')
    .select('*')
    .eq('phone_number', phoneNumber);

  if (error) {
    console.error("Error fetching comments:", error.message);
    return;
  }

  const searchResultsDiv = document.getElementById('searchResults');
  searchResultsDiv.innerHTML = ''; // Clear previous results

  if (data.length === 0) {
    searchResultsDiv.innerHTML = `<p>No comments found for this phone number.</p>`;
  } else {
    const commentList = document.createElement('ul');
    data.forEach(comment => {
      const listItem = document.createElement('li');
      listItem.textContent = comment.comment;
      commentList.appendChild(listItem);
    });
    searchResultsDiv.appendChild(commentList);
    // Show the comment section to submit a new comment
    document.getElementById('commentSection').style.display = 'block';
  }
}

// Function to submit a comment
async function submitComment() {
  const phoneNumber = document.getElementById('searchPhone').value.trim();
  const userComment = document.getElementById('userComment').value.trim();

  if (phoneNumber === "" || userComment === "") {
    alert("Please enter both a phone number and a comment.");
    return;
  }

  // Insert the comment into the database
  const { data, error } = await supabase
    .from('phone_comments')
    .insert([
      { phone_number: phoneNumber, comment: userComment }
    ]);

  if (error) {
    console.error("Error submitting comment:", error.message);
    return;
  }

  // Show success message and reset the input fields
  alert("Comment submitted successfully!");
  document.getElementById('userComment').value = '';
  searchPhoneNumber();  // Refresh the comments after submission
}
