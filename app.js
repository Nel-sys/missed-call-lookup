// Initialize Supabase
const supabaseUrl = 'https://mrshshpjrspcsfjfydnw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc2hzaHBqcnNwY3NmamZ5ZG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTEyMTMsImV4cCI6MjA1NzcyNzIxM30.207BZGQvM9MJdQTPxfOAxYLYAHM5pKMaZ36WnBwGQR8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Elements
const phoneCommentForm = document.querySelector('#phoneCommentForm');
const phoneCommentInput = document.querySelector('#phoneComment');
const commentsContainer = document.querySelector('#commentsList');
const searchPhoneInput = document.querySelector('#searchPhone');
const searchButton = document.querySelector('#searchButton');

// Submit comment function
phoneCommentForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const phoneComment = phoneCommentInput.value;
  const [phoneNumber, comment] = phoneComment.split(':');

  if (!phoneNumber || !comment) {
    alert('Please enter both a phone number and a comment in the format "PhoneNumber: Comment".');
    return;
  }

  // Insert comment into Supabase
  const { data, error } = await supabase
    .from('phone_comments')
    .insert([{ phone: phoneNumber.trim(), comment: comment.trim() }]);

  if (error) {
    console.error('Error inserting comment:', error.message);
    alert('There was an error submitting your comment.');
  } else {
    console.log('Comment added successfully!', data);
    alert('Your comment has been added!');
    phoneCommentInput.value = '';  // Clear the input after submission
  }
});

// Search function to find comments by phone number
searchButton.addEventListener('click', async () => {
  const phoneNumberToSearch = searchPhoneInput.value.trim();

  if (!phoneNumberToSearch) {
    alert('Please enter a phone number to search for comments.');
    return;
  }

  // Fetch comments for the searched phone number from Supabase
  const { data, error } = await supabase
    .from('phone_comments')
    .select('*')
    .eq('phone', phoneNumberToSearch);

  if (error) {
    console.error('Error fetching comments:', error.message);
    alert('There was an error fetching the comments.');
    return;
  }

  // Clear previous results
  commentsContainer.innerHTML = '';

  if (data.length === 0) {
    commentsContainer.innerHTML = `<p>No comments found for ${phoneNumberToSearch}.</p>`;
  } else {
    const commentsList = document.createElement('ul');
    data.forEach(comment => {
      const commentItem = document.createElement('li');
      commentItem.textContent = comment.comment;
      commentsList.appendChild(commentItem);
    });
    commentsContainer.appendChild(commentsList);
  }
});
