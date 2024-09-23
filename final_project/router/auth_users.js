const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    "username": "usr",
    "password": "passwd"
},
{
    "username": "user1",
    "password": "pwd1"
},
{
    "username": "user2",
    "password": "pwd2"
}
];

const isValid = (username) => { //returns boolean
  // Check if the username is a non-empty string
  return typeof username === 'string' && username.trim().length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
          { data: password },
          'access',
          { expiresIn: 60 * 60 }
      );

      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).json({message: "User logged in successfully", token: accessToken});;
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;

  if(books[isbn]){
    if(books[isbn].reviews[username]){
      books[isbn].reviews[username] = [review];
      return res.status(200).json({ message: "Review modified successfully" });
    }
    else{
      books[isbn].reviews[username] = [review];
      return res.status(200).json({ message: "Review added successfully" });
    }
  }
  else{
    return res.status(404).json({message: "No book found with this ISBN"});
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  if(books[isbn]){
    if(books[isbn].reviews[username]){
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    }
    else{
      return res.status(404).json({message: "No review found for this ISBN"});
    }
  }
  else{
    return res.status(404).json({message: "No book found with this ISBN"});
  }
})
 
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
