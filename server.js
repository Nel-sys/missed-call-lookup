const express = require('express');
const app = express();
const cors = require('cors');

// Use CORS middleware
app.use(cors());

// Sample route for searching missed calls
app.get('/lookup/:phoneNumber', (req, res) => {
  const phoneNumber = req.params.phoneNumber;

  // Here you can implement the logic to look up the number in your database or third-party service
  // This is just a mock response
  const numberDetails = {
    phoneNumber: phoneNumber,
    comments: ["Potential scam", "Spam call"],
    carrier: "XYZ Telecom",
    location: "Unknown",
  };

  res.status(200).json(numberDetails);
});

// Post route to leave a comment on a phone number
app.post('/lookup/:phoneNumber/comment', express.json(), (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const comment = req.body.comment;

  // Here, you would save the comment to your database or similar
  // Mock response:
  const response = {
    phoneNumber: phoneNumber,
    newComment: comment,
    status: 'Comment added successfully'
  };

  res.status(201).json(response);
});

// Default route for health check (needed for cloud functions)
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Expose the express app as a Cloud Function
exports.app = require('firebase-functions').https.onRequest(app);
