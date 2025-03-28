// Initialize Supabase client
const supabase = createClient('https://mrshshpjrspcsfjfydnw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc2hzaHBqcnNwY3NmamZ5ZG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTEyMTMsImV4cCI6MjA1NzcyNzIxM30.207BZGQvM9MJdQTPxfOAxYLYAHM5pKMaZ36WnBwGQR8');

// Function to get comments for the phone number
const getCommentsForPhoneNumber = async (phoneNumber) => {
  const { data, error } = await supabase
    .from('phone_comments')
    .select('*')
    .eq('phone_number', phoneNumber); // Look for this exact number in the database

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};

// Function to handle search form submission
const handleSearch = async (event) => {
  event.preventDefault();
  
  const phoneNumber = document.getElementById('phoneSearch').value;
  
  if (!phoneNumber) {
    alert('Please enter a phone number');
    return;
  }

  // Fetch comments from Supabase
  const comments = await getCommentsForPhoneNumber(phoneNumber);
  displayComments(comments);
};

// Function to handle comment submission
const handleCommentSubmission = async (event) => {
  event.preventDefault();

  const phoneNumber = document.getElementById('phoneSearch').value;
  const comment = document.getElementById('comment').value;

  if (!comment) {
    alert('Please enter a comment');
    return;
  }

  // Insert the comment into Supabase
  const { data, error } = await supabase
    .from('phone_comments')
    .insert([
      { phone_number: phoneNumber, comment: comment }
    ]);

  if (error) {
    console.error(error);
  } else {
    alert('Comment added successfully!');
    document.getElementById('comment').value = ''; // Clear the comment field
    displayComments(await getCommentsForPhoneNumber(phoneNumber)); // Refresh the comments list
  }
};

// Function to display comments
const displayComments = (comments) => {
  const commentsContainer = document.getElementById('commentsContainer');
  commentsContainer.innerHTML = ''; // Clear the existing comments
  
  if (comments.length === 0) {
    commentsContainer.innerHTML = 'No comments found for this number.';
  } else {
    comments.forEach((comment) => {
      const commentElement = document.createElement('div');
      commentElement.textContent = `${comment.created_at}: ${comment.comment}`;
      commentsContainer.appendChild(commentElement);
    });
  }
};

// Add event listeners
document.getElementById('searchForm').addEventListener('submit', handleSearch);
document.getElementById('commentForm').addEventListener('submit', handleCommentSubmission);
