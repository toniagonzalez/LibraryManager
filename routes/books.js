const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

//GET All Books
//SELECT * FROM books;
router.get('/', (req, res)=>{
  Book.findAll({order:[ ['title', 'ASC']] }).then( books => {
    res.render('index', {books});
  })
})

//GET New Book Form
router.get('/new', (req, res)=>{
  res.render('new-book');
})

//GET Edit/Update Form
//SELECT * FROM books WHERE id = (req.params.id)
router.get('/:id', (req, res)=>{
  Book.findByPk(req.params.id).then( (book)=> {
      res.render('update-book', {book});
  })
})

//GET Confirm Add New Book
//SELECT * FROM books WHERE id = (req.params.id)
router.get('/confirm-new/:id', (req, res)=>{
  Book.findByPk(req.params.id).then( (book)=> {
      res.render('confirm-new', {book});
  })
})

//GET Confirm Update Form
//SELECT * FROM books WHERE id = (req.params.id)
router.get('/confirm-update/:id', (req, res)=>{
  Book.findByPk(req.params.id).then( (book)=> {
      res.render('confirm-update', {book});
  })
})

//Get Delete form
router.get('/delete/:id', (req, res)=>{
  Book.findByPk(req.params.id).then( (book)=> {
    res.render('delete', {book});
  })
})


//POST New Book
//INSERT INTO books (title, author, genre, year) VALUES(...)
router.post('/new', (req, res)=>{
  Book.create(req.body).then( (book) => {
    res.redirect('/books/confirm-new/' + book.id);
  })
})


//UPDATE Book
//UPDATE books SET ex:(title=title) WHERE id = (req.params.id)
router.post('/:id', (req, res, next)=>{
  Book.findByPk(req.params.id).then((book)=> {
    return book.update(req.body);
  }).then((book)=> {
      res.redirect('/books/confirm-update/' + book.id);
  })
})


//DELETE Book
//DELETE FROM Books WHERE id= (req.params.id)
router.post('/delete/:id', (req, res, next)=>{
  Book.findByPk(req.params.id).then((book)=> {
      return book.destroy();
  }).then(()=> {
      res.redirect('/books');
  })
})


module.exports = router;
