
//3rd Party Modules

var express   = require('express'),
    // bodyParser = require('body-parser'),
    passport  = require('passport'),
    session   = require('express-session'),
    RedisStore = require('connect-redis')(session),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),



//Local Modules
    // users     = require('./lib/users')(),
    db        = require('./lib/database'),
    redisClient = require('./lib/redisClient').connect(),
//    routes    = require('./routes/router.js'),
    port      = process.env.PORT || 3000,
    passportConfig = require('./lib/auth/passport'),
    auth      = require('./lib/auth'),
    app       = express();

//*************************************************
//        EJS template registration
//*************************************************

app.set('view engine', 'ejs');

//*************************************************
//      Middleware and other settings
//*************************************************

app.use(express.static(__dirname + '/public'));
//With Virtual Path
//
app.use('/assets', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); //TODO: check which is better qs or querystring library
app.use(cookieParser());

//*************************************************
//      Cookie and Sessions
//*************************************************
// redisClient.connect();

app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: 'blablabla',
  resave: false,
  saveUninitialized: false
}));
passportConfig.init(app);

//*********************************************************
//    Temp Routes
//*********************************************************

app.use('/auth', auth.auth);
// app.use('/auth', users.auth);
// app.use('/users', users.securedArea);

// app.get('/api/:name', function(req, res){
//   res.status(200).json({"hello": req.params.name });
// });

//*********************************************************
//    Convention based route loading
//*********************************************************
//routes.load(app, './controllers');

//Handle any routes that are unhandled and return 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.send('404');
    //res.render('errors/404', err);
});

app.listen(port, function (err) {
    console.log('running server on port: ' + port);
});
