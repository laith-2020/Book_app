'use strict';

require('dotenv').config();

const express = require('express');
const superagent = require('superagent');

const cors = require('cors');
const server = express();
server.use(cors());

server.use(express.static('./public'));
server.set('view engine', 'ejs');

//middleware 
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/', (req, res) => {
    // res.status(200).send('Welcome Home Page');
    // res.render('pages/searches/new');
    res.render('pages/index');

})

// http://localhost:3030/hello
// server.get('/index', (req, res) => {
//     res.render('pages/index');
// })

server.get('/searche', (req, res) => {
    res.render('pages/searches/new');
});

server.post('/searches/new', (req, res) => {
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
}



const PORT = process.env.PORT;

server.get('*', (req, res) => {
    res.render('pages/error');
})

server.listen(PORT, (req, res) => {
    console.log(`lestening on port ${PORT}`);
});