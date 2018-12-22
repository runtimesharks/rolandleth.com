import React from "react"
import Search from "../pages/search/Search"
import Blog from "../pages/blog/Blog"

const FeedRoute = (props) => {
	const rawPage = new URLSearchParams(props.location.search).get("page")
	const page = parseInt(rawPage, 10) || 1

	if (props.match.path.split("/")[2] === "search") {
		return (
			<Search
				{...props}
				key={`${props.section}-search-${page}`}
				page={page}
			/>
		)
	} else {
		return (
			<Blog {...props} key={`${props.section}-blog-${page}`} page={page} />
		)
	}
}

export default FeedRoute
