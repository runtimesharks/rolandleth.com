import React from "react"
import styled from "styled-components"
import Theme from "../theme/Theme"
import Link from "../link/Link"

const About = () => (
	<Container>
		<Image src="/images/misc/mypic.jpg" alt="My Picture" />
		<FirstParagraph>
			For the past 8 years, my main occupation has been as an iOS developer.
			I've worked on my own projects, on remote teams, as a freelancer,
			contractor, or lead teams at big companies.
		</FirstParagraph>
		<p>
			On the side, I've always tinkered with other technologies like{" "}
			<Link
				href="https://github.com/rolandleth/rolandleth.com/tree/sinatra"
				title="Sinatra branch"
				text="Ruby"
			/>
			,{" "}
			<Link
				href="https://github.com/rolandleth/rolandleth.com/tree/node"
				title="Node.js branch"
				text="Node.js"
			/>
			,{" "}
			<Link
				href="https://github.com/rolandleth/rolandleth.com/tree/swift-vapo"
				title="Vapor branch"
				text="Swift"
			/>{" "}
			or{" "}
			<Link
				href="https://github.com/rolandleth/rolandleth.com"
				title="Current version"
				text="React"
			/>{" "}
			and my blog has been a playground for a lot of that. If you'd like to
			know more about my development history, please check out{" "}
			<Link
				href="/downloads/resume.pdf"
				title="Roland Leth's resume"
				text="my résumé"
			/>
			.
		</p>
		<p>
			Starting with October 2017, I've started my own company with the help
			of{" "}
			<Link
				href="https://twitter.com/dianadaia09"
				title="Diana's Twitter"
				text="my girlfriend"
			/>
			. We've{" "}
			<Link
				href="https://itunes.apple.com/us/app/goalee/id1438115216?ls=1&mt"
				title="Goalee"
				text="launched"
			/>{" "}
			<Link
				href="https://itunes.apple.com/us/app/challengebeat/id1323950655?ls=1&mt"
				title="ChallengeBeat"
				text="several"
			/>{" "}
			<Link
				href="https://itunes.apple.com/us/app/my-travel-stories/id1395335605?ls=1&mt"
				title="My Travel Stories"
				text="products"
			/>{" "}
			and helped{" "}
			<Link
				href="https://itunes.apple.com/us/app/beraria-h/id1257720997?mt=8"
				title="Beraria H"
				text="a few"
			/>{" "}
			<Link
				href="https://heybewell.com/"
				title="Hey, Be Well"
				text="clients"
			/>{" "}
			build, repair, polish, finish and launch their apps. We also offer{" "}
			<Link href="https://runtimesharks.com/mentoring" text="mentoring" />,{" "}
			<Link href="https://runtimesharks.com/consulting" text="consulting" />{" "}
			and{" "}
			<Link href="https://runtimesharks.com/workshops" text="workshops" />.
			If you'd like to know more about us, please visit{" "}
			<Link
				href="https://runtimesharks.com"
				title="Runtime Sharks"
				text="our page"
			/>
			.
		</p>
		<p>
			Two of the projects we've built, ChallengeBeat and Goalee, are
			self-improvement driven; both are tools for becoming a better person
			and for improving yourself. Naturally, I've grown more and more
			interested in how our brains work, why we do or don't do things, how to
			improve and how to change ourselves for the better. So the final step
			was to open a new section on my blog, called{" "}
			<Link href="/life/blog" title="Life" text="Life" />, where I started
			writing about my own journey of improvement.
		</p>
		<p>
			A somewhat short (~17min read) post about this can be found on{" "}
			<Link
				href="https://www.reddit.com/r/selfimprovement/comments/9zcxl0/motivation_habits_discipline_identity_shift_my/"
				title="My short story"
				text="Reddit"
			/>{" "}
			and in the{" "}
			<Link
				href="/life/blog/about-me-slightly-detailed"
				title="About me, in more detail"
				text="first post"
			/>{" "}
			of the <Link href="/life/blog" title="Life" text="new section" />.{" "}
			<em>Spoiler</em>: the main tactic that has proven successful was "no
			step is too small to be unimportant", "one babystep at a time" & "never
			miss twice".
		</p>
		<p>
			If I can be of help or you just want to say hi, you can drop me an
			email at{" "}
			<Link
				href="mailto:hi@rolandleth.com"
				title="Shoot me an email"
				text="hi@rolandleth.com"
			/>
			, or find me on Twitter{" "}
			<Link
				href="https://twitter.com/rolandleth"
				title="My Twitter"
				text="@rolandleth"
			/>
			.
		</p>
		<p />
		<p>
			You can find my privacy policy{" "}
			<Link href="/privacy-policy" text="here" title="Privacy Policy" />.
		</p>
	</Container>
)

const Container = styled.div`
	padding: 2em 0;
	border-bottom: 1px solid ${Theme.lightGray};
`

const FirstParagraph = styled.p`
	margin-top: 0;
`

const Image = styled.img`
	float: left;
	margin: 4px 1.3em 0 0;
	max-width: 200px;
`

export default About
