const mongoose = require("mongoose");

module.exports = async() => {
    try{
        const conn = await mongoose.connect(process.env.mongodb_uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log(`mongodb connected on port ${conn.connection.port}`);
    }catch(err){
        console.log("mongodb error: ", err);
    }
}