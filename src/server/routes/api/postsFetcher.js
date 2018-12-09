import Db from "../../lib/db"
import DbConfig from "../../models/dbConfig"

async function fetchPosts(section, req, res) {
	const config = DbConfig.page(req.query.page || 1)
	config.section = section

	const result = await Db.fetchPosts(config)
	const posts = result.posts

	setJSHeaderTo(res)
	res.send(posts)
}

async function fetchPost(link, res) {
	const result = await Db.fetchPost(link)
	const [post] = result.posts

	setJSHeaderTo(res)
	res.send(post)
}

function setJSHeaderTo(res) {
	res.setHeader("Content-Type", "application/javascript")
}

export { fetchPosts, fetchPost }
