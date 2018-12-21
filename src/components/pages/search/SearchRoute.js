import React from "react"
import Search from "./Search"

const SearchRoute = (props) => {
	const rawPage = new URLSearchParams(props.location.search).get("page")
	const page = parseInt(rawPage, 10) || 1

	return (
		<Search {...props} key={`${props.section}-search-${page}`} page={page} />
	)
}

export default SearchRoute
