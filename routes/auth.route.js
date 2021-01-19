const express = require('express')
const { insert, executeQuery,findByCredentials, generateAuthToken } = require('../util')
const bcrypt = require('bcryptjs')
const moment = require('moment')
const router = new express.Router()

router.post('/register',async (req,res) => {
    try{
        let mainData = {
            ...req.body,
            created_on: moment().format('LLL'),
            updated_on: moment().format('LLL'),
        }
        mainData.password = await bcrypt.hash(req.body.password,8)
        let result = await insert(mainData, 'user_master')
        if(result.rowCount) res.send({"status": "success", "msg": "Inserted 1 Record"})
        else res.send({ "status": "unsuccess", "error": "Something went wrong" })
    }
    catch(e){
        console.log(e)
        res.send({ "status": "unsuccess", "error": "Something went wrong" })
    }
})

router.post('/toggle/active',async (req,res) => {
    try{
        let result = await executeQuery(`SELECT * FROM user_master WHERE email=$1`,[req.body.email])
        if(!result.rows[0].is_active){
            result = await executeQuery(`UPDATE user_master SET is_active=$1, upload_limit='unlimited',updated_on=$2 where email=$3`,[1, moment().format('LLL'), req.body.email])
            res.send({"status": "success", "msg": `${req.body.email} is now active` })
        }else{
            result = await executeQuery(`UPDATE user_master SET is_active=$1, upload_limit=1024, updated_on=$2 where email=$3`,[0,moment().format('LLL'),req.body.email])
            res.send({"status": "success", "msg": `${req.body.email} is now inactive` })
        }    
    }
    catch(e){
        console.log(e)
        res.send({ "status": "unsuccess", "error": "Something went wrong" })
    }
})

router.get('/login',async (req,res) => {
    try{
        let user = await findByCredentials({email: req.body.email,password: req.body.password})
        user = await generateAuthToken(user)
        return res.send(user)
    }
    catch(e){
        console.log(e)
        res.send({"status": "unsuccess", "error": "Something went wrong."})
    }
    
})


module.exports = router