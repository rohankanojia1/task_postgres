const express = require('express')
const moment = require('moment')
const { executeQuery, update, validateCookie } = require('../util')
const fs = require('fs')
const router = new express.Router()

router.post('/upload', validateCookie, async (req,res) => {
    try{
        const result = (await executeQuery(`SELECT * FROM user_master WHERE email=$1`,[req.user.email])).rows[0]
        const file = req.files.file
        if(result.upload_limit != 'unlimited' && file.size/1024 < result.upload_limit){
            fs.writeFile(`uploads/${result.email}`, file.data, async (err) => {
                if(err) throw err;
                await update({filesize: file.size/1024, updated_on: moment().format('LLL')},'user_master',{email: req.user.email})
                res.send({"status":"success", "msg": "File uploaded"})
            })
        }else if(result.upload_limit == 'unlimited'){
            fs.writeFile(`uploads/${result.email}`, file.data, async (err) => {
                if(err) throw err;
                await update({filesize: file.size/1000, updated_on: moment().format('LLL')},'user_master',{email: req.user.email})
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
