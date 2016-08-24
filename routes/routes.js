/**
 * Created by roland on 3/7/16.
 */

"use strict"

const NotFound = require("./not-found")
const router = require("express").Router()

router.use("/feed", require("./feed"))
router.use("/sitemap.xml", require("./sitemap"))
router.use("/about", require("./about"))
router.use("/archive", require("./archive"))
router.use("/privacy-policy", require("./privacy-policy"))
router.use("/projects", require("./projects/projects"))
router.use("/search", require("./search"))
router.use("/downloads", require("./downloads"))
router.use("/cmd.sync", require("./sync"))
router.use(/^\/(\d+)/, require("./page"))
router.use(/^\/([\w\d\-]+)/, require("./post"))
router.use("/", require("./page"))
router.use("*", function(req, res) {
	NotFound.show(res)
})

module.exports = router
