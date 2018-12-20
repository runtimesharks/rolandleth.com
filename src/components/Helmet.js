import React from "react"
import { Helmet as ReactHelmet } from "react-helmet"

class Helmet extends React.Component {
	titleSuffix = () => {
		return this.props.title === "" ? "" : `: ${this.props.title}`
	}

	ogExtraFields = () => {
		if (this.props.isoDate) {
			return (
				<React.Fragment>
					<meta property="og:type" content="article" />
					<meta
						property="article:published_time"
						content={this.props.isoDate}
					/>
				</React.Fragment>
			)
		} else {
			return <meta property="og:type" content="blog" />
		}
	}

	render() {
		// We pass this from the server when using SSR.
		let location = this.props.location

		// We use the `window`'s location when rendering on the client.
		// Used when we need the full URL, like canonical or OG tags.
		if (typeof window !== "undefined") {
			location = window.location.href
		}

		return (
			<ReactHelmet>
				<title>{"Roland Leth" + this.titleSuffix()}</title>
				<link rel="shortcut icon" href="/favicon.ico" />
				<link rel="canonical" href={location} />
				<link
					rel="icon"
					href="/images/favicons/192x192.png"
					type="image/png"
					sizes="192x192"
				/>
				{/* Android */}
				<link
					rel="apple-touch-icon-precomposed"
					href="/images/favicons/180x180.png"
					sizes="180x180"
				/>
				{/* Links */}
				<link rel="author" type="text/plain" href="/humans.txt" />
				<link
					rel="alternate"
					href="https://rolandleth.com"
					title="Roland Leth"
					type="application/atom+xml"
				/>
				<link rel="micropub" href="https://rolandleth.com/micropub" />
				{/* Me Links */}
				<link rel="me" href="https://micro.blog/rolandleth" />
				<link rel="me" href="https://twitter.com/rolandleth" />
				<link rel="me" href="https://github.com/rolandleth" />
				{/* IndieAuth */}
				<link
					rel="authorization_endpoint"
					href="https://indieauth.com/auth"
				/>
				<link
					rel="token_endpoint"
					href="https://tokens.indieauth.com/token"
				/>
				{/* Metadata */}
				<meta name="description" content={this.props.description} />
				<meta name="author" content="Roland Leth" />
				{/* OG */}
				<meta property="og:title" content={this.props.title} />
				<meta
					property="og:image"
					content="https://rolandleth.com/images/favicons/200x200.png"
				/>
				<meta property="og:description" content={this.props.description} />
				<meta property="og:url" content={location} />
				<meta property="og:site_name" content="Roland Leth's blog" />
				{this.ogExtraFields()}
				{/* Twitter */}
				<meta property="twitter:title" content={this.props.title} />
				<meta
					property="twitter:image"
					content="https://rolandleth.com/images/favicons/200x200.png"
				/>
				<meta
					property="twitter:description"
					content={this.props.description}
				/>
				<meta property="twitter:url" content={location} />
				{/* Mobile settings */}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
				<meta name="HandheldFriendly" content="true" />
				<meta name="MobileOptimized" content="375" />
			</ReactHelmet>
		)
	}
}

Helmet.defaultProps = {
	title: "",
	description: "iOS, JS and self-improvement thoughts by Roland Leth"
}

export default Helmet
