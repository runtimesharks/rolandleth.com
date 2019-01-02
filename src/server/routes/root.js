import App from "../../App"
import React from "react"
import Helmet from "react-helmet"
import { StaticRouter } from "react-router-dom"
import express from "express"
import { renderToString } from "react-dom/server"
import { ServerStyleSheet } from "styled-components"
import Db from "../lib/db"

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)
const router = express.Router()

router.get("/*", async (req, res) => {
	const post = await fetchPostIfRequired(req.originalUrl)
	const context = {}
	const location = `https://${req.hostname}${req.originalUrl}`
	const isProduction = process.env.NODE_ENV === "production"
	const sheet = new ServerStyleSheet()
	const markup = renderToString(
		sheet.collectStyles(
			<StaticRouter context={context} location={req.originalUrl}>
				<App location={location} post={post} /> {/* For meta tags*/}
			</StaticRouter>
		)
	)
	const styleTags = sheet.getStyleTags()
	const helmet = Helmet.renderStatic()
	const allHelmetDataAsString = Object.keys(helmet)
		.map((key) => helmet[key].toString())
		.filter((o) => o !== "" && o !== undefined)
		.join("\n")

	if (context.url) {
		res.redirect(context.url)
	} else {
		setCSPHeaders(res, isProduction)
		res.status(200).send(`
<!doctype html>
<html lang="">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		${allHelmetDataAsString}
		${styleTags}
		${
			assets.client.css
				? `<link rel="stylesheet" href="${assets.client.css}">`
				: ""
		}
		${
			isProduction
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

async function fetchPostIfRequired(url) {
	const split = url.split("/")

	if (split.length < 3 || split[2] !== "blog") {
		return undefined
	}

	const section = split[1]
	const link = split[3]
	const result = await Db.fetchPost(link, section)

	return result.posts[0]
}

// This is for testing, only.
function setCSPHeaders(res, isProduction) {
	if (isProduction || true) {
		return
	}

	const localhost = "localhost:3001"
	const localhostWithProtocol = `http://${localhost}`

	const csp = {
		"default-src": ["'none'"],
		"connect-src": ["'self'", localhostWithProtocol, `ws://${localhost}`],
		"frame-ancestors": ["'none'"],
		"base-uri": ["'self'"],
		"font-src": [
			"'self'",
			"https://fonts.gstatic.com",
			"https://fonts.googleapis.com"
		],
		"style-src": [
			"'self'",
			"'unsafe-inline'",
			"https://fonts.googleapis.com"
		],
		"img-src": [
			"'self'",
			localhostWithProtocol,
			"https://www.google-analytics.com",
			"https://cdn.codementor.io/badges/book_session_github.svg"
		],
		"script-src": [
			"'self'",
			localhostWithProtocol,
			"https://www.google-analytics.com"
		],
		"form-action": ["'self'"]
	}

	res.setHeader(
		"Content-Security-Policy",
		Object.keys(csp).map((key) => {
			return `${key} ${csp[key].join(" ")};`
		})
	)
}

export { router as rootRouter }
