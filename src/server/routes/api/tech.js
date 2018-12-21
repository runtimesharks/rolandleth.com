import express from "express"
import { fetchPosts, fetchPost } from "./postsFetcher"
import search from "./search"
import fetchArchivedPosts from "./archive"

const router = express.Router()

router.get("/posts", async (req, res) => {
	fetchPosts("tech", req, res)
})

router.get("/posts/:link", async (req, res) => {
	fetchPost(req.params.link, res)
})

router.get("/search", async (req, res) => {
	search("tech", req, res)
})

router.get("/archive", async (req, res) => {
	fetchArchivedPosts("tech", res)
})

export { router as techRouter }
