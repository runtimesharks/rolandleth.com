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
			req.body.post.datetime,
			req.body.post.summary,
			req.body.post.imageURL
		)

		const existingPosts = await Db.fetchPost(post.link, section)

		if (existingPosts.posts.length > 0) {
			await Db.updatePost(post, section)
		} else {
			await Db.createPost(post, section)
		}

		res.send({ post })
	} catch (e) {
		console.info(e)
		res.status(400).send(e.message)
	}
}

export default createPost
