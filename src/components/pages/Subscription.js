import React from "react"
import styled from "styled-components"
import { withRouter } from "react-router"
import Link from "../link/Link"

const Subscription = (props) => {
	const section = props.location.pathname.split("/")[1]
	const id = section === "tech" ? "7e4ef109bd" : "1e005d7f13"
	const url = `https://rolandleth.us19.list-manage.com/subscribe?u=0d9e49508950cd57917dd7e87&id=${id}`

	return (
		<Container>
			<Link href={url} text="Subscribe" /> to my monthly newsletter.
			<br />
			No spam, unsubscribe at any time.
		</Container>
	)
}

const Container = styled.div`
	display: block;
	margin: 60px auto 0 auto;
	max-width: 400px;
	text-align: center;
`

export default withRouter(Subscription)
