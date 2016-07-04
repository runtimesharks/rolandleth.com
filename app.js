_ = require('lodash')
Promise = require('bluebird')
var express = require('express')
var app = express()
var engine = require('ejs-mate')
var Mincer = require('mincer')

var pipeline = new Mincer.Environment()
Mincer.logger.use(console)

pipeline.appendPath('assets/bourbon')
pipeline.appendPath('assets/files')
pipeline.appendPath('assets/images')
pipeline.appendPath('assets/javascripts')
pipeline.appendPath('assets/stylesheets')

app.use(express.static('./public'))
app.use('/assets', Mincer.createServer(pipeline))

// To pass in the canonical URL without a possible trailing slash.
// This way no 301 are required for indexing.
app.use(function(req, res, next) {
	var path = req.path
	if (path.slice(-1) == '/') {
		path = path.slice(0, -1)
	}
	res.locals.path = path
	next()
})

app.use('/', require('./routes/routes'))
app.engine('ejs', engine)
app.set('view engine', 'ejs')

app.listen(process.env.PORT || 3000)
