const mongoose = require('mongoose');
// in yelp camp there is only REFERENCE association
// other type would be => EMBEDDED => the SCHEMA is the value, not a reference
// by EMBEDDED the whole object is saved together with the owning object
// useful, when we ALWAYS need the EMBEDDED object together with the owning object

const campGroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: { // this is a reference to user => by GET we have to explicitly POPULATE it
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('CampGround', campGroundSchema);
