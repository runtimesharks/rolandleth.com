import React from "react"
import styled from "styled-components"

const LifeAbout = () => {
	return (
		<Container>
			<img
				className="illustration"
				src="/images/progress.svg"
				alt="Woman moving gears"
			/>
			<Greeting>What's this about?</Greeting>
			<p>
				This section of the blog is about personal development. I'll be
				writing about habits, identity change, motivation, productivity and
				all-around improving ourselves.
			</p>
			<p>
				Most of it will be from my own experiences or from the books I read
				and I'll share what worked, what didn't, or where I learned it from.
			</p>
			<p>
				By no means is this a comprehensive guide, but I hope you'll find
				useful info here. I have <strong>a lot</strong> planned to write
				about and, for a start, I'll publish a post every Wednesday.
			</p>
			<p>
				A lot of the motivational videos or articles you can find online are
				by or about successful people. If, at times, you've thought that "of
				course, they're rich/successful, it's easy for them", then you're
				not alone; I have as well.
			</p>
			<p>
				I don't have the worry of tomorrow, and I don't want to hide or deny
				that, but I'm by no means famous, nor wealthy. Yet, following the
				same principles/advices, I <strong>did</strong> change and I
				improved my life quite a lot, it's getting easier and easier and I'm
				now constantly on the lookout for things I can improve.
			</p>
			<p>
				This is one of the reasons I started this section: to give
				confidence to other people that this kind of change{" "}
				<strong>is</strong> possible by everyone.
			</p>
		</Container>
	)
}

const Container = styled.div`
	img.illustration {
		display: block;
		margin: auto;
		padding-bottom: 1em;
		box-shadow: none;
		max-width: 300px;
	}
`
const Greeting = styled.h1``

export default LifeAbout
