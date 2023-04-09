const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username
  let password = req.body.password
  let checkName = isValid(username)
  if (!checkName)  return res.status(300).send(JSON.stringify("username has be register"))

  if (username&& password){
    let account = {username, password}
    users.push(account)
    return res.status(300).send(JSON.stringify({message: "registered success"}))
  } else {
    return res.status(300).send(JSON.stringify("username/password need to be provide"))
  }


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let bookNum = req.params.isbn
  let theBookDetail = books[bookNum]
  //Write your code here
  return res.status(200).json(theBookDetail);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let authName = req.params.author
  let keyPool = Object.keys(books)
  let result = []
  keyPool.forEach(key => {
    if (books[key].author === authName){
      result.push({
        isbn: key,
        title:books[key].title,
        review:books[key].reviews

      })
    }
  })
  
  if(result.length > 0){
    return res.status(200).json({booksbyauther:result})
  }else {
    return res.status(300).json({message:"Author name can not be find"})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let theTitle = req.params.title
  let keyPool = Object.keys(books)
  let result = []
  keyPool.forEach(key => {
    if (books[key].title === theTitle){
      result.push({
        isbn: key,
        author:books[key].author,
        review:books[key].reviews

      })
    }
  })
  if(result.length > 0){
    return res.status(200).json({booksbytitle:result})
  }else {
    return res.status(300).json({message:"Title name can not be find"})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let bookNum = req.params.isbn
  return res.status(200).json(books[bookNum].reviews);
});

module.exports.general = public_users;
