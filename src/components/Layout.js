import React from "react"
import styled from "styled-components"
import Theme from "./theme/Theme"
import SiteHeader from "./site-header/SiteHeader"

const Layout = (props) => {
	return (
		<React.Fragment>
			<SiteHeader />
			<Content>{props.children}</Content>
		</React.Fragment>
	)
}

export default Layout

const Content = styled.div`
	margin: 6em 0 0.5em 2px;

	@media screen and (max-width: ${Theme.phoneMedia}) {
		padding-top: 4em;
		padding-bottom: 0;
	}
`
