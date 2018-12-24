import Db from "./db"

async function createSitemap(res) {
	const noPriority = ["privacy-policy", "feed"]
	const lowPriority = [
		"tech/projects/bouncyb",
		"tech/projects/sosmorse",
		"tech/projects/iwordjuggle",
		"tech/projects/carminder"
	]
	const highPriority = ["about"]
	const urls = noPriority.concat(lowPriority).concat(highPriority)

	const rootPath = "https://rolandleth.com/tech/blog/"
	let xml =
		'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

	urls.forEach(function(url) {
		const priority = highPriority.includes(url)
			? 0.9
			: lowPriority.includes(url)
			? 0.3
			: 0.1
		xml += "<url>"
		xml += "<loc>" + rootPath + url + "</loc>"
		xml += "<changefreq>" + "yearly" + "</changefreq>"
		xml += "<priority>" + priority + "</priority>"
		xml += "</url>"
	})

	try {
		const data = await Db.fetchSiteMapPosts()

		data.posts.forEach(function(post) {
			const datetime = post.modified.slice(0, -5)

			xml += "<url>"
			xml += "<loc>" + rootPath + post.link + "</loc>"
			xml += "<changefreq>" + "monthly" + "</changefreq>"
			xml += "<priority>" + 0.5 + "</priority>"
			xml += "<lastmod>" + datetime + "</lastmod>"
			xml += "</url>"
		})

		xml += "</urlset>"

		res.header("Content-Type", "text/xml")
		res.send(xml)
	} catch (e) {
		res.status(400).send(e.message)
	}
}

export default createSitemap
