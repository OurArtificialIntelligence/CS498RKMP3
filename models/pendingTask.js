var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    name: String,
    description: String,
    deadline: Date,
    completed: Boolean,
    assignedUser: {type: String, default: ''},
    assignedUserName: {type: String, default: "unassigned"},
    dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('pendingTask', commentSchema);
