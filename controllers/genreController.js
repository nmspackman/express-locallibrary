const Genre = require('../models/genre');
const Book = require('../models/book');

const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.genre_list = function(req, res) {
  Genre.find({})
    .sort([['name', 'ascending']])
    .exec(function(err, list_genres) {
      res.render('genre_list', {title: 'Genre List', genre_list: list_genres});
  });
};

exports.genre_detail = function(req, res, next) {
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.params.id)
        .exec(callback);
    },
    genre_books: function(callback) {
      Book.find({ 'genre': req.params.id })
        .exec(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.genre==null) {
      var err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }
    res.render('genre_detail', { genre_books: results.genre_books, genre: results.genre });
  });
};

exports.genre_create_get = function(req, res) {
  res.render('genre_form', { title: 'Create Genre' });
};

exports.genre_create_post = [
  body('name', 'Genre name required.').isLength({ min: 1}).trim(),
  body('name','Only letters permitted.').isAlpha(),
  sanitizeBody('name').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array());
    let genre = new Genre(
      { name: req.body.name }
    );

    if (!errors.isEmpty()) {
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
      return;
    } else {
      Genre.findOne({ 'name': req.body.name })
        .exec(function(err, found_genre) {
          if (err) { return next(err); }
          if (found_genre) {
            res.redirect(found_genre.url);
          } else {
            genre.save(function(err) {
              if (err) { return next(err); }
              res.redirect(genre.url);
            });
          }
        });
    }
  }
];

exports.genre_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

exports.genre_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

exports.genre_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

exports.genre_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};