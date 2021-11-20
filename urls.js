// API Routes
module.exports = app => {
    app.use("/", require("./routes/exams"));
    app.use("/faculty", require("./routes/faculty"));
    app.use("/exam_detail", require("./routes/examDetail"))
    app.use("/login", require("./routes/login"));
    // API
    app.use("/api/exams", require("./routes/api/exams"));
}