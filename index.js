const express=require('express')
const app=express()
const router=require('./route.js')
const port=process.env.port|1991

const mysession=require('express-session')

app.use(mysession({
  secret:'Email_id',
  resave:true,
  saveUninitialized:true
}))
app.use(mysession({
  secret:'user_nam',
  resave:true,
  saveUninitialized:true
}))
app.set('view engine','ejs')
app.use('/public',express.static(__dirname+'/public'))
app.use('/',router)
app.use('/signup',router)
app.use('/login',router)

app.use('/login_check',router)
app.use('/welcom',router)

app.use('/forgot_me',router)
app.use('/forgotPass',router)
app.use('/changepassword',router)
app.use('/displayRecord',router)
app.use('/logout',router)
app.use('/store',router)
app.use('/displayStudent',router)
app.use('/delete_stu',router)
app.listen(port,()=>
{
    console.log(`Click here http://localhost:${port}`)
})



/* 
 What is session in node js
 a web framework for Node. js used to create HTTP web servers. Express provides an easy-to-use API to interact with the webserver. Express-session - an HTTP server-side framework used to create and manage a session middleware.

Why we use session in node JS?
  You assign the client an ID and it makes all further requests using that ID. Information associated with the client is stored on the server linked to this ID. We will need the Express-session,
*/