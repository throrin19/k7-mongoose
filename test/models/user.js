'use strict';

const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  }
});

const UserModel = mongoose.model('User', Schema);

module.exports = UserModel;
