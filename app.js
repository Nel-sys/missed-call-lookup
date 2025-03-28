// Supabase client setup
const supabaseUrl = 'https://mrshshpjrspcsfjfydnw.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc2hzaHBqcnNwY3NmamZ5ZG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTEyMTMsImV4cCI6MjA1NzcyNzIxM30.207BZGQvM9MJdQTPxfOAxYLYAHM5pKMaZ36WnBwGQR8'; // Replace with your Supabase anon key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Function to fetch comments based on phone number
async function fetchComments(phoneNumber) {
  const { data, error } = await supabase
    .from('phone_comments')
    .select('comment')
    .eq('phone_number', phoneNumber);  // Fetch comments for the specific phone number
  
  if (error) {
    console.error('Error fetching comments:', error);
    return;
  }

  const commentsContainer = document.getElementById('commentsContainer');
  commentsContainer.innerHTML = ''; // Clear existing comments

  if (data && data.length > 0) {
    data.forEach(comment => {
      const commentElement = document.createElement('p');
      commentElement.textContent = comment.comment;
      commentsContainer.appendChild(commentElement);
    });
  } else {
    commentsContainer.textContent = 'No comments found for this number.';
  }
}

// Handle the search button click
document.getElementById('searchButton').addEventListener('click', () => {
  const phoneNumber = document.getElementById('phoneNumber').value;
  if (phoneNumber) {
    fetchComments(phoneNumber);
  }
});

// Function to submit a new comment
async function submitComment(phoneNumber, userComment) {
  const { data, error } = await supabase
    .from('phone_comments')
    .insert([
      { phone_number: phoneNumber, comment: userComment }
    ]);
  
  if (error) {
    console.error('Error inserting comment:', error);
  } else {
    console.log('Comment inserted successfully:', data);
    fetchComments(phoneNumber);  // Reload the comments after insertion
  }
}

// Handle the submit comment button click
document.getElementById('submitComment').addEventListener('click', () => {
  const phoneNumber = document.getElementById('phoneNumber').value;
  const userComment = document.getElementById('userComment').value;

  if (phoneNumber && userComment) {
    submitComment(phoneNumber, userComment);
  } else {
    alert('Please enter both a phone number and a comment.');
  }
});
