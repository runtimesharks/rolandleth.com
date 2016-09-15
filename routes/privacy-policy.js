/**
 * Created by roland on 4/7/16.
 */

"use strict"

const router = require("express").Router()

router.get("/", function(req, res) {
	res.render("privacy-policy", {
		title: "Privacy Policy",
		metadata: "Roland Leth's privacy policy"
	})
})

module.exports = router
