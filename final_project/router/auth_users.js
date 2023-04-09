const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let result = true 
  users.forEach(account => {
    if (account.username === username){
      result =false 
    }
  })

  return result
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let result = false
  users.forEach(user => {
    if (user.username === username&& user.password === password) {
      result =true 
    }
  })
  return result
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let keys = Object.keys(req.body)
  if (!keys.includes("username")||!keys.includes("password") ) {
    return res.status(300).send(JSON.stringify({message: "you need to enter username/password"}));
  }
  let loginInfo = req.body
  const {username, password} = loginInfo
  console.log(req.user)
  if (authenticatedUser(username, password)){
    let accessToken =jwt.sign({
      data:loginInfo
    },"access", { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken
    }
    return res.status(200).send(JSON.stringify({message: "login success"}));
  }else{
    return res.status(300).send(JSON.stringify({message: "login Deny"}));
  } 



});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let bookNum = req.params.isbn
  let newReview = req.query.review
  if (!books[bookNum]) return res.status(300).json({message: `book number ${bookNum} can not be found `});
  books[bookNum].reviews = {newReview}
  
  return res.status(200).send(JSON.stringify(`the book:${bookNum} has been update`));
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let bookNum = req.params.isbn
  if (!books[bookNum]) return res.status(300).json({message: `book number ${bookNum} can not be found `});
  books[bookNum].reviews = {}
  
  return res.status(200).send(JSON.stringify(`the book:${bookNum} has been delete`));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;