const { connect } = require('./util')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const authRouter = require('./routes/auth.route')
const uploadRouter = require('./routes/upload.route')


app.use(fileUpload({ limits: {fileSize: 50*1024*1024} })) // 50MB
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(authRouter)
app.use(uploadRouter)


connect(app)