var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var router = express.Router();
var jsonParser = bodyParser.json();

router.use(express.static(__dirname + "/public"));

router.get("/books", function(req, res){
      
    var content = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(content);
    res.send(books);
});

router.get("/books/:id", function(req, res){
      
    var id = req.params.id;
    var content = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(content);
    var book = null;

    for(var i=0; i<books.length; i++){
        if(books[i].id==id){
            book = books[i];
            break;
        }
    }

    if(book){
        res.send(book);
    }
    else{
        res.status(404).send();
    }
});

router.post("/books", jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
    var bookName = req.body.name;
    var bookAuthor = req.body.author;
    var book = {name: bookName, author: bookAuthor};
     
    var data = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(data);
 
    var id = Math.max.apply(Math,books.map(function(o){return o.id;}))

    book.id = id+1;

    books.push(book);
    var data = JSON.stringify(books);

    fs.writeFileSync("books.json", data);
    res.send(book);
});

 router.delete("/books/:id", function(req, res){
      
    var id = req.params.id;
    var data = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(data);
    var index = -1;

    for(var i=0; i<books.length; i++){
        if(books[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        var book = books.splice(index, 1)[0];
        var data = JSON.stringify(books);
        fs.writeFileSync("books.json", data);
        res.send(book);
    }
    else{
        res.status(404).send();
    }
});

router.put("/books", jsonParser, function(req, res){
      
    if(!req.body) return res.sendStatus(400);
     
    var bookId = req.body.id;
    var bookName = req.body.name;
    var bookAuthor = req.body.author;
     
    var data = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(data);
    var book;
    for(var i=0; i<books.length; i++){
        if(books[i].id==bookId){
            book = books[i];
            break;
        }
    }

    if(book){
        book.author = bookAuthor;
        book.name = bookName;
        var data = JSON.stringify(books);
        fs.writeFileSync("books.json", data);
        res.send(book);
    }
    else{
        res.status(404).send(book);
    }
});

module.exports = router;