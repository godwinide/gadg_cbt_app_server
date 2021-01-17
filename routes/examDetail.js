const router = require("express").Router();
const Exam = require("../model/Exam");
const uuid = require("uuid");
const {upload} = require("../config/s3");
const fs = require("fs");
const {ensureAuthenticated} = require("../config/auth");


router.get("/:id", ensureAuthenticated, async(req,res) => {
    try{
        const id = req.params.id;
        const exam = await Exam.findById(id);
        if(exam){
            return res.render("examDetail", {exam});
        }
        return res.redirect("/");
    }catch(err){
        console.log(err);
    }
})

// publish
router.post("/publish", ensureAuthenticated, async(req,res) => {
    try{
        const id = req.body.id;
        const exam = await Exam.findById(id);
        exam.updateOne({published: !exam.published})
        .then(async() => {
            const exam = await Exam.findById(id);
            return res.render("examDetail", {exam});
        })
        
    }catch(err){
        console.log(err);
    }
})

// edit Exam
router.get("/editExam/:id", ensureAuthenticated, async(req,res) => {
    try{
        const id = req.params.id;
        const exam = await Exam.findById(id);
        if(exam){
            return res.render("editExam", {exam});
        }
        return res.redirect("/");
    }catch(err){
        console.log(err);
    }
});

router.post("/editExam", ensureAuthenticated, async(req,res) => {
    const errors = [];
    try{
        const {title, duration, id} = req.body;
        if(!title || !duration){
            errors.push({msg:"Please fill all fileds!"})
            return res.render("editExam", {errors, ...req.body, exam:{id}});
        }
        const exam = await Exam.findById(id);
        if(exam){
            await exam.updateOne({title, duration})
            .then(async()=> {
                const exam = await Exam.findById(id);
                res.render("editExam", {success_msg:"Exam updated", exam});
            })
        }
        return res.redirect("/");
    }catch(err){
        console.log(err);
    }
});

// delete exam
router.post("/delete", ensureAuthenticated, async(req,res) => {
    const id = req.body.id;
    try{
        if(id){
            await Exam.deleteOne({_id:id})
            return res.redirect("/");
        }
        return res.redirect("/");
    }catch(err){
        console.log(err);
    }
})

// create question
router.post("/createQuestion", ensureAuthenticated, async(req,res) => {
    try{
        const errors = [];
        const {examID, question, answer, option1, option2, option3} = req.body;
        const exam = await Exam.findById(examID);
        if(!examID){
            return res.redirect("/");
        }
        if(!question || !answer || !option1 || !option2 || !option3){
            errors.push({msg:"please fill all fileds!"})
            res.render("examDetail", {exam, errors})
        }
        const newQuestion = {
            question,
            options:[
                {text: answer, correct: true},
                {text: option1, correct: false},
                {text: option2, correct: false},
                {text: option3, correct: false}
            ],
            id: uuid.v4()
        }
        if(req.files){
            const {image} = req.files;
            const mimetypes = ["image/png", "image/jpg", "image/jpeg"];

            if(!mimetypes.includes(image.mimetype)){
                errors.push({msg:"Please provide a valid image"})
                return res.render("examDetail",{exam})
            }
            const ext_name = image.name.split(".")
            const Key = uuid.v4() + "." + ext_name[ext_name.length-1];
            const Body = fs.readFileSync(image.tempFilePath);
            const data = await upload(Body, Key);
            if(data){
                newQuestion.image = data.Location;
                exam.updateOne({questions: [...exam.questions, newQuestion]})
                .then(async () => {
                    const exam = await Exam.findById(examID);
                    return res.render("examDetail", {exam})
                })
            }
        }else{
            exam.updateOne({questions: [...exam.questions, newQuestion]})
            .then(async () => {
                const exam = await Exam.findById(examID);
                return res.render("examDetail", {exam})
            })
        }

    }catch(err){
        console.log(err);
    }
});

// edit Question
router.get("/editQuestion/:examID/:questionID", ensureAuthenticated, async(req,res) => {
    try{
        const {examID, questionID} = req.params;
        if(!examID || !questionID){
            return res.redirect("/")
        }
        const exam = await Exam.findById(examID);
        const question = exam.questions.filter(q => q.id === questionID)[0];
        return res.render("editQuestion", {question, exam});
    }catch(err){
        console.log(err);
    }
});

router.post("/editQuestion", ensureAuthenticated, async(req,res) => {
    try{
        const {examID, questionID, question, answer, option1, option2, option3} = req.body;
        if(!examID || !questionID){
            return res.redirect("/");
        }
        const exam = await Exam.findById(examID);
        const modified = {
            question,
            options:[
                {text: answer, correct: true},
                {text: option1, correct: false},
                {text: option2, correct: false},
                {text: option3, correct: false}
            ]
        };
        const newQuestions = exam.questions.map(q => {
            if(q.id === questionID){
                return {
                    ...q,
                    ...modified,
                }
            }else{
                return q
            }
        })
        console.log(newQuestions)
        exam.updateOne({questions: newQuestions})
        .then(async()=> {
            const exam = await Exam.findById(examID);
            const question = exam.questions.filter(q => q.id === questionID)[0];
            return res.render("editQuestion", {exam, question, success_msg:"Updated"})
        })
    }catch(err){
        console.log(err);
    }
})


// delete question
router.post("/deleteQuestion", ensureAuthenticated, async(req,res) => {
    const {questionID, examID} = req.body;
    if(!questionID || !examID){
        return res.redirect("/");
    }
    const exam = await Exam.findById(examID);
    newQuestions = exam.questions.filter(q => q.id !== questionID);
    exam.updateOne({questions:newQuestions})
    .then(async()=> {
        const exam = await Exam.findById(examID);
        return res.render("examDetail", {exam});
    })
});

module.exports = router;