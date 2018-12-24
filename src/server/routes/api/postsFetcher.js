import Db from "../../lib/db"
import DbConfig from "../../models/dbConfig"

async function fetchPosts(section, req, res) {
	const config = DbConfig.page(req.query.page || 1, section)
	const result = await Db.fetchPosts(config)

	res.send(result)
}

async function fetchPost(link, section, res) {
	const result = await Db.fetchPost(link, section)
	const [post] = result.posts

	res.send(post)
}

export { fetchPosts, fetchPost }
