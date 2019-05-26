const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    imageId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true}
});

module.exports = mongoose.model('Comment', commentSchema);