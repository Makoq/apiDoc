var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var renderPage = require("./routes/renderPage");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//记录日志
app.use((req, res, next) => {
  //console.log(req.url, (new Date()).toString());
  next();
});
//页面路由
app.get("/", renderPage.render("home"));
app.get("/index", renderPage.render("home"));
app.get("/download", renderPage.render("download"));
app.get("/doc", renderPage.render("doc"), renderPage.renderDoc("doc"));
app.get("/community", renderPage.render("community"));
app.get("/contactUs", renderPage.render("contactUs"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler for ajax request
app.use(function(err, req, res, next) {
  if(req.xhr){
    res.status(err.status).send(err.message);
  }
  else{
    next(err);
  }
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
