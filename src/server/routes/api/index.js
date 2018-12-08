import express from "express"
import { techRouter } from "./tech"

const router = express.Router()

router.use("/tech", techRouter)

export { router as apiRouter }
