/**
 * Created by roland on 24.09.2016.
 */

"use strict"

function trimTrailingSlash(string) {
	if (string.slice(-1) === "/") {
		return string.slice(0, -1)
	}
	
	return string
}

class Helpers {
	
	/**
	 * Redirects http calls to https and www to naked.
	 */
	static secureAndNakedRedirect(req, res, next) {
		if (Helpers.development) {
			next();
			return
		}
		
		// This is specific to Heroku's SSL handling.
		const insecure = req.headers["x-forwarded-proto"] !== "https" //req.protocol === "http" ||
		if (insecure || req.headers.host === "www.rolandleth.com") {
			res.redirect("https://rolandleth.com" + trimTrailingSlash(req.url))
			return
		}
		
		next()
	}
	
	/**
	 * Sets res.locals.path to the current path, without a possible trailing slash.
	 * This way no 301 are required for indexing.
	 */
	static setCanonicalMeta(req, res, next) {
		res.locals.path = trimTrailingSlash(req.path)
		next()
	}
	
	/**
	 * Adds headers that disable the embedding of the site in an external one.
	 */
	static setDisableEmbeddingHeaders(req, res, next) {
		res.setHeader("Content-Security-Policy", "frame-ancestors 'none'") // Future proof.
		res.setHeader("X-Frame-Options", "DENY") // Old and current.
		next()
	}
	
	/**
	 * Adds cache settings.
	 */
	static setCachePolicy(req, res, next) {
		let age = 0
		if (req.path.indexOf("gif") !== -1) {
			age = 86400 * 30 // A month for trustlogo gifs.
		}
		else if (req.path === "/") {
			age = 0 // None for the main page.
		}
		else {
			age = 86400 // A day for pages and posts.
		}
		
		res.setHeader("Cache-Control", "public, max-age=" + age)
		next()
	}
	
}

/**
 * Checks if the ENV_TYPE == "development".
 */
Helpers.development = process.env.ENV_TYPE === "development"

module.exports = Helpers
