import React from "react"
import styled from "styled-components"
import Theme from "../../theme/Theme"
import UnderlineOnHoverLink from "../../link/UnderlineOnHoverLink"

class Pagination extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			gap: 2
		}
	}

	pathWithPage = (page) => {
		let location = this.props.location.pathname
		const query = new URLSearchParams(this.props.location.search).get("query")

		if (query) {
			location += `?query=${query}`
		}

		if ((page || 1) <= 1) {
			return location
		}

		if (query) {
			location += "&"
		} else {
			location += "?"
		}

		location += `page=${page}`

		return location
	}

	leftArrow = (page) => {
		if (page === 1) {
			return <span className="disabled">&larr; Prev</span>
		}

		return (
			<UnderlineOnHoverLink
				className="previous"
				href={this.pathWithPage(page === 2 ? 1 : page - 1)}
				rel="previous"
				text="&larr; Prev"
				title="Previous page"
			/>
		)
	}

	leftGap = (page) => {
		const { gap } = this.state

		if (page <= gap) {
			return ""
		}

		return (
			<React.Fragment>
				<UnderlineOnHoverLink
					href={this.pathWithPage()}
					text="1"
					title="Page 1"
				/>
				{page === gap * 2 ? (
					<UnderlineOnHoverLink
						href={this.pathWithPage(2)}
						text="2"
						title="Page 2"
					/>
				) : (
					""
				)}
				{page > gap * 2 ? <span className="gap">&hellip;</span> : ""}
			</React.Fragment>
		)
	}

	previousPage = (page) => {
		if (page <= 1) {
			return ""
		}

		const previousPage = page - 1

		/* If the current page is 2, prev button links to '/' instead of / 1 */
		/* Also prev pagination - number links to '/' instead of current page - 1 */
		if (page === 2) {
			return (
				<UnderlineOnHoverLink
					href={this.pathWithPage()}
					rel="previous"
					text={previousPage}
					title={`Page ${previousPage}`}
				/>
			)
		} else {
			return (
				<UnderlineOnHoverLink
					href={this.pathWithPage(previousPage)}
					rel="previous"
					text={previousPage}
					title={`Page ${previousPage}`}
				/>
			)
		}
	}

	nextPage = (page) => {
		const nextPage = page + 1
		const pages = this.props.pages || 0
		const preLastPage = pages - 1

		if (page >= preLastPage) {
			return ""
		}

		return (
			<UnderlineOnHoverLink
				href={this.pathWithPage(nextPage)}
				rel="next"
				text={nextPage}
				title={`Page ${nextPage}`}
			/>
		)
	}

	rightGap = (page) => {
		const { gap } = this.state
		const pages = this.props.pages || 0
		const preLastPage = pages - 1

		if (page >= pages - gap) {
			return ""
		}

		if (pages - page + 1 > gap * 2) {
			return <span className="gap">&hellip;</span>
		} else {
			return (
				<UnderlineOnHoverLink
					href={`${preLastPage}`}
					text={preLastPage}
					title={`Page ${preLastPage}`}
				/>
			)
		}
	}

	rightArrow = (page) => {
		const pages = this.props.pages || 0

		if (page >= pages) {
			return <span className="disabled">Next &rarr;</span>
		}

		return (
			<React.Fragment>
				<UnderlineOnHoverLink
					href={this.pathWithPage(pages)}
					text={pages}
					title={`Page ${pages}`}
				/>
				<UnderlineOnHoverLink
					className="next"
					href={this.pathWithPage(page + 1)}
					rel="next"
					text="Next &rarr;"
					title="Next page"
				/>
			</React.Fragment>
		)
	}

	render() {
		const { page } = this.props

		return (
			<Container>
				{this.leftArrow(page)}
				{this.leftGap(page)}
				{this.previousPage(page)}
				<span className="current">{page}</span>
				{this.nextPage(page)}
				{this.rightGap(page)}
				{this.rightArrow(page)}
			</Container>
		)
	}
}

const Container = styled.div`
	text-align: center;
	margin: 0 auto; // Group it with the section
	font-size: 1.1em;

	a {
		padding: 2px 6px;
		margin-right: 0.2em;
	}

	span {
		padding: 2px 6px;
		margin-right: 0.2em;
	}

	span.gap {
		padding: 2px;
		color: ${Theme.gray};
	}

	span.disabled {
		color: ${Theme.gray};
	}

	@media screen and (max-width: ${Theme.navTreshold1}) {
		margin: 1em auto;

		a,
		span.gap {
			margin: 0;
			display: none;
		}

		a.previous,
		a.next,
		a.home-footer {
			display: inline;
		}
	}
`

export default Pagination
