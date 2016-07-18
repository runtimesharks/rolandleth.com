_ = require('lodash')
const express = require('express')
const app = express()
const engine = require('ejs-mate') // For locals, layouts and partials
const Mincer = require('mincer') // For the pipeline
const bodyParser = require('body-parser') // For POST calls

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const pipeline = new Mincer.Environment()
Mincer.logger.use(console)

pipeline.appendPath('assets/files')
pipeline.appendPath('assets/images')
pipeline.appendPath('assets/javascripts')
pipeline.appendPath('assets/stylesheets')

app.use(express.static('./public'))
app.use('/assets', Mincer.createServer(pipeline))

// To pass in the canonical URL without a possible trailing slash.
// This way no 301 are required for indexing.
app.use(function(req, res, next) {
	let path = req.path
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
