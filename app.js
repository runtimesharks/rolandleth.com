_ = require('lodash')
Promise = require('bluebird')
var app = require('express')()
var engine = require('ejs-mate')
var Mincer = require('mincer')

var pipeline = new Mincer.Environment(__dirname)
Mincer.logger.use(console)

pipeline.appendPath('assets/bourbon')
pipeline.appendPath('assets/files')
pipeline.appendPath('assets/images')
pipeline.appendPath('assets/javascripts')
pipeline.appendPath('assets/stylesheets')

app.use('/assets/', Mincer.createServer(pipeline))
app.use('/', require('./routes/routes'))
app.engine('ejs', engine)
app.set('view engine', 'ejs')

app.listen(process.env.PORT || 3000)
