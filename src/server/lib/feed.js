import Db from "../lib/db"
import Post from "../models/post"

async function createFeed(section, req, res) {
	const data = await Db.fetchFeedPosts()
	const year = new Date().getFullYear()
	const updated = new Date().toISOString()
	const baseUrl = req.protocol + "://" + req.headers.host
	const sectionUrl = baseUrl + `/${section}`
	let xml = ""

	xml += '<?xml version="1.0" encoding="utf-8"?>\n'
	xml += '<feed xmlns="http://www.w3.org/2005/Atom">\n'
	xml += '<title type="text">Roland Leth</title>\n'
	xml += `<subtitle type="text">${
		section === "tech"
			? "Development thoughts by Roland Leth"
			: "Life and self improvement thoughts by Roland Leth"
	}</subtitle>\n`
	xml += `<updated>${updated}</updated>\n`
	xml += "<author>\n\t<name>Roland Leth</name>\n</author>\n"
	xml += `<link rel="self" type="application/atom+xml" href="${baseUrl}/feed"/>\n`
	xml += `<link rel="alternate" type="text/html" hreflang="en" href="${baseUrl}"/>\n`
	xml += `<id>${sectionUrl}/feed</id>\n`
	xml += `<icon>${baseUrl}/images/favicons/192x192.png</icon>\n`
	xml += `<rights>Copyright (c) 2013–${year}, Roland Leth</rights>\n`

	data.posts.forEach((post) => {
		const url = sectionUrl + "/blog/" + post.link
		const isoDate = Post.dateFromDateTime(post.datetime).toISOString()

		xml += "<entry>\n"
		xml += `\t<id>${url}</id>\n`

		if (post.title) {
			xml += `\t<title>${post.title}</title>\n`
		}

		xml += `\t<link rel=\"related\" type=\"text/html\" href=\"${url}\"/>\n`
		xml += `\t<link rel=\"alternate\" type=\"text/html\" href=\"${url}\"/>\n`

		xml += `\t<published>${isoDate}</published>\n`

		xml += "\t<author>\n"
		xml += `\t\t<name>${post.author || "Roland Leth"}</name>\n`

		if (section === "micro") {
			xml += "\t\t<uri>https://micro.blog/rolandleth</uri>\n"
		} else {
			xml += `\t\t<uri>${baseUrl}</uri>\n`
		}

		xml += "\t</author>\n"
		xml += '\t<content type="html" xml:lang="en"><![CDATA[\n'
		xml += post.body
		xml += "]]></content>\n"
		xml += "</entry>\n"
	})

	xml += "</feed>"

	res.header("Content-Type", "text/xml")
	res.send(xml)
}

export default createFeed
