import Db from "../../lib/db"

async function fetchArchivedPosts(section, res) {
	const data = await Db.fetchArchivePosts(section)
	let groupedPosts = {}

	data.posts.forEach((post) => {
		const matches = post.datetime.match(/(\d{4})-(\d{2})-(\d{2})-(\d{4})/)
		const year = "_" + matches[1] // Just so it is forced as a string, thus ordered
		const title = post.title
		const link = post.link

		if (!groupedPosts[year]) {
			groupedPosts[year] = []
		}

		groupedPosts[year].push({
			title: title,
			link: link
		})
	})

	res.setHeader("Content-Type", "application/javascript")
	res.send(groupedPosts)
}

export default fetchArchivedPosts
