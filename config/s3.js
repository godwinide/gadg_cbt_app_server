const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId: process.env.AccessKeyID,
    secretAccessKey: process.env.SecretAccessKey
});

const Bucket = "gadg";

module.exports.upload = (Body, Key, cb=null) =>{
    return new Promise((resolve,reject)=>{
        s3.upload({Bucket, Body, Key}, null, async (err, data) => {
            if(data){
                if(cb){
                    cb(data);                    
                }
                return resolve(data)
            }
            if(err){
                console.error(err);
                return reject(err);
            }
        })
    })
}
