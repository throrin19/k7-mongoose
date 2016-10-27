'use strict';

const Mongoose = require('mongoose');

const Schema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    checked: Boolean
});

const TodoModel = Mongoose.model('Todo', Schema);

module.exports = TodoModel;

