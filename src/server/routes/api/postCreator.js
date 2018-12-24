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

	const post = new Post(
		req.body.title,
		marked(req.body.body),
		req.body.body,
		undefined,
		undefined,
		1,
		req.body.date,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		true
	)

	await Db.createPost(post, section)

	res.send({ post })
}

export default createPost
