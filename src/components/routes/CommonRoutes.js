import React from "react"
import { Switch, Route } from "react-router-dom"
import BlogRoute from "../pages/blog/BlogRoute"
import Archive from "../pages/archive/Archive"
import SearchRoute from "../pages/search/SearchRoute"
import NotFoundPage from "../pages/NotFound"

const CommonRoutes = (props) => {
	// We redirect here with a path of either `/tech`, or `/life`.
	const section = props.path.substring(1, props.path.length)

	return (
		<Switch>
			<Route
				exact
				path={`/${section}/search`}
				// This requires props for the `query` param.
				render={(p) => <SearchRoute {...p} {...props} section={section} />}
			/>
			<Route
				exact
				path={`/${section}/archive`}
				render={() => <Archive section={section} />}
			/>
			<Route
				exact
				path={`/${section}/blog/:postLink?`}
				render={(p) => <BlogRoute {...p} section={section} />}
			/>
			<Route path="*" component={NotFoundPage} />
		</Switch>
	)
}

export default CommonRoutes
