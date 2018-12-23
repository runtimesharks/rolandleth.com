import React from "react"
import { Switch, Route } from "react-router-dom"
import Archive from "../pages/archive/Archive"
import NotFoundPage from "../pages/NotFound"
import FeedRoute from "./FeedRoute"
import CreatePost from "../pages/CreatePost"

const CommonRoutes = (props) => {
	// We match here with a path of either `/tech`, or `/life`.
	const section = props.path.substring(1, props.path.length)
	const feedRoutes = [`${props.path}/search`, `${props.path}/blog/:postLink?`]
	const createPostKey = process.env.RAZZLE_CREATE_POST_KEY || "roland1"

	return (
		<Switch>
			<Route
				exact
				path={feedRoutes}
				// This requires props because `Search` requires the `query` param.
				render={(p) => <FeedRoute {...p} {...props} section={section} />}
			/>
			<Route
				exact
				path={`${props.path}/archive`}
				render={() => <Archive section={section} />}
			/>
			<Route
				exact
				path={`${props.path}/create-post/${createPostKey}`}
				render={(p) => {
					if (process.env.NODE_ENV === "production") {
						return <NotFoundPage />
					}

					return <CreatePost {...props} />
				}}
			/>
			<Route path="*" component={NotFoundPage} />
		</Switch>
	)
}

export default CommonRoutes
