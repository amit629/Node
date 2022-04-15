const express=require('express')
const app=express()
const bodyparser=require('body-parser')

const nodeMailer=require('nodemailer')
const router=express.Router()
const datagetter=bodyparser.urlencoded({extended:false})

const mydatabase_connectivity=require('./mysqlconnector')
const querystring=require('querystring')

router.get('/',(req,res)=>
{
    var em=req.session.Email_id
    if(em)
    {
        res.render('home',{user_email:em})
        res.end()
    }
    else{
        res.render('home',{user_email:0})
        res.end()
    }
})
router.get('/signup',(req,res)=>
{
    var userEmail=req.session.Email_id
    
    if(userEmail)
    {
        res.redirect('/')
        
    }
    else{
        res.render('signup',{message:0,err:0,user_email:0})
    
    }
    res.end()
})
router.post('/Signup_now',datagetter,(req,res)=>{
    var userName=req.body.PersonName
    var userEmail=req.body.PersonEmail
    var gender=req.body.gen
    var mobile=req.body.PersonMobile
    var password=req.body.PersonPassword
    var address=req.body.PersonAddress

    mydatabase_connectivity.getConnection((err,connection)=>{
        if(err)
        {
            connection.release()
            res.send(err)
            res.end()
        }
        else{
            var q=`insert into signup(name,email,gender,mobile,password,address) values('${userName}','${userEmail}','${gender}','${mobile}','${password}','${address}')`
            mydatabase_connectivity.query(q,(err,result)=>{
                if(err)
                {
                    connection.release()
                    res.render('signup',{message:0,err:err,user_email:0})
                    res.end()
                }
                else{
                    connection.release()
                    res.render('signup',{message:'SignUp Sucessfully',err:0,user_email:0})
                }
            })
        }
    })
})

router.post('/displayRecord',(req,res)=>{
    mydatabase_connectivity.getConnection((err,connection)=>{
        if(err){
            connection.release()
            res.send(err)
            res.end()
            
        }
        else{
            var q=`select * from signup`
            connection.query(q,(err,data)=>{
                if(err)
                {
                    connection.release()
                    res.send(err)
                    res.end()
                }
                else{
                    connection.release()
                    res.send(data)
                    res.end()
                }
            })
        }
    })
})
router.post('/forgot_me',datagetter,(req,res)=>{
    var myemail=req.body.email;
    mydatabase_connectivity.getConnection((err,connection)=>{
        if(err)
        {
            connection.release()
            res.send(err)
            res.end()
        }
        else{
            var q=`select * from signup where email='${myemail}'`
            connection.query(q,(err,result)=>{
                var data=result.length;
                if(data>0)
                {
                    connection.release()
                    var username=result[0].name;
                    var password=result[0].password;
                    var mailsender=nodeMailer.createTransport({
                        service:'gmail',
                        auth:{
                            user:'handkokarosanetize@gmail.com',
                            pass:'amit@22440'
                        }
                    })
                    var mailOp={
                            from:'handkokarosanetize@gmail.com',
                            to:myemail,
                            subject:"Forgot Password",
                            html:`<h1 align="center"><font color="orange">Hello, ${username}</font></h1> <h1 align="center"><font color="green">Your Password,${password}</font></h1>`
                        }
                    mailsender.sendMail(mailOp,(err,info)=>{
                        if(err)
                        {
                            res.render('forget',{message:err})
                            res.end()
                        }
                        else{
                            res.render('login',{message:"Password sent on mail",user_check:0,user_email:0})
                            res.end()
                        }
                    })
                }
                else{
                    connection.release()
                    res.render('forget',{message:"Your Email-id Not Registered"})
                    res.end()
                }
            })
        }
    })
})
router.post('/login_check',datagetter,(req,res)=>{
    var email_id=req.body.PersonLoginEmail
    var Per_password=req.body.PersonLoginPassword
    mydatabase_connectivity.getConnection((err,connection)=>{
        if(err)
        {
            connection.release()
            res.send(err)
            res.end()
        }
        else{
            var q=`select * from signup where email='${email_id}' and password='${Per_password}'`
            mydatabase_connectivity.query(q,(err,result)=>{
                if(err)
                {
                    connection.release()
                    res.end(err)
                    res.end()
                }
                else{
                    var total_length=result.length
                    if(total_length>0)
                    {
                        req.session.Email_id=result[0].email;
                        req.session.user_nam=result[0].name;
                        // var name=result[0].name;
                        // var email=result[0].email;
                        connection.release()
                        res.render('welcome',{user_name:req.session.user_nam,user_email:req.session.Email_id})
                        res.end()
                    }
                    else{
                        connection.release()
                        res.render('login',{user_check:1,message:0,user_email:0})
                        res.end()
                    }
                }
            })
            
        }
    })
})
router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.render('login',{user_check:0,message:0,user_email:0})
            console.log('session destroyed')
        }
    })
})
router.get('/changepassword',(req,res)=>{
    if(!req.session.Email_id)
    {
        
        res.render('login',{user_check:0,message:0,user_email:0})
    }
    else{
        res.render('change',{message:0,user_email:req.session.Email_id,user_name:req.session.user_nam}) 
    }
})
router.get('/login',(req,res)=>
{
    var userEmail=req.session.Email_id
    if(userEmail)
    {
        res.redirect('/')
    }
    else{
        res.render('login',{user_check:0,message:0,user_email:0})
    }
    res.end()
})
router.get('/about',(req,res)=>
{
    var em=req.session.Email_id
    if(em)
    {
        res.render('about',{user_email:em})
        res.end()
    }
    else{
        res.render('about',{user_email:0})
        res.end()
    }
})
router.get('/contact',(req,res)=>
{
    var em=req.session.Email_id
    if(em)
    {
        res.render('contact',{user_email:em})
        res.end()
    }
    else{
        res.render('contact',{user_email:0})
        res.end()
    }
})

router.get('/welcom',(req,res)=>{
    
    if(req.session.Email_id && req.session.user_nam)
    {
        res.render('welcome',{user_name:req.session.user_nam,user_email:req.session.Email_id})
    }
    else{
        res.redirect('/login')
    }
    res.end()
})
router.get("/forgotPass",(req,res)=>{
    res.render('forget',{message:0})
    res.end()
})

router.post('/change_now',datagetter,(req,res)=>{
    var userEmail=req.session.Email_id
    var old_pass=req.body.old
    var new_pass=req.body.new
    var conf_pass=req.body.conf
    var userName=req.session.user_nam
    
    mydatabase_connectivity.getConnection((err,connection)=>{
        if(err)
        {
            connection.release()
            res.send(err)
            res.end()
        }   
        else{
            var q=`select * from signup where email='${userEmail}' and password='${old_pass}'`
            connection.query(q,(erro,result)=>{
                var data_len=result.length
                if(data_len>0)
                {
                    if(new_pass==conf_pass)
                    {
                        var q=`update signup set password='${new_pass}' where email='${userEmail}'`
                        connection.query(q,(erro,result)=>{
                            if(err)
                            {
                                connection.release()
                                res.send(err)
                                res.end()
                            }
                            else{
                                connection.release()
                                res.render('change',{message:'password change sucessfully',user_email:userEmail,user_name:userName})
                                res.end()
                            }
                        })
                    }
                    else{
                        connection.release()
                        res.render('change',{message:'password mismatch',user_email:userEmail,user_name:userName})
                        res.end()
                    }
                }
                else{
                    connection.release()
                    res.render('change',{message:'old password incorrect',user_email:userEmail,user_name:userName})
                    res.end()
                }
            })
        }
    })

})
router.get('/store',(req,res)=>{
    var name=req.query.stuname
    var roll=req.query.sturoll
    var branch=req.query.stubranch
    if(name && roll && branch)
    {
        mydatabase_connectivity.getConnection((err,connection)=>{
            if(err)
            {
                connection.release()
                res.json(err)
                res.end()
            }
            else{
                var q=`insert into Test(Name,Roll,Branch) values('${name}','${roll}','${branch}')`
                connection.query(q,(err,result)=>{
    
                    connection.release()
                    const mymessage={Message:'Data inserted Sucessfully'}
                    res.json(mymessage)
                    res.end()
                    
                    
                })
            }
        })
    }
    else{
        res.json("Empty data")
        res.end()
    }
    
})
router.get('/displayStudent',(req,res)=>{
    mydatabase_connectivity.getConnection((err,connection)=>{
        if(err)
        {
            connection.release()
            res.send(err)
            res.end()

        }
        else{
            var q=`select * from Test`
            connection.query(q,(err,data)=>{
                if(err)
                {
                    connection.release()
                    res.send(err)
                    res.end()
                }
                else{
                    connection.release()
                    if(req.query.message=="wefkkeapdjnsfoejfopfnewif"){
                        res.render('display',{mydata:data,message:"sucessfull"})
                    }
                    else{
                        res.render('display',{mydata:data,message:0})
                    }
                    res.end()
                }
            })
        }
    })
})
router.get('/delete_stu',(req,res)=>{
    var roll_id=req.query.rl
    mydatabase_connectivity.getConnection((err,connection)=>{
        if(err)
        {
            connection.release()
            res.send(err)
            res.end()
        }
        else{
            var q=`delete from Test where roll=${roll_id}`
            connection.query(q,(err,data)=>{
                if(err)
                {
                    connection.release()
                    res.send(err)
                    res.end()
                }
                else{
                    const query = querystring.stringify({
                        "message":"wefkkeapdjnsfoejfopfnewif"
                    });
                    res.redirect('/displayStudent?' + query);
                }
            })
        }
    })
})
module.exports=router