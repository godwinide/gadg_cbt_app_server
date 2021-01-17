const router = require("express").Router();
const Exam = require("../model/Exam");
const {ensureAuthenticated} = require("../config/auth");


// Home
router.get("/", ensureAuthenticated, async (req,res) => {
    try{
        const exams = await Exam.find({});
        res.render("home", {exams});
    }catch(err){
        console.log(err);
    }
})

// Exam Detail
router.get("one/:id", ensureAuthenticated, async (req,res) => {
    const errors = [];
    try{
        const id = req.params.id;
        if(!id){
            errors.push({msg:"Please provide a valid id"});
            return res.status.apply(400).json({
                success: false,
                errors
            })
        }
        const exam = Exam.findById(id);
        return res.status(200).json({
            success: true,
            exam
        })
    }catch(err){
        return res.status(500)
        .json({success: false, errors: [{msg:"internal server error"}]});
    }
});


// Create Exam Page
router.get("/createExam", ensureAuthenticated, (req,res) => {
    return res.render("createExam");   
});
router.post("/createExam", async(req,res) => {
    const errors = [];
    try{
        const {title, duration} = req.body;
        if(!title || !duration){
            errors.push({msg:"Please fill all fields!"});
            return res.render("createExam", {errors})
        }
        const newExam = new Exam({title: title.toLowerCase(), duration});
        const exam = await newExam.save();
        return res.redirect("/");
    }catch(err){
        console.log(err);
    }
})

module.exports = router;