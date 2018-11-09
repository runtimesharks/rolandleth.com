import { createGlobalStyle } from "styled-components"
import Theme from "./Theme"

export const GlobalStyle = createGlobalStyle`
	@import url('https://fonts.googleapis.com/css?family=Titillium+Web:700"');

	body {
		padding: 0 32px;
		color: ${Theme.textColor};
		background: #fff;
		font-family: ${Theme.bodyFont};
		font-size: 17px;
		line-height: 1.65;

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

	header {
		font-family: ${Theme.headerFont};
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
		border-bottom: 1px dotted ${Theme.linkColor};

		${Theme.transition("0.4s")};
	}

	p {
		& > a {
			&:hover {
				border-bottom: 1px solid ${Theme.linkColor};
			}
		}

		&.no-margin {
			margin: 0;
		}
	}

	em {
		font-style: italic;
	}

	img {
		&:not(.codementor):not(.patreon) {
			border-radius: 2px;
			-webkit-box-shadow: #777777 0 0 3px 1px;
			-moz-box-shadow: #444444 0 0 3px 1px; /* color, h-offset, v-offset, blur, spread */
			box-shadow: #777777 0 0 7px 0; /* inset is optional */
		}

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

	em {
		font-style: italic;
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
