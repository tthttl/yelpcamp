const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String,
    author: { // an object consisting of a REFERENCE to User and username
        id: { // id is a reference to USER => should we need it we would have to populate it by populate ('author.id')
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String // since we usually only need this => we don't have to populate it explicitly
    }
});

module.exports = mongoose.model('Comment', commentSchema);
