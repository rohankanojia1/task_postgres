const express = require('express')
const { executeQuery } = require('../util')
const fs = require('fs')
const router = new express.Router()

router.post('/upload', async (req,res) => {
    try{
        const result = (await executeQuery(`SELECT * FROM user_master WHERE email=$1`,[req.body.email])).rows[0]
        const file = req.files.file
        if(result.upload_limit != 'unlimited' && file.size < result.upload_limit){
            fs.writeFile(`uploads/${result.email}`, file.data, (err) => {
                if(err) throw err;
                res.send({"status":"success", "msg": "File uploaded"})
            })
        }else if(result.upload_limit == 'unlimited'){
            fs.writeFile(`uploads/${result.email}`, file.data, (err) => {
                if(err) throw err;
                res.send({"status":"success", "msg": "File uploaded"})
            })
        }else{
            res.send({"status": "unsuccess", "msg": `Not allowed to upload file bigger than ${result.upload_limit}`})
        }    
    }
    catch(e){
        console.log(e)
        res.send({"status": "unsucces", "error": "Something went wrong"})
    }
})

module.exports = router
