import Db from "../../lib/db"
import Post from "../../models/post"

async function createPost(section, req, res) {
	const isTokenValid =
		process.env.NODE_ENV !== "production" ||
		req.body.token === process.env.CREATE_POST_KEY

	if (isTokenValid === false) {
		res.sendStatus(404)
	}

	try {
		const post = new Post(
			true,
			req.body.post.title,
			req.body.post.body,
			req.body.post.datetime
		)

		await Db.createPost(post, section)

		res.send({ post })
	} catch (e) {
		res.status(400).send(e.message)
	}
}

export default createPost
