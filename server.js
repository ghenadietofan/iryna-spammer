//localhost:3000/mailer

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Налаштування Handlebars як шаблонізатора
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', handlebars.engine({
    layoutsDir: `${__dirname}/views/layouts`,
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, '/mail')));
app.use(express.static('styles'));

const uri = "mongodb://localhost:27017/mails";
const name = 'mails';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log('Connected to MongoDB'));



        app.get('/', (req, res) => {
            console.log("App get" + __dirname)
            res.render('mail/email')
        })
        const emailRouter = require('./mailer');
        console.log('Going to mailer')
        app.use('/mailer', emailRouter);

        app.listen(3000, () => console.log("Server is listening on port 3000"));

