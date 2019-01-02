import express from "express"
import { fetchPosts, fetchAllPosts, fetchPost } from "./postsFetcher"
import search from "./search"
import fetchArchivedPosts from "./archive"
import createPost from "./postCreator"

const router = express.Router()

router.get("/posts", async (req, res) => {
	fetchPosts("tech", req, res)
})

router.get("/all-posts", async (_, res) => {
	fetchAllPosts("tech", res)
})

router.post("/posts", async (req, res) => {
	createPost("tech", req, res)
})

router.get("/posts/:link", async (req, res) => {
	fetchPost(req.params.link, "tech", res)
})

router.get("/search", async (req, res) => {
	search("tech", req, res)
})

router.get("/archive", async (req, res) => {
	fetchArchivedPosts("tech", res)
})

export { router as techRouter }
