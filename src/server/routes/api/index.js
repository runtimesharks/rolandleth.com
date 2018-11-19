import express from "express"
import Db from "../../lib/db"
import DbConfig from "../../models/dbConfig"

const router = express.Router()

router.get("/tech/posts", async (req, res) => {
	const config = DbConfig.page(req.query.page || 1)
	const result = await Db.fetchPosts(config)
	const posts = result.posts

	res.send(posts)
})

export { router as apiRouter }
