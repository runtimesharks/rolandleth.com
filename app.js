_ = require('underscore')
Promise = require('bluebird')
var app = require('express')()
var Mincer = require('mincer')

app.set('view engine', 'ejs')

var pipeline = new Mincer.Environment(__dirname)
Mincer.logger.use(console)
pipeline.appendPath('assets/bourbon')
pipeline.appendPath('assets/files')
pipeline.appendPath('assets/images')
pipeline.appendPath('assets/javascripts')
pipeline.appendPath('assets/stylesheets')
app.use('/assets/', Mincer.createServer(pipeline))

app.listen(3000)
app.use('/about', require('./routes/about'))
app.use('/', require('./routes/index'))