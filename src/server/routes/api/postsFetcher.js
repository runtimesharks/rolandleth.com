import Db from "../../lib/db"
import DbConfig from "../../models/dbConfig"

async function fetchPosts(section, req, res) {
	try {
		const config = DbConfig.page(req.query.page || 1, section)
		const result = await Db.fetchPosts(config)

		res.send(result)
	} catch (e) {
		res.status(400).send(e.message)
	}
}

async function fetchPost(link, section, res) {
	try {
		const result = await Db.fetchPost(link, section)
		const [post] = result.posts

		res.send(post)
	} catch (e) {
		res.status(400).send(e.message)
	}
}

export { fetchPosts, fetchPost }
