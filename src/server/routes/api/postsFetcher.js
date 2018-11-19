import Db from "../../../lib/db"
import DbConfig from "../../../models/dbConfig"

async function fetchPosts(section, res) {
	const config = DbConfig.page(req.query.page || 1)
	const result = await Db.fetchPosts(config)
	const posts = result.posts

	res.send(posts)
}

export default fetchPosts
