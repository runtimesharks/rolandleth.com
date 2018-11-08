import React from "react"
import styled from "styled-components"
import Theme from "./theme/Theme"
import Link from "./Link"

const About = () => (
	<Container>
		<Image src={require("../images/misc/mypic.jpg")} alt="My Picture" />
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
			<Link href="https://rolandleth.com/mentoring" text="mentoring" />,{" "}
			<Link href="https://rolandleth.com/consulting" text="consulting" /> and{" "}
			<Link href="https://rolandleth.com/workshops" text="workshops" />. If
			you'd like to know more about us, please visit{" "}
			<Link
				href="https://runtimesharks.com"
				title="Runtime Sharks"
				text="our page"
			/>
			.
		</p>
		<p>
			Two of the projects we've built, ChallengeBeat and Goalee, are
			self-improvement driven; both are tools in becoming a better person, on
			improving yourself. Naturally, I've grown more and more interested in
			how our brains work, why we do or don't do things, how to improve and
			how to change ourselves for the better. So the final step was to open a
			new section on my blog, called{" "}
			<Link href="/life-blog" title="Life" text="Life" />, where I started
			writing about my own journey of improvement.
		</p>
		<p>
			Most of the motivational videos or articles you can find online are by
			or about successful people. If, at times, you've thought that "of
			course, they're rich/successful, it's easy for them", then you're not
			alone; I have as well. And this is one of the reasons I started this
			section: to give confidence to other people that this kind of change{" "}
			<strong>is</strong> possible.
		</p>
		<p>
			I had an easy life and I won't deny nor hide that. I also don't have
			the worry of tomorrow, but I'm by no means famous, nor wealthy. Yet,
			following the same principles/advices, I <strong>did</strong> change
			and I improved my life quite a bit and now it's getting easier and
			easier. <em>Spoiler</em>: the main tactic that has proven successful
			was "no step is too small to be unimportant" & "one babystep at a
			time".
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
