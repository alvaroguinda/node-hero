// index.js
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views',path.join(__dirname, 'views'))

app.get('/', (request, response) => {
    response.render('home', {
        name: 'Alvaro'
    })
})

const pg = require('pg')
const config = {
    user: 'postgres',
    password: '123qwe',
    database: 'node_hero',
    port: '5432'
}
const pool = new pg.Pool(config)

app.get('/users', function (req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            // pass the error to the express error handler
            return next(err)
        }
        client.query('SELECT name, age FROM users;', [], function (err, result) {
            done()

            if (err) {
                // pass the error to the express error handler
                return next(err)
            }
            
            res.json(result.rows)
        })
    })
})

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/users', function (req, res, next) {
    // retrive user posted data from the body
    const user = req.body

    pool.connect(function (err, client, done) {
        if (err) {
            // pass the error to the express error handler
            return next(err)
        }
        client.query('INSERT INTO users (name, age) VALUES ($1, $2);', [user.name, user.age], function (err, result) {
            done() //this done callback signals the pg driver that the connection can be closed ir returned to the conection pool

            if (err) {
                // pass the error to the express error handler
                return next(err)
            }

            res.sendStatus(200)
        })
    })
})

app.listen(3000, function () {
    console.log('Server is running.. on Port 4000');
});