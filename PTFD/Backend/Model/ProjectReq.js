const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectReqSchema = new Schema({
    preqname: {
        type: String,
        required: true,
    },
    preqmail: {
        type: String,
        required: true
    },
    preqnumber: {
        type: String,
        required: true
    },
    preqdescription: {
        type: String,
        required: true
    },
    preqdate: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model(
    "ProjectReq",
    ProjectReqSchema
);