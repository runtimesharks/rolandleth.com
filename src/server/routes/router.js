import express from "express"
import createFeed from "../lib/feed"
import createSitemap from "../lib/sitemap"
import { apiRouter } from "./api/index"
import { lifeRouter } from "./life"
import { rootRouter } from "./root"
import { techRouter } from "./tech"

const router = express.Router()

router.get("/testing-remote", async (_, res) => {
  res.status(200).send({
    name: "Company name",
    version: "2.0",
    map_types: ["Common", "Gmail_API", "WEB", "iOS"],
    old_version: "1.0",
    g: "0b3d53c8-4fa4-4718-8f68-e6b0fee1aac6",
  })
})
router.get("/feed", async (req, res) => {
  createFeed("tech", req, res)
})
router.get("/sitemap.xml", async (_, res) => {
  createSitemap(res)
})

router.use("/life", lifeRouter)
router.use("/tech", techRouter)
router.use("/api", apiRouter)
router.use("/*", rootRouter)

export default router
