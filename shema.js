const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailSchema = new Schema({
    surname: { type: String, required: true },
    name: { type: String, required: true },
    secondname: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: false }
});

module.exports = mongoose.model('Email', emailSchema);
