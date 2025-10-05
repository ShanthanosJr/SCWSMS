const mongoose = require('mongoose');

const TimelineSchema = new mongoose.Schema({
    // Project Reference - Changed from pId to pcode for better user experience
    pcode: {
        type: String,
        required: true,
        trim: true
    },
    // Project details (populated from project API)
    projectDetails: {
        pname: String,
        powner: String,
        pcreatedAt: Date,
        pstatus: String,
        plocation: String,
        pnumber: String,
        pcode: String
    },
    
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

// Index for better performance
TimelineSchema.index({ pcode: 1, date: -1 });

module.exports = mongoose.model('ProjectTimeline', TimelineSchema);