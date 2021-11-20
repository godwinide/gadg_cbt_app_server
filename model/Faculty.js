const {model, Schema} = require("mongoose");

const FacultySchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = Faculty = model("Faculty", FacultySchema);