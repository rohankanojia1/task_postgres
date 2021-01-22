const express = require('express')
const { insert, executeQuery,findByCredentials, generateAuthToken, validateCookie, update } = require('../util')
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

router.post('/toggle/active', validateCookie, async (req,res) => {
    try{
        if(!(req.user.role == 'admin')) return res.send({ "status": "unsuccess", "error": "Only admin can change user activity." })
        let result = await executeQuery(`SELECT * FROM user_master WHERE email=$1`,[req.body.email])
        if(req.body.is_active == '1'){
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

router.post('/login', async (req,res) => {
    try{
        let user = await findByCredentials({email: req.body.email,password: req.body.password})
        user = await generateAuthToken(user)
        res.cookie('user_token',user.token)
        return res.send({"status": "success", "msg": "Logged In"})
    }
    catch(e){
        console.log(e)
        res.send({"status": "unsuccess", "error": "Something went wrong."})
    }
    
})

router.get('/users',validateCookie, async (req,res) => {
    try{
        let users = (await executeQuery(`SELECT id,name,email FROM user_master`)).rows
        res.send(JSON.stringify(users))
    }
    catch(e){
        console.log(e)
        res.send({"status": "unsuccess", "error": "Something went wrong."})
    }

})

router.get('/',async(req,res) => {
    res.render('index')
})

router.get('/logout',validateCookie,async (req,res) => {
    try{
        await update({ token: 'NULL' },'user_master', { email: req.user.email })    
    }
    catch(e){
        console.log(e)
        res.send({ "status": "success", "msg": "Logged Out" })
    }
})

module.exports = router