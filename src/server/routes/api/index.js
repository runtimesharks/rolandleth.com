import express from "express"
import { techRouter } from "./tech"
import { lifeRouter } from "./life"

const router = express.Router()

router.use("/tech", techRouter)
router.use("/life", lifeRouter)

export { router as apiRouter }
