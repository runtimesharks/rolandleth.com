import express from "express"
import fs from "fs"

const router = express.Router()

router.get("/resume.pdf", function(req, res) {
	const file = "./assets/files/Resume.pdf"
	const fileName = "Roland Leth - Résumé.pdf"

	sendPDF(file, fileName, res)
})

router.get("/europass.pdf", function(req, res) {
	const file = "./assets/files/Europass.pdf"
	const fileName = "Roland Leth - Europass.pdf"

	sendPDF(file, fileName, res)
})

function sendPDF(file, fileName, res) {
	fs.readFile(file, function(err, data) {
		res.set({
			"Content-Disposition": "inline; filename=" + fileName,
			"Content-Type": "application/pdf; filename=" + fileName
		})

		res.send(data)
	})
}

export { router as downloadsRouter }
