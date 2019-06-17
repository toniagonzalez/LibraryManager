const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('../models').Sequelize;
const Op = Sequelize.Op;

//GET All Books
//SELECT * FROM books;
router.get('/', (req, res, next)=>{
  Book.findAll({order:[ ['title', 'ASC']] }).then( books => {
    res.render('index', {books});
  }).catch((err)=>{
    next(err);
  })
})

//GET Search Results
//SELECT * FROM books WHERE author OR title OR genre LIKE %req.body%;
router.get('/search/?q', (req, res, next)=>{
  Book.findAll({
          where: {
            [Op.or]: [
              {
                title: {
                  [Op.like]: req.body
                },
                author: {
                  [Op.like]: req.body
                },
                genre: {
                  [Op.like]: req.body
                }
              }
           ]
         },
         order:[ ['title', 'ASC']]
        }).then( books => {
          if (books){
            res.render('index', {books});
          } else {
            next();
          }
  }).catch((err)=>{
    next(err);
  })
})

//GET New Book Form
router.get('/new', (req, res)=>{
  res.render('new-book');
})

//GET Edit/Update Form
//SELECT * FROM books WHERE id = (req.params.id)
router.get('/:id', (req, res, next)=>{
  Book.findByPk(req.params.id).then( (book)=> {
    if (book){
      res.render('update-book', {book});
    } else {
      next();

    }
  }).catch((err)=>{
    next(err);
  })
})

//GET Confirm Add New Book
//SELECT * FROM books WHERE id = (req.params.id)
router.get('/confirm-new/:id', (req, res, next)=>{
  Book.findByPk(req.params.id).then( (book)=> {
    if (book){
      res.render('confirm-new', {book});
    } else {
      next();
    }
  }).catch((err)=>{
    next(err)
  })
})

//GET Confirm Update Form
//SELECT * FROM books WHERE id = (req.params.id)
router.get('/confirm-update/:id', (req, res, next)=>{
  Book.findByPk(req.params.id).then( (book)=> {
    if (book){
      res.render('confirm-update', {book});
    } else {
      next();
    }
  }).catch((err)=>{
    next(err);
  })
})

//Get Delete form
router.get('/delete/:id', (req, res)=>{
  Book.findByPk(req.params.id).then( (book)=> {
    if (book){
      res.render('delete', {book});
    } else {
      next();
    }
  }).catch((err)=>{
    next(err);
  })
})


//POST New Book
//INSERT INTO books (title, author, genre, year) VALUES(...)
router.post('/new', (req, res, next)=>{
  Book.create(req.body).then( (book) => {
    if(book){
      res.redirect('/books/confirm-new/' + book.id);
    } else {
      next();
    }
  }).catch((err)=>{
    if(err.name=== "SequelizeValidationError"){
      const book = Book.build(req.body);
      book.id = req.params.id;
      
      res.render('new-book', {
        book: book,
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch((err)=>{
    next(err);
  })
})


//UPDATE Book
//UPDATE books SET ex:(title=title) WHERE id = (req.params.id)
router.post('/:id', (req, res, next)=>{
  Book.findByPk(req.params.id).then((book)=> {
    if(book){
      return book.update(req.body);
    } else {
      next();
    }
  }).then((book)=> {
      res.redirect('/books/confirm-update/' + book.id);
  }).catch((err)=>{
    if(err.name=== "SequelizeValidationError"){
      const book = Book.build(req.body);
      book.id = req.params.id;

      res.render('update-book', {
        book: book,
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch((err)=>{
    next(err);
  })
})


//DELETE Book
//DELETE FROM Books WHERE id= (req.params.id)
router.post('/delete/:id', (req, res, next)=>{
  Book.findByPk(req.params.id).then((book)=> {
      return book.destroy();
  }).then(()=> {
      res.redirect('/books');
  }).catch((err)=>{
    next(err);
  })
})


module.exports = router;
