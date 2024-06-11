const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Model = mongoose.model('Model', partnerSchema);

module.exports = Model;
