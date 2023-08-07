const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
    default: Date.now().toString()
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);


module.exports = User;