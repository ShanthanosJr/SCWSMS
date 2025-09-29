const mongoose = require('mongoose');

const TimelineSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    tworker: [{
        name: String,
        role: String,
        hoursWorked: Number
    }],
    workerCount: {
        type: Number,
        default: 0
    },
    tengineer: [{
        name: String,
        specialty: String,
        hoursWorked: Number
    }],
    tengineerCount: {
        type: Number,
        default: 0
    },
    tarchitect: [{
        name: String,
        specialty: String,
        hoursWorked: Number
    }],
    architectCount: {
        type: Number,
        default: 0
    },
    tprojectManager: [{
        name: String,
        contact: String
    }],
    texpenses: [{
        description: String,
        amount: Number,
        date: Date
    }],
    tmaterials: [{
        name: String,
        quantity: Number,
        unit: String,
        cost: Number
    }],
    ttools: [{
        name: String,
        quantity: Number,
        status: String
    }],
    tnotes: String
}, { timestamps: true });

module.exports = mongoose.model('Timeline', TimelineSchema);