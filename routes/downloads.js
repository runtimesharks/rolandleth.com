/**
 * Created by roland on 6/7/16.
 */

"use strict"

const router = require("express").Router()
const fs = require("fs")

router.get("/privacy-policy.md", function(req, res) {
	res.download("./assets/files/Privacy Policy.md", "Roland Leth - Privacy Policy.md")
})

router.get("/resume.pdf", function(req, res) {
	const resume = "./assets/files/Resume.pdf"
	const fileName = "Roland Leth - Résumé.pdf"
	fs.readFile(resume, function(err, data) {
		res.set({
			"Content-Disposition": "inline; filename=" + fileName,
			"Content-Type": "application/pdf; filename=" + fileName
		})
		res.send(data)
	})
})

module.exports = router
