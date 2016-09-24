_ = require("lodash")
const express = require("express")
const app = express()
const engine = require("ejs-mate") // For locals, layouts and partials
const Mincer = require("mincer") // For the pipeline
const bodyParser = require("body-parser") // For POST calls
const helpers = require("./lib/helpers.js")

app.use(helpers.secureAndNakedRedirect)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const pipeline = new Mincer.Environment()
if (helpers.development && false) {
	Mincer.logger.use(console)
}

pipeline.appendPath("assets/files")
pipeline.appendPath("assets/images")
pipeline.appendPath("assets/javascripts")
pipeline.appendPath("assets/stylesheets")

app.use(express.static("./public"))
app.use("/assets", Mincer.createServer(pipeline))

app.use(helpers.setCanonicalMeta)
app.use(helpers.setDisableEmbeddingHeaders)
app.use("/", require("./routes/routes"))
app.engine("ejs", engine)
app.set("view engine", "ejs")

app.listen(process.env.PORT || 3000)
