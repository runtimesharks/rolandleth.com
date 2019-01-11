import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import Archive from "../pages/archive/Archive"
import NotFoundPage from "../pages/NotFound"
import FeedRoute from "./FeedRoute"
import CreatePost from "../pages/CreatePost"

const CommonRoutes = (props) => {
	// We match here with a path of either `/tech`, or `/life`.
	const section = props.path.substring(1, props.path.length)
	const feedRoutes = [`${props.path}/search`, `${props.path}/blog/:postLink?`]

	return (
		<Switch>
			{/* For now, just redirect the base path to the blog. */}
			<Route exact path={`/${section}`}>
				<Redirect to={`/${section}/blog`} />
			</Route>
			<Route
				exact
				path={feedRoutes} // This requires props because `Search` requires the `query` param.
				render={(p) => <FeedRoute {...p} {...props} section={section} />}
			/>
			<Route
				exact
				path={`${props.path}/archive`}
				render={() => <Archive section={section} />}
			/>
			<Route
				exact
				path={`${props.path}/create-post/:token?`}
				render={() => <CreatePost {...props} />}
			/>
			<Route path="*" component={NotFoundPage} />
		</Switch>
	)
}

export default CommonRoutes
