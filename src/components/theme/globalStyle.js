import { injectGlobal } from "styled-components"
import Theme from "./Theme"

injectGlobal`
	@import url('https://fonts.googleapis.com/css?family=Titillium+Web:700"');

	body {
		padding: 0 14px;
		color: ${Theme.textColor};
		background: #fff;
		font-family: ${Theme.bodyFont};
		font-size: 17px;
		line-height: 1.5;

		max-width: ${Theme.maxWidth};
		margin: 0 auto;
	}

	li {
		list-style: disc inside;

		> ul > li {
			padding-left: 1.5em;
			list-style-type: circle;
		}
	}

	h1 {
		font-size: 1.85em;
		font-weight: normal;
		display: inline-block;
		font-family: ${Theme.headerFont};
		line-height: 1.2em;
		color: ${Theme.textColor};
	}

	h4 {
		font-family: ${Theme.headerFont};
		padding-left: 2px;
		margin-bottom: 20px;
		color: $gray;
		font-weight: 500;
		font-style: italic;
		font-size: 0.75em;
	}

	a {
		text-decoration: none;
		color: ${Theme.linkColor};
		border-bottom: 1px solid transparent;
		padding-bottom: 2px;

		${Theme.transition("border", "0.4s")};

		&:hover {
			border-bottom-color: ${Theme.linkColor};
		}
	}

	p {
		&.no-margin {
			margin: 0;
		}
	}

	em {
		font-style: italic;
	}

	img {
		border-radius: 2px;
		-webkit-box-shadow: #777777 0 0 3px 1px;
		-moz-box-shadow: #444444 0 0 3px 1px; /* color, h-offset, v-offset, blur, spread */
		box-shadow: #777777 0 0 7px 0; /* inset is optional */

		&:not([class]) {
			display: table;
			margin: 10px auto;
		}

		.centered & {
			display: inline;
			margin: 10px;
		}

		.centered-image-wrapper & {
			margin: 0 auto;
		}
	}

	strong {
		font-weight: bold;
	}

	.mark {
		background-color: yellow;
		color: black;
	}

	.centered {
		text-align: center;
	}

	.subtitle {
		font-size: 0.8em;
		color: #bcbcbc;
		margin-top: -1em;
		margin-bottom: 0.75em;
	}
`
