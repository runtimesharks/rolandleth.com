import express from "express"
import fetchPosts from "./postsFetcher"

const router = express.Router()

router.get("/posts", async (req, res) => {
	fetchPosts("tech", res)
})

export { router as apiRouter }
