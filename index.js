const express = require('express');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser')
//const mysql2 = require('mysql2')
const config = require('./config/config.js')
const create = require('./models/TODOcreate.js')
const task = require('./models/task')
const formatTODO = require('./formatTODO')
const controllers = require('./controllers')
const db = require('./models/db.js');





app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser())

const session = require('express-session');
const sessionStore = new(require('express-mysql-session')(session))({}, db);
const sessionMiddleware = session({
    store: sessionStore,
    secret: "Большой секрет",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 600000
    }
});

app.use(sessionMiddleware);

const middlewares = require('./middlewares');
app.use(middlewares.logSession);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
})

io.on('connection', socket => {
    if (!socket.request.session || !socket.request.session.username) {
        console.log('Non authorised')
        socket.disconnect()
        return
    } else {
        let data = 'a user connected :' + socket.request.session.username
        io.emit('connected', {
            username: socket.request.session.username,
            message: data
        });
        console.log('a user connected (back) :', socket.request.session.username);
    }


    socket.on('disconnect', () => {
        let data = 'a user disconnected :' + socket.request.session.username
        io.emit('disconnected', data);
        console.log(data);
    })

    async function newsArr() {


        //let newsArr=['FREE NAVALNY']
        //return newsArr
        let sourceHttp = 'http://rbc.ru/'
        let sourceClass = '.main__feed__title'
        console.log('sourceHttp = ', sourceHttp)
        let result = await
        axios
            .get(sourceHttp)
            .then(function (res) {
                let html = res.data;
                let $ = cheerio.load(html);
                let newsArr = [];

                $(sourceClass).each(function (i, element) {
                    if (i < 2) newsArr.push($(this).text());

                });
                console.log('newsArr = ', newsArr)
                return newsArr[1]

            })
            .catch(function (err) {
                console.log(err.message)
                return null
            })
        //cat()//пасхальное яйцо
        return result
    }

    socket.on('chat message', async (data) => {
        console.log('chat message from (back) ',
            socket.request.session.username, ': ', data.message)
        if (socket.request.session.username == 'ttt') {
            let news = await newsArr();
            let message = 'BOT: ' + news;
            console.log('news = ', message)
            io.emit('chat message', {
              username: 'BOT',
                message: message
            })
        }
        data.message = socket.request.session.username + ': ' + data.message
        io.emit('chat message', {
            username: socket.request.session.username,
            message: data.message
        })
    })
});




//const handlebars = require('handlebars');
const hbs = require('hbs')


//app.engine('hbs', handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


var axios = require('axios');
var cheerio = require('cheerio');

const router = require('./routers');

var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
const githubAuth = require('./config/OAuth.js')

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(new GitHubStrategy({
        clientID: githubAuth.idClient,
        clientSecret: githubAuth.secretCode,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function (token, tokenSecret, profile, done) {
        console.log('profile = ', profile)
        return done(null, profile);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (username, done) {
    done(null, user)
})

app.use(passport.initialize())

//app.use(passport.session())

app.use(router);

//io.on('connection', (socket) => {
//  console.log('a user connected', socket.message);
//});

router.use('/', controllers.main.indexPage);





http.listen(3000, () => console.log('Listening on port 3000'));
