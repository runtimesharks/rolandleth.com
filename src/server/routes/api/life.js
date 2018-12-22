import express from "express"
import { fetchPosts, fetchPost } from "./postsFetcher"
import search from "./search"
import fetchArchivedPosts from "./archive"
import createPost from "./postCreator"

const router = express.Router()

router.get("/posts", async (req, res) => {
	fetchPosts("life", req, res)
})

router.post("/post", async (req, res) => {
	createPost("life", req, res)
})

router.get("/posts/:link", async (req, res) => {
	fetchPost(req.params.link, res)
})

router.get("/search", async (req, res) => {
	search("tech", req, res)
})

router.get("/archive", async (req, res) => {
	fetchArchivedPosts("life", res)
})

export { router as lifeRouter }
