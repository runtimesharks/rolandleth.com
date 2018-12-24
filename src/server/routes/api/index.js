import express from "express"
import { techRouter } from "./tech"
import { lifeRouter } from "./life"

const router = express.Router()

router.use("/tech", techRouter)
router.use("/life", lifeRouter)

router.post("/create-post-token", async (req, res) => {
	const isTokenValid =
		process.env.NODE_ENV !== "production" ||
		req.body.token === process.env.CREATE_POST_KEY

	const status = isTokenValid ? 200 : 404

	res.sendStatus(status)
})

export { router as apiRouter }
