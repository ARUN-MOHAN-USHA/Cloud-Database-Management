const express = require("express");
const app = express();
const PORT = 4000;
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const saltround = 10;
const bcrypt = require("bcrypt");


app.use(cookieParser());

app.use(session({
    secret:"My secret",
    name:"My site",
    resave:true,
    saveUninitialized:true
}))

app.use(express.urlencoded({extended:true}));

const users = [
    {userID:'01', username:'arun', email:'arunmkattachira@gmail.com', password:"123"}
]

mongoose.connect('mongodb+srv://arunmkattachira:arun123@cluster0.h2nxmmv.mongodb.net/?retryWrites=true&w=majority' ,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})

.then((console.log("mongodb connected")))

const postSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const Post = mongoose.model('Post', postSchema);

app.get('/signup', (req,res)=>{
    res.status(200).sendFile(__dirname + '/signup.html')
});

app.post('/signup', (req,res)=>{
    const{username,email,password} = req.body;
    bcrypt.hash(password,saltround,(err,hash)=>{

        const newPost = new Post({
            username: req.body.username,
            email: req.body.email,
            password: hash
        });
        newPost.save();

        if(err){
            res.send(err.message);
        }else{
            console.log(hash);
            res.status(404).redirect('/')
        }
    });
});


app.get('/',async(req,res) =>{
    if(req.session.isAuth){
        res.redirect('https://arun-mohan-usha.github.io/Responsive-web-page1/');
    }else{
        res.sendFile(__dirname + "/login.html")
    }
});

app.post('/',async(req,res) =>{
    
    const {email,password} =req.body;

    const user = users.find((item) =>  item.email ===email && item.password === password);

    if(!user){
        res.send("Invalid credentials");
    }else{
        req.session.userID = user.userID;
        req.session.isAuth = true;    
        res.redirect('https://arun-mohan-usha.github.io/Responsive-web-page1/');
    }

});

app.get('https://arun-mohan-usha.github.io/Responsive-web-page1/', (req,res) =>{
   
    if(req.session.isAuth){
        res.sendFile(__dirname + "https://arun-mohan-usha.github.io/Responsive-web-page1/");
    }else{
        res.redirect('/');
    }
});


app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
});      