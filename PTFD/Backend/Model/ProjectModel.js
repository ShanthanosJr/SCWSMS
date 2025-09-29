const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    pname: {
        type: String,
        required: true,
    },
    pnumber: {
        type: String,
        required: true,
        unique: true,
    },
    pcode: {
        type: String,
        required: true,
        unique: true,
    },
    plocation: {
        type: String,
        required: true,
    },
    pimg: [{ type: String }], // Array of image URLs/base64 strings

    ptype: {
        type: String,
        required: true,
    },
    pownerid: {
        type: String,
        required: true,
    },
    pownername: {
        type: String,
        required: true,
    },
    potelnumber: {
        type: String,
        required: true,
    },
    powmail: {
        type: String,
        required: true,
    },
    pdescription: {
        type: String,
        required: true,
    },
    ppriority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Medium"
    },

    pcreatedat: {
        type: Date,
        default: Date.now
    },
    pupdatedat: {
        type: Date,
        default: Date.now
    },
    pbudget: {
        type: Number,
        required: true,
    },
    pstatus: {
        type: String,
        required: true,
    },
    penddate: {
        type: Date,
        required: true,
    },
    pissues: [{ type: String }], // array of text issues
    pobservations: { type: String },

});

module.exports = mongoose.model(
    "ProjectModel", // filename
    ProjectSchema); // function name