import React from "react"
import Link from "../link/Link"

const NotFoundPage = () => {
	return (
		<div className="not-found">
			<h1>404</h1>
			<h2>Page not found!</h2>
			<p>
				<Link href="/" title="Go back to the main page" text="Home" />
			</p>
		</div>
	)
}

export default NotFoundPage
