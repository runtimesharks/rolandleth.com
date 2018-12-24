import Db from "../../lib/db"
import marked from "marked"
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
			req.body.post.title,
			marked(req.body.post.body),
			req.body.post.body,
			undefined,
			undefined,
			1,
			req.body.post.date,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			true
		)

		await Db.createPost(post, section)

		res.send({ post })
	} catch (e) {
		res.status(400).send(e.message)
	}
}

export default createPost
