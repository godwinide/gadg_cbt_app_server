const router = require("express").Router();
const Exam = require("../../model/Exam");
const randomizeArray = require("../../utils/randomizeArray")

// Get All Exams
router.get("/", async (req,res) => {
    try{
        const exams = await Exam.find({published:true});
        return res.status(200)
        .json({
            success: true,
            exams
        });
    }catch(err){
        return res.status(500)
        .json({
            success: false,
            errors: [{msg:"internal server error"}]
        })        
    }
})

// Get An Exam By ID
router.get("/:id", async (req,res) => {
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
        const examQuestions = randomizeArray(exam.questions);
        return res.status(200).json({
            success: true,
            exam: {
                ...exam,
                questions: examQuestions.slice(0, 40)
            }
        })
    }catch(err){
        return res.status(500)
        .json({success: false, errors: [{msg:"internal server error"}]});
    }
});



module.exports = router;