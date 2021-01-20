const { connect } = require('./util')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const ejs = require('ejs')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.route')
const uploadRouter = require('./routes/upload.route')

app.use(cookieParser())
app.use(fileUpload({ limits: {fileSize: 50*1024*1024} })) // 50MB
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(authRouter)
app.use(uploadRouter)

app.use(express.static('public'))
app.set('view engine','ejs')
app.set('views',__dirname+'/views')

connect(app)