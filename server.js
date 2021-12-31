const express = require('express')
const Article = require('./models/article')
const Event = require('./models/event')
const mongoose = require('mongoose')
var bodyParser = require("body-parser")
const { events } = require('./models/article')
const app = express();
require('dotenv').config()
const passport = require('passport');
const cookieSession = require('cookie-session')
const { name } = require('ejs')
require('./passport-setup');

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// mongoose.connect('mongodb://localhost:27017/blog', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// mongoose.connect('mongodb://localhost/blog')

var db = mongoose.connection;

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

app.set('views', './views')
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')





app.use(cookieSession({
        name: 'tuto-session',
        keys: ['key1', 'key2']
    }))
    // Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.sendStatus(401);
        }
    }
    // Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());


// Example protected and unprotected routes
app.get('/', (req, res) => res.render('index'))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) => {
        res.render("home", { name: req.user.displayName, pic: req.user.photos[0].value, email: req.user.emails[0].value })
    })
    // Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/good');
    }
);
app.get('/logout', (req, res) => {
    req.session = null;
    req.cookie = null;
    req.logout();
    res.redirect('/');
})

// app.post("/", (req, res) => {
//     var name = req.body.name;
//     var email = req.body.email;
//     var phno = req.body.phno;
//     var password = req.body.password;

//     var data = {
//         "name": name,
//         "email": email,
//         "phno": phno,
//         "password": password
//     }
//     app.locals.name = name;
//     global.gname = name
//     db.collection('users').insertOne(data, (err, collection) => {
//         if (err) {
//             throw err;
//         }
//         console.log("Record Inserted Successfully");
//     });
//     return res.redirect('/home')
// })

app.get('/signin', (req, res) => {
    res.render('signin')
})

//use alternative of body-parser later
app.get('/home', (req, res) => {
    res.redirect('/good')
})
app.post('/home', (req, res) => {
    res.redirect('/good')
})

app.get('/form', (req, res) => {
    res.render('form');
})
app.get('/about', isLoggedIn, (req, res) => {
    res.render('about');
})

//test 
app.get('/blog', isLoggedIn, async(req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' }).limit(9)
    res.render('blog', { articles: articles })
})



app.get('/blog/:id', async(req, res) => {
    const article = await Article.findById(req.params.id)
    if (article == null) res.redirect('/')
    res.render('show', { article: article })
})

app.post('/blog', async(req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.exampleFormControlTextarea1
    })
    try {
        article = await article.save()
        res.redirect(`/blog`)
    } catch (e) {
        res.render('404')
    }
})
app.get('/contact', isLoggedIn, (req, res) => {
    res.render('contact');
})

app.get('/event', isLoggedIn, async(req, res) => {
    const events = await Event.find().sort({ createdAt: 'desc' }).limit(5)

    // const name = await Article.find().sort({ createdAt: 'desc' }).limit(1)

    res.render('event', { events: events, name: req.user.displayName })
})
app.get('/event/new', (req, res) => {

    res.render('eform');
})
app.post('/event', async(req, res) => {
    // const events = [{
    //     title: 'test',
    //     description: 'dummy'
    // }]
    // res.render('event', { events: events })
    let event = new Event({
        title: req.body.title,
        description: req.body.exampleFormControlTextarea1
    })
    try {
        event = await event.save()
        res.redirect(`/event`)
    } catch (e) {
        res.render('404')
    }
})

app.get('/*', (req, res) => {
    res.render('404')
})
app.listen(5000)