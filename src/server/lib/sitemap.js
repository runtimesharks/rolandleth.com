import Db from "./db"

async function createSitemap(res) {
	const noPriority = ["privacy-policy", "feed", "tech/feed", "life/feed"]
	const highPriority = ["about", "life/about"]
	const urls = noPriority.concat(highPriority)
	const rootPath = "https://rolandleth.com/"
	let xml = ""

	xml += `<?xml version="1.0" encoding="UTF-8"?>`
	xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

	urls.forEach(function(url) {
		const priority = highPriority.includes(url) ? 0.9 : 0.1
		xml += "<url>"
		xml += `<loc>${rootPath}${url}</loc>`
		xml += "<changefreq>yearly</changefreq>"
		xml += `<priority>${priority}</priority>`
		xml += "</url>"
	})

	try {
		const techData = await Db.fetchSiteMapPosts("tech")
		const lifeData = await Db.fetchSiteMapPosts("life")
		const data = [
			{ section: "life", posts: lifeData.posts },
			{ section: "tech", posts: techData.posts }
		]

		data.forEach((object) => {
			object.posts.forEach((post) => {
				const datetime = post.modified.slice(0, -5)

				xml += "<url>"
				xml += `<loc>${rootPath}${object.section}/blog/${post.link}</loc>`
				xml += "<changefreq>monthly</changefreq>"
				xml += "<priority>0.5</priority>"
				xml += `<lastmod>${datetime}</lastmod>`
				xml += "</url>"
			})
		})

		xml += "</urlset>"

		res.header("Content-Type", "text/xml")
		res.send(xml)
	} catch (e) {
		res.status(400).send(e.message)
	}
}

export default createSitemap
