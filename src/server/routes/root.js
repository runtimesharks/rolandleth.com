import App from "../../App"
import React from "react"
import Helmet from "react-helmet"
import { StaticRouter } from "react-router-dom"
import express from "express"
import { renderToString } from "react-dom/server"

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)
const router = express.Router()

router.get("/*", (req, res) => {
	const context = {}
	const location = req.protocol + "://" + req.hostname + req.originalUrl
	const markup = renderToString(
		<StaticRouter context={context} location={req.originalUrl}>
			<App location={location} />
		</StaticRouter>
	)

	const helmet = Helmet.renderStatic()
	const allHelmetDataAsString = Object.keys(helmet)
		.map((key) => helmet[key].toString())
		.filter((o) => o !== "" && o !== undefined)
		.join("\n")

	if (context.url) {
		res.redirect(context.url)
	} else {
		res.status(200).send(`
<!doctype html>
<html lang="">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta charset="utf-8" />
		<title>Roland Leth</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		${allHelmetDataAsString}
		${
			assets.client.css
				? `<link rel="stylesheet" href="${assets.client.css}">`
				: ""
		}
		${
			process.env.NODE_ENV === "production"
				? `<script src="${assets.client.js}" defer></script>`
				: `<script src="${assets.client.js}" defer crossorigin></script>`
		}
	</head>
	<body>
		<div id="root">${markup}</div>
	</body>
</html>`)
	}
})

export { router as rootRouter }
