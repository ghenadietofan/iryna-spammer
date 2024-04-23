const express = require('express');
const {updateMany} = require('./shema');
let nodemailer = require("nodemailer");
const path = require('path');
const emailrouter = express.Router();
const Mail = require('./shema');

emailrouter.get('/', (req, res) => {
    console.log("Inside /")
    res.render('mail/email')
});

emailrouter.get('/list', (req, res) => {
    Mail.find().lean()
        .sort({surname: 1})
        .then(docs => {
            res.render("mail/list", {list: docs})
        });

});

emailrouter.post('/', (req, res) => {
    if (req.body._id === '') {
        create(req, res);
    } else updateThis(req, res);

});

function create(req, res) {
    console.log('Create Mail');
    const mail = new Mail();
    mail.surname = req.body.surname;
    mail.name = req.body.name;
    mail.secondname = req.body.secondname;
    mail.email = req.body.email;
    mail.city = req.body.city;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailRegex.test(mail.email)) {
        mail.save((err, doc) => {
            if (!err) {
                res.redirect('mailer/list');
            } else {
                console.log('Error' + err.message);
            }
        });
    }else{
        res.redirect('/mailer')
    }
}

function updateThis(req, res) {
    Mail.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
        if (!err) {
            res.redirect('mailer/list');
        } else {
            console.log('error' + err.message);
        }
    })
}


emailrouter.get('/:id', (req, res) => {
    console.log('Find by Id:' + req.params.id);
    Mail.findById(req.params.id).lean()
        .then(doc => {
            res.render("mail/email", {mailer: doc})
        });
});

emailrouter.get('/delete/:id', (req, res) => {
    Mail.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/mailer/list');
        } else {
            console.log("error" + err.message);
        }
    })
});

emailrouter.post('/send', (req, res) => {
    const output = `<h4>Message</h4> <p>${req.body.message}</p>`;

    Mail.find({}, function (err, allmails) {
            if (err) {
                console.log('Error in sending', err);
            }
            var list = [];
            allmails.forEach(function (users) {
                list.push(users.email);
                console.log(users);
                return list;
            });

            const transporter = nodemailer.createTransport({
                host: 'smtp.ukr.net',
                port: 465,
                auth: {
                    user: 'testwebstudent@ukr.net',
                    pass: 'H98Du4B4AKQDipRk'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            let result = {
                from: 'webuser@ukr.net',
                to: [],
                bcc: list,
                subject: "Spam for everyone without registration",
                text: "Hello!",
                html: output

            };
            if (list.length < 1) {
                res.send('<script>alert("There are no emails. Please, go back...")</script>');

            } else {
                transporter.sendMail(result, (err, info) => {
                    if (err) return console.error('Error at sendin 2 ', err);
                    console.log('Message sent %s', info.messageId);
                    res.render('mail/list', {msg: 'Emails have been sent'});
                    console.log("mail sent to " + list);
                });

            }
        }
    );

})

function updatePlaceholder(element) {
    var messageTextarea = document.getElementById("message");
    if (messageTextarea) {
        messageTextarea.placeholder = element.textContent;
    }
}

module.exports = emailrouter;







