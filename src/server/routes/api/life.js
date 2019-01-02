import express from "express"
import { fetchPosts, fetchAllPosts, fetchPost } from "./postsFetcher"
import search from "./search"
import fetchArchivedPosts from "./archive"
import createPost from "./postCreator"

const router = express.Router()

router.get("/posts", async (req, res) => {
	fetchPosts("life", req, res)
})

router.get("/all-posts", async (_, res) => {
	fetchAllPosts("life", res)
})

router.post("/posts", async (req, res) => {
	createPost("life", req, res)
})

router.get("/posts/:link", async (req, res) => {
	fetchPost(req.params.link, "life", res)
})

router.get("/search", async (req, res) => {
	search("life", req, res)
})

router.get("/archive", async (req, res) => {
	fetchArchivedPosts("life", res)
})

export { router as lifeRouter }
