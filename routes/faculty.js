const router = require("express").Router();
const Faculty = require("../model/Faculty");
const {ensureAuthenticated} = require("../config/auth");

router.get("create-faculty", ensureAuthenticated, (req,res) => {
    try{
        return res.render("createFaculty");
    }catch(err){
        console.log(err);
    }
});


router.post("create-faculty", ensureAuthenticated, async (req,res) => {
    try{
        const {name} = req.body;
        if(!name){
            return res.render("createFaculty", {
                errors: [{msg:"Please provide a name"}]
            });
        }
        const newF = new Faculty({name});
        await newF.save();
        return res.redirect("/");
    }catch(err){
        console.log(err);
    }
});


router.get('edit-faculty/:id', ensureAuthenticated, async(req, res) => {
    try{
        const {id} = req.params;
        if(!id) return res.redirect("/");
        const faculty = await Faculty.findOne({_id:id});
        return res.render("editFaculty", {faculty});
    }catch(err){
        console.log(err);
    }
})


router.post("edit-faculty", ensureAuthenticated, async (req,res) => {
    try{
        const {id, name} = req.body;
        if(!id || !name){
            return res.render("createFaculty", {
                errors: [{msg:"Please provide a name"}]
            });
        }
        await Faculty.updateOne({_id:id}, {name});
        return res.redirect("/");
    }catch(err){
        console.log(err);
    }
});


router.post("delete-faculty", ensureAuthenticated, async (req,res) => {
    try{

    }catch(err){
        console.log(err);
    }
})

module.exports = router;