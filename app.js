_ = require("lodash")
const async = require('async') // For parallelizing jobs.
const express = require("express")
const app = express()
const engine = require("ejs-mate") // For locals, layouts and partials.
const Mincer = require("mincer") // For the pipeline.
const bodyParser = require("body-parser") // For POST calls.
const helpers = require("./lib/helpers.js") // Helpers, mostly for headers.

app.use(helpers.secureAndNakedRedirect)

const pipeline = new Mincer.Environment()
if (helpers.development && false) {
	Mincer.logger.use(console)
}

pipeline.appendPath("assets/files")
pipeline.appendPath("assets/images")
pipeline.appendPath("assets/javascripts")
pipeline.appendPath("assets/stylesheets")

app.use("/assets", Mincer.createServer(pipeline))

app.use(parallel([
	express.static("./public"),
	helpers.setCanonicalMeta,
	helpers.setDisableEmbeddingHeaders,
	helpers.setCachePolicy,
	bodyParser.json(),
	bodyParser.urlencoded({ extended: true })
]))

app.use("/", require("./routes/routes"))
app.engine("ejs", engine)
app.set("view engine", "ejs")

app.listen(process.env.PORT || 3000)

// Thanks to https://engineering.gosquared.com/making-dashboard-faster
function parallel(middlewares) {
	return function (req, res, next) {
		async.each(middlewares, function (mw, cb) {
			mw(req, res, cb)
		}, next)
	}
}
