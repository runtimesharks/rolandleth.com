import express from "express"
import { rootRouter } from "./root"
import { apiRouter } from "./api/index"
import { downloadsRouter } from "./downloads"
import { lifeRouter } from "./life"
import { techRouter } from "./tech"
import createFeed from "../lib/feed"

const router = express.Router()

router.get("/feed", async (req, res) => {
	createFeed("tech", req, res)
})
router.get("/life", lifeRouter)
router.use("/tech", techRouter)
router.use("/api", apiRouter)
router.get("/downloads", downloadsRouter)
router.use("/*", rootRouter)

export default router
