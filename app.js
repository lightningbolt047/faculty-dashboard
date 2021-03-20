var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors=require('cors');


var authRouter=require('./routes/authRouter');
var recoveryRouter=require('./routes/recoveryRouter');
var profileRouter=require('./routes/profileRouter');
const checkCredentials=require('./services/checkCredentialsService');
const mentoringRouter = require('./routes/mentoringRouter');

const mongoose=require('mongoose');
mongoose.set('useFindAndModify', false);


const User=require('./models/userSchema');


const dbURL='mongodb://127.0.0.1:27017/'

const dbConnect=mongoose.connect(dbURL);
dbConnect.then((db)=>{
  console.log("DB connection successful");
},(err)=>{
  console.log("Error connecting to DB");
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/auth',authRouter);
app.use('/recovery',recoveryRouter);
app.use('/profile',profileRouter);
app.use('/mentoring',mentoringRouter);


app.get('/images/:dbID/',(req,res,next)=>{

  console.log("dbID"+req.params.dbID);

  User.findById(req.params.dbID)
    .then((user)=>{
        if(!user){
            res.statusCode=404;
            res.json({
                status: "Invalid dbID"
            });
            return;
        }
        var imageName=user.imagePath.split('\\')[2];
        res.sendFile(imageName,{
          root: './public/images',
          dotfiles:'deny',
          headers: {
            'x-timestamp':Date.now(),
            'x-sent': true
          }
        });
    });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
