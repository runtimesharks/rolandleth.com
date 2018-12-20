import express from "express"
import router from "./server/routes/router"

const server = express()

server
	.disable("x-powered-by")
	.use(express.static(process.env.RAZZLE_PUBLIC_DIR))
	.use("/", router)

export default server
