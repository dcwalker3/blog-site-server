const dbConnection = require('../db/conn').conn;
const sanitizeInput = require('../db/conn').sanitizeInput;

class Post{
    constructor(title, content, author){
        this.title = sanitizeInput(title);
        this.content = sanitizeInput(content);
        this.author = sanitizeInput(author);
    }

    create(){
        const sql = `INSERT INTO posts (title, content, author) VALUES ('${this.title}', '${this.content}', '${this.author}')`;
        dbConnection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                console.log(result);
                return result;
            }
        });
    }

    updateTitle(newTitle){
        const sql = `UPDATE posts SET title = '${newTitle}' WHERE title = '${this.title}'`;
        dbConnection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                console.log(result);
                this.title = sanitizeInput(newTitle);
                return result;
            }
        });
    }

    updateContent(newContent){
        const sql = `UPDATE posts SET content = '${newContent}' WHERE content = '${this.content}'`;
        dbConnection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                console.log(result);
                this.content = sanitizeInput(newContent);
                return result;
            }
        });
    }

    updateAuthor(newAuthor){
        const sql = `UPDATE posts SET author = '${newAuthor}' WHERE author = '${this.author}'`;
        dbConnection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                console.log(result);
                this.author = sanitizeInput(newAuthor);
                return result;
            }
        });
    }
}

module.exports = Post;