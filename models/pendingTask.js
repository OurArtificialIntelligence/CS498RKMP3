var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    name: String,
    description: {type: String, default: ''},
    deadline: Date,
    completed: {type: Boolean, default: false},
    assignedUser: {type: String, default: ''},
    assignedUserName: {type: String, default: "unassigned"},
    dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('pendingTask', commentSchema);
