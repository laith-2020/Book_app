'use strict';

require('dotenv').config();

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');
const methodOverride = require('method-override');
const server = express();
const PORT = process.env.PORT || 3000;
server.use(cors());
server.use(methodOverride('_method'));

server.use(express.static('./public'));
server.set('view engine', 'ejs');

const client = new pg.Client(process.env.DB_URL);

//middleware to render and use the ejs
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/books/:book_id', getOneId);
server.get('/', getBooks);
server.post('/showForm', showForm);
server.post('/showAddForm', AddToDB);
server.put('/updateData/:book_id', updateFunction);
server.delete('/deleteData/:book_id', deleteFunction);

function getOneId(req, res) {
    let SQL = `SELECT * FROM books WHERE id=$1;`;
    let values = [req.params.book_id];
    console.log(req.params);
    client.query(SQL, values)
        .then(results => {
            console.log(results.rows);
            res.render('pages/books/detail', { resultsKey: results.rows[0] });
        })
}

function getBooks(req, res) {
    let SQL = ' SELECT * FROM books;';
    client.query(SQL)
        .then(results => {
            res.render('pages/index', { resultsKey: results.rows });
        })
        .catch(error => {
            server.get('*', (req, res) => {
                res.render('pages/error');
            })
        })
}

function showForm(req, res) {
    res.render('pages/index');
}

function AddToDB(req, res) {
    console.log(req.body);
    let { img, title, authors, description, isbn } = req.body;
    let SQL = `INSERT INTO books(img,title,authors,description,isbn) VALUES ($1,$2,$3,$4,$5);`;
    // let values = [req.body.img,req.body.title,req.body.authors,req.body.description,req.body.isbn];
    let values = [img, title, authors, description, isbn];
    client.query(SQL, values)
        .then(() => {
            console.log(req.body)
            res.redirect('/');
        })

}

function updateFunction(req, res) {
    let { img, title, authors, description, isbn } = req.body;
    let SQL = `UPDATE  books SET img=$1,title=$2,authors=$3,description=$4,isbn=$5 WHERE id=$6;`;
    let id = req.params.book_id;
    let values = [img, title, authors, description, isbn, id];
    client.query(SQL, values)
        .then(() => {
            res.redirect(`/books/${id}`);
        })
}

function deleteFunction(req, res) {
    let SQL = ` DELETE FROM books WHERE id=$1;`;
    let values = [req.params.book_id];
    client.query(SQL, values)
        .then(() => {
            res.redirect('/');
        })
}

server.get('/', (req, res) => {
    // res.status(200).send('Welcome Home Page');
    res.render('pages/index');

})

server.get('/searches/new', (req, res) => {
    res.render('pages/searches/new');
});

server.post('/searches', (req, res) => {
    let searchBy = req.body.by;
    let searchFor = req.body.bookName;

    if (searchBy == 'author') {

        let urlByAuthor = `https://www.googleapis.com/books/v1/volumes?q=${searchFor}+inauthor`;
        superagent.get(urlByAuthor)
            .then(savedBook => {
                let bookResult = savedBook.body.items.map(item => {
                    return new Book(item);
                })
                res.render('pages/searches/show', { savedBookKey: bookResult });
                return bookResult;

            })
    } else {
        let urlByTitle = `https://www.googleapis.com/books/v1/volumes?q=${searchFor}+intitle`;
        superagent(urlByTitle)
            .then(savedBook => {
                let bookResult = savedBook.body.items.map(item => {
                    return new Book(item);
                })
                res.render('pages/searches/show', { savedBookKey: bookResult });
                return bookResult;

            })
    }
})

// constructor BOOK 
function Book(bookData) {
    this.img = bookData.volumeInfo.imageLinks.thumbnail;
    this.title = bookData.volumeInfo.title;
    this.authors = bookData.volumeInfo.authors;
    this.description = bookData.volumeInfo.description;
    this.isbn = bookData.volumeInfo.industryIdentifiers && bookData.volumeInfo.industryIdentifiers[0].identifier;
}



server.get('*', (req, res) => {
    res.render('pages/error');
})

client.connect()
    .then(() => {
        server.listen(PORT, (req, res) => {
            console.log(`lestening on port ${PORT}`);
        });

    })