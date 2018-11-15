import React from "react"
import styled, { css } from "styled-components"

const NotFoundPage = (props) => {
	return (
		<NotFound>
			<The404 {...props}>
				<The404Text
					{...props}
					src={require("../../images/misc/404-shadow.png")}
				>
					{props.isSearch ? "uh-oh" : "404"}
				</The404Text>
			</The404>
			<Message>
				{props.isSearch
					? "No results found."
					: "This isn't the page you are looking for."}
			</Message>
		</NotFound>
	)
}

const NotFound = styled.div``

const The404 = styled.h1`
	display: block;
	margin: 0 auto;
	font-weight: bold;
	text-align: center;
	color: $textColor;
	font-size: ${(props) => (props.isSearch ? "10em" : "13em")};

	@media screen and (max-width: 647px) {
		font-size: ${(props) => (props.isSearch ? "8em" : "11em")};
	}

	@media screen and (max-width: 500px) {
		font-size: ${(props) => (props.isSearch ? "6em" : "9em")};
	}

	@media screen and (max-width: 365px) {
		font-size: ${(props) => (props.isSearch ? "5em" : "8em")};
	}
`

const The404Text = styled.span`
	position: relative;
	display: inline-block;

	&:before {
		${(props) =>
			props.isSearch
				? css`
						left: 12%;
						max-width: 380px;

						@media screen and (max-width: 647px) {
							left: 4%;
						}

						@media screen and (max-width: 500px) {
							left: 9%;
							max-width: 250px;
						}

						@media screen and (max-width: 365px) {
							left: 5%;
						}
				  `
				: css`
						left: 0;
						max-width: 425px;
				  `}

		position: absolute;
		background-image: url(${(props) => props.src});
		background-size: 100%;

		top: 80%;
		right: 0;
		height: 36px;
		content: "";
	}
`

const Message = styled.p`
	max-width: 450px;
	font-size: 1.3em;
	line-height: 1.3em;
	margin: 20px auto;
	text-align: center;

	@media screen and (max-width: 647px) {
		font-size: 1.2em;
	}
`

export default NotFoundPage
