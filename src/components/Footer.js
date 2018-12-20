import React from "react"
import styled from "styled-components"
import Theme from "./theme/Theme"
import UnderlineOnHoverLink from "./link/UnderlineOnHoverLink"

const quotes = [
	"Tables turn, bridges burn, you live and learn",
	"Dream big, if you dare to dream",
	"Your time is limited, so don't waste it living someone else's life",
	"Be yourself, everyone else is taken",
	"Whether you think you can or can not, you are right",
	"Avoid the trap of thinking you have something to lose",
	'A lot can happen between now and "never"',
	"Don’t wish it was easier, wish you were better"
]
const emojis = ["💤", "🌟", "💭", "🗿", "👣", "🐶", "🦄", "🏇🏻"]

class Footer extends React.Component {
	random = (max) => {
		return Math.floor(Math.random() * max)
	}

	render() {
		const emoji = emojis[this.random(emojis.length)]
		const quote = quotes[this.random(quotes.length)]
		const year = new Date().getFullYear()

		return (
			<Container role="contentinfo">
				<Quote>
					{emoji} &nbsp;&nbsp; {quote}
				</Quote>
				<Copyright>
					&copy; 2013&ndash;{year} &nbsp;
					<UnderlineOnHoverLink href="/" text="Roland Leth" title="Home" />
					{/* &nbsp;&mdash;&nbsp;
					<Link href="/microblog" text="Microblog" />
					&nbsp;&mdash;&nbsp;
					<Link href="/archive" text="Archive" /> */}
				</Copyright>
			</Container>
		)
	}
}

const Container = styled.footer`
	max-width: ${Theme.maxWidth};
	margin: 3em auto 1em;
	text-align: center;
	color: ${Theme.gray};
	line-height: 1.5em;
`

const Copyright = styled.div`
	margin-bottom: 0.5em;
`

const Quote = styled.div`
	font-weight: 200;
	font-style: italic;
	font-family: ${Theme.lightFont};
	margin-bottom: 0.5em;
`

export default Footer
