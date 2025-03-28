// Initialize Supabase
const { createClient } = supabase;
const supabase = createClient('https://mrshshpjrspcsfjfydnw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc2hzaHBqcnNwY3NmamZ5ZG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTEyMTMsImV4cCI6MjA1NzcyNzIxM30.207BZGQvM9MJdQTPxfOAxYLYAHM5pKMaZ36WnBwGQR8');

// Select form elements
const phoneInput = document.querySelector("#phoneInput");
const commentInput = document.querySelector("#commentInput");
const commentsDisplay = document.querySelector("#commentsDisplay");
const submitCommentButton = document.querySelector("#submitComment");

// Function to fetch existing comments for a phone number
async function fetchComments(phoneNumber) {
  // Fetch comments from Supabase
  const { data, error } = await supabase
    .from('phone_comments') // Table to select from
    .select('*')  // Select all columns
    .eq('phone_number', phoneNumber);  // Filter by phone number

  if (error) {
    console.error("Error fetching comments: ", error);
    return;
  }

  // Display the fetched comments
  commentsDisplay.innerHTML = data.map((comment) => {
    return `<p>${comment.comment} (Posted on: ${comment.created_at})</p>`;
  }).join('');
}

// Function to submit a new comment for a phone number
async function submitComment(event) {
  event.preventDefault();  // Prevent default form submission behavior

  const phoneNumber = phoneInput.value;  // Get phone number from input
  const userComment = commentInput.value;  // Get comment from input

  // Insert the comment into the 'phone_comments' table in Supabase
  const { data, error } = await supabase
    .from('phone_comments')  // Specify the table
    .insert([  // Insert a new comment row
      { 
        phone_number: phoneNumber,  // Use the phone number entered
        comment: userComment  // Use the comment entered
      }
    ]);

  if (error) {
    console.error("Error inserting comment: ", error);
    return;
  }

  // After inserting the comment, fetch and display updated comments
  fetchComments(phoneNumber);
}

// Event listener to submit the comment
submitCommentButton.addEventListener("click", submitComment);

// Event listener to fetch comments when the phone number input field loses focus
phoneInput.addEventListener("blur", () => {
  const phoneNumber = phoneInput.value;  // Get the phone number
  fetchComments(phoneNumber);  // Fetch and display comments for the entered phone number
});
