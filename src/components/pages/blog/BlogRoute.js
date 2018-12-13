import React from "react"
import { Route } from "react-router-dom"
import Blog from "./Blog"

const BlogRoute = (props) => {
	return (
		<Route
			exact
			path={`/${props.section}/blog/:postLink?`}
			render={() => {
				const rawPage = new URLSearchParams(props.location.search).get(
					"page"
				)
				const page = parseInt(rawPage, 10) || 1

				return (
					<Blog
						section={props.section}
						searchTerm={props.searchTerm}
						key={`${props.section}-${page}`}
						page={page}
					/>
				)
			}}
		/>
	)
}

export default BlogRoute
