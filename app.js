var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var converterRouter = require('./routes/converter');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var busboy = require('connect-busboy');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(busboy());
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/converter', converterRouter);




///upload
// default options
app.post('/fileupload', function(req, res) {
  var fstream;
  var filename;

  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
      console.log("Uploading: " + filename); 
     if (!filename) {  return console.log ('empty') ; }
     // console.log ('empty') 
      if (fs.existsSync(__dirname + '/files/' + filename)) {       
        // console.log("// Do something: " + filename); 
        // console.log(__dirname + '/files/' + filename);     
      }

     fstream = fs.createWriteStream(__dirname + '/files/' + filename);
     file.pipe(fstream) ;  
     fstream.on('close', function () {
      res.redirect('back');
     });      
     
  });
});
///



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
