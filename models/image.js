const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Image', imageSchema);