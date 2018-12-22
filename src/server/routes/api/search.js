import Db from "../../lib/db"

async function search(section, req, res) {
	const query = req.query.query || ""
	const page = req.query.page || 1
	const result = await Db.searchPosts(query, page, section)

	res.setHeader("Content-Type", "application/javascript")
	res.send(result)
}

export default search
