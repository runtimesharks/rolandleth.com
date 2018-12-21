import React from "react"
import Blog from "./Blog"

const BlogRoute = (props) => {
	const rawPage = new URLSearchParams(props.location.search).get("page")
	const page = parseInt(rawPage, 10) || 1

	return <Blog {...props} key={`${props.section}-blog-${page}`} page={page} />
}

export default BlogRoute
