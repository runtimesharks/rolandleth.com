import express from "express"
import { fetchPosts, fetchPost } from "./postsFetcher"

const router = express.Router()

router.get("/posts", async (req, res) => {
	fetchPosts("tech", req, res)
})

router.get("/posts/:link", async (req, res) => {
	fetchPost(req.params.link, res)
})

export { router as techRouter }
