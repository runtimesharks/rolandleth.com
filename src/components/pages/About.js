import React from "react"
import styled from "styled-components"
import Link from "../link/Link"
import Theme from "../theme/Theme"

const projectsURL = "https://runtimesharks.com/projects"

const About = () => (
	<Container>
		<Image src="/images/misc/mypic.jpg" alt="My Picture" />
		<FirstParagraph>
			My main occupation since 2011 has been as an iOS developer. I've worked on
			my own projects, on remote teams, as a freelancer and contractor, or lead
			teams at big companies like{" "}
			<Link href="https://deindeal.ch" title="DeinDeal" text="DeinDeal" />, part
			of <Link href="https://ringier.ch" title="Ringier" text="Ringier" />. I'm
			currently working as Head of Digital at{" "}
			<Link
				href="https://therme.media"
				title="Therme Media"
				text="Therme Media"
			/>
			, part of{" "}
			<Link
				href="https://www.thermegroup.com"
				title="Therme Group"
				text="Therme Group"
			/>
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
			and my blog has been a playground for a lot of that. If you'd like to know
			more about my software development history, please check out{" "}
			<Link
				href="https://rolandleth.com/assets/resume.pdf"
				title="Roland Leth's resume"
				text="my résumé"
			/>
			.
		</p>
		<p>
			Starting with October 2017, I've started my own company, where we've
			launched multiple <Link href={`${projectsURL}`} text="iOS apps" />
			, <Link href={`${projectsURL}#mac`} text="Mac apps" /> &{" "}
			<Link href={`${projectsURL}#web`} text="websites" /> and helped{" "}
			<Link href={`${projectsURL}/beraria-h`} title="Beraria H" text="a few" />{" "}
			<Link
				href={`${projectsURL}/hey-be-well`}
				title="Hey, Be Well"
				text="clients"
			/>{" "}
			build, repair, polish, finish and launch their apps. We also offer{" "}
			<Link href="https://runtimesharks.com/mentoring" text="mentoring" />,{" "}
			<Link href="https://runtimesharks.com/consulting" text="consulting" /> and{" "}
			<Link href="https://runtimesharks.com/workshops" text="workshops" />. If
			you'd like to know more, please visit{" "}
			<Link
				href="https://runtimesharks.com"
				title="Runtime Sharks"
				text="our page"
			/>
			, although it's now just me, working on my own projects.
		</p>
		<p>
			Two of the projects we've built,{" "}
			<Link
				href={`${projectsURL}/challengebeat`}
				title="ChallengeBeat"
				text="ChallengeBeat"
			/>{" "}
			and <Link href={`${projectsURL}/goalee`} title="Goalee" text="Goalee" />,
			are self-improvement driven; both are tools for becoming a better person
			and for improving yourself. Naturally, I've grown more and more interested
			in how our brains work, why we do or don't do things, how to improve and
			how to change ourselves for the better. So the final step was to open a
			new section on my blog, called{" "}
			<Link href="/life/blog" title="Life" text="Life" />, where I started
			writing about my own journey of development.
		</p>
		<p>
			If I can be of help or you just want to say hi, you can drop me an email
			at{" "}
			<Link
				href="mailto:roland+hi@hey.com"
				title="Shoot me an email"
				text="roland+hi@hey.com"
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
