import express from "express"
import createFeed from "../lib/feed"

const router = express.Router()

router.get("/feed", async (req, res) => {
	createFeed("tech", req, res)
})

export { router as techRouter }
