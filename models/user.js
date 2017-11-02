var mongoose = require('mongoose'),
    pendingTasks = require('./pendingTask');

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    dateCreated: {type: Date, default: Date.now},
    pendingTasks: [{
      type: String,
      ref: "pendingTasks"
    }]
});

module.exports = mongoose.model('user', userSchema);
