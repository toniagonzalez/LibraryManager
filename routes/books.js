const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('../models').Sequelize;
const Op = Sequelize.Op;


//GET All Books by page
//SELECT * FROM books ORDER BY title ASC LIMIT 10 OFFSET (req.params.page -1)*10;
router.get('/', (req, res, next)=>{
  if (!req.query.page){
    res.redirect('/books?page=1');
  }
  let offset = (req.query.page -1) * 10;
  let limit = 10;
  let page = req.query.page;
  let pages;
  Book.findAndCountAll({
        limit: limit,
        offset: offset,
        order:[ ['title', 'ASC']]
    })
  .then( ({count, rows}) => {
    let pages = Math.ceil(count/limit);
      res.render('index', {books:rows, pages, page});
  })
  .catch((err)=>{
    next(err);
  })
})

//GET Search Results
//SELECT * FROM books WHERE author OR title OR genre OR year LIKE %req.query.q%;
router.get('/search', (req, res, next)=>{
  let search = req.query.q;
  Book.findAll({
      order:[ ['title', 'ASC']],
      where: {
        [Op.or]: [
          {
            'title': {
              [Op.substring]: req.query.q
            }
          },
          {
            'author': {
              [Op.substring]: req.query.q
            }
          },
          {
            'genre': {
              [Op.substring]: req.query.q
            }
          },
          {
            'year': {
              [Op.substring]: parseInt(req.query.q)
            }
          }
        ]
      }
  })
  .then( (books) => {
    res.render('search', {books, search});
  }).catch((err)=>{
    next(err);
  })
})

//GET New Book Form
router.get('/new', (req, res)=>{
  let book= {
    'title': '',
    'author': '',
    'genre':'',
    'year': ''
  };
  res.render('new-book', {book});
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
router.get('/:id/delete', (req, res)=>{
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
router.post('/:id/delete', (req, res, next)=>{
  Book.findByPk(req.params.id).then((book)=> {
      return book.destroy();
  }).then(()=> {
      res.redirect('/books');
  }).catch((err)=>{
    next(err);
  })
})


module.exports = router;
