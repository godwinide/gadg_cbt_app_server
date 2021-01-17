const {Schema, model} = require("mongoose");

const ExamSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    published:{
        type: Boolean,
        required: false,
        default: false
    },
    duration:{
        type: Number,
        required: true
    },
    questions:{
        type: Array,
        required: false,
        default: []
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now()
    }
})

module.exports = Exam = model("Exam", ExamSchema);