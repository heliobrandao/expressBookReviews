const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  console.log(req.body);
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users[username] = { password };

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
/***
 *  
 * TASK 1
 * 
 */

// public_users.get('/',function (req, res) {
  
//   if (!books) {
//     return res.status(404).json({ message: "No books found" });
//   }
  
//   return res.status(200).send(JSON.stringify(books, null, 4));  
  
// });

/***
 * TASK 10
 */

const getBooks = () => {
  return new Promise((resolve, reject) => {
      resolve(books);
  });
};

public_users.get('/',async function (req, res) {
try {
  const bookList = await getBooks(); 
  res.json(bookList);
} catch (error) {
  res.status(500).json({ message: "Error resolving book list" });
}
});

/***
 * TASK 11
 */
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;

  try {
    const response = await axios.get('http://localhost:5000/');

    if (response.data[isbn]) {
      return res.status(200).send(JSON.stringify(response.data[isbn], null, 4));
    } 
   
    return res.status(404).send("No book found with the ISBN");
    
  }catch (error) {
    // Handle errors, e.g., network issues or API errors
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

/***
 * TASK 12
 */
public_users.get('/author/:author', async function (req, res) {

  let author = req.params.author;
  let booksByAuthor = [];

  try {
    
    const response = await axios.get('http://localhost:5000/');

    for (let isbn in response.data) {
      if (response.data[isbn].author == author) {
        booksByAuthor.push(response.data[isbn]);
      }
    }

    if (booksByAuthor.length == 0) {
      return res.status(404).send("No book found with the author");
    }
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));

  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

/***
 * TASK 13
 */

public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title;
  let booksByTitle = [];

  try {
    const response = await axios.get('http://localhost:5000/');

    for (let isbn in response.data) {
      if (response.data[isbn].title == title) {
        booksByTitle.push(response.data[isbn]);
      }
    }

    if (booksByTitle.length == 0) {
    return res.status(404).send("No book found with the title");
    } 
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});


// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//     let isbn = req.params.isbn;
//     if(!books[isbn]){
//       return res.status(404).send("No book found with ISBN "+isbn);
//     }
//     return res.status(200).send(JSON.stringify(books[isbn],null,4));

//  });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   let author = req.params.author;
//   let booksByAuthor = [];
//   for(let isbn in books){
//     if(books[isbn].author == author){
//       booksByAuthor.push(books[isbn]);
//     }
//   }
//   if(booksByAuthor.length == 0){
//     return res.status(404).send("No book found with given author");
//   }
//   return res.status(200).send(JSON.stringify(booksByAuthor,null,4));
// });

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
// //   //Write your code here
//   let title = req.params.title;
//   let titles = [];
//   for(let isbn in books){
//     if(books[isbn].title == title){
//       titles.push(books[isbn]);
//     }
//   }
//   if(titles.length == 0){
//     return res.status(404).send("No book found with given title ");
//   }
//   return res.status(200).send(JSON.stringify(titles,null,4));


// });
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(!books[isbn]){
    return res.status(404).send("No book found with given ISBN ");
  }
  return res.status(200).send(JSON.stringify(books[isbn].reviews,null,4));
});

module.exports.general = public_users;
