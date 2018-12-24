"use strict"

import readingTime from "reading-time"
import truncateHTML from "truncate-html" // This one is really fast (400ms vs 80)
import marked from "marked"
require("../lib/date")

/**
 * Creates a friedly reading time text.
 * @param {String} body The post's body.
 * @returns {String} A string in "1 min read" format.
 */
function timeToRead(body) {
	const t = readingTime(body)

	switch (true) {
		case t.minutes <= 0.2:
			return ""
		case t.minutes <= 0.5:
			return "25 sec read"
		case t.minutes <= 0.8:
			return "45 sec read"
		default:
			return t.text
	}
}

/**
 * Truncates the body of a post to 700 characters, but only if it's longer than 900; otherwise it does nothing.
 * @param {String} title The title of the body; used for tracking.
 * @param {String} body The post of the body.
 * @param {String} rawBody The post of the body.
 * @param {String} link The link of the body.
 * @returns {String} The truncated body.
 */
function truncateBody(body) {
	if (body.length < 900) {
		return body
	}

	return truncateHTML(body, {
		length: 700,
		ellipsis: " ...",
		// ellipsis: " [&hellip;]",
		stripTags: false,
		keepWhitespaces: true
	})
}

/**
 * Extracts the first paragraph of a post's body, truncating it to 300 characters.
 * @param {String} rawBody The post's raw body.
 * @returns {String} The first paragraph of the body.
 */
function extractFirstParagraph(rawBody) {
	const split = rawBody.split("\n")
	var firstParagraph = ""

	if (split.length === 0) {
		firstParagraph = rawBody
	} else {
		firstParagraph = split[0]
	}

	return truncateHTML(firstParagraph, {
		length: 300,
		ellipsis: " ..."
	})
}

/**
 * The Post model.
 * @param {String} title
 * @param {String} body
 * @param {String} author
 * @param {String} rawBody
 * @param {String} datetime
 * @param {String} modified
 * @param {String} link
 * @param {String} readingTime
 * @param {String} truncatedBody
 * @param {Bool} creating
 * @constructor
 */
class Post {
	constructor(
		creating,
		title,
		rawBody,
		datetime,
		authorid = 1,
		body = marked(rawBody),
		truncatedBody,
		firstParagraph = extractFirstParagraph(rawBody),
		date,
		isoDate,
		modified = Post.datetimeFromDate(new Date()),
		link = Post.createLink(title),
		readingTime = timeToRead(body)
	) {
		this.title = title
		this.rawBody = rawBody
		this.datetime = datetime

		this.body = body

		// Since we use a markdown renderer for the FE now, truncate the `rawBody` every time.
		// this.truncatedBody = truncatedBody
		if (creating) {
			this.truncatedBody = truncateBody(body)
		} else {
			// Except when creating ... This is fucked up for now...
			this.truncatedBody = truncateBody(rawBody)
		}

		this.firstParagraph = firstParagraph
		this.authorid = authorid

		var options = { year: "numeric", month: "short", day: "numeric" }
		const rawDate = Post.dateFromDateTime(datetime)

		this.date = date || rawDate.toLocaleDateString("en-US", options)
		this.isoDate = isoDate || rawDate.toISOString()
		this.modified = modified
		this.link = link
		this.readingTime = readingTime
	}

	/**
	 * Converts a string of yyyy-MM-dd format into a Date.
	 * @param {String} datetime - yyyy-MM-dd format parameter
	 * @returns {String|Date} A new Date corresponding to the parameter passed in, or an empty string.
	 */
	static dateFromDateTime(datetime) {
		if (!datetime) {
			return ""
		}

		const matches = datetime.match(/(\d{4})-(\d{2})-(\d{2})-(\d{4})/)
		const year = matches[1]
		const month = matches[2] - 1 // Months are 0 indexed :|
		const day = matches[3]
		const hour = matches[4].slice(0, 2)
		const minute = matches[4].slice(2, 4)
		const postDate = new Date(year, month, day, hour, minute)

		// Convert to UTC, but offset hours to match Bucharest timezone -- Not working, obviously :|
		return new Date(
			Date.UTC(year, month, day, hour - (postDate.dst() ? 3 : 2), minute)
		)
	}

	/**
	 * Tests if two posts have matching links, by checking for --X variations on the first parameter.
	 * @param {Post} newPost - The file post.
	 * @param {Post} post - The database post.
	 * @returns {Boolean} True, if the two links match, false if they do not.
	 */
	static linksMatch(newPost, post) {
		// Yea, yea, I know. But I"ll never have 100+ duplicates unknowingly :)
		return (
			newPost.link === post.link ||
			newPost.link + "--" === post.link.slice(0, -1) ||
			newPost.link + "--" === post.link.slice(0, -2)
		)
	}

	/**
	 * Converts a date string into a date, then into a string of yyyy-MM-dd format.
	 * @param {String} dateString - The string to be converted.
	 * @returns {String} A string of yyyy-MM-dd format.
	 */
	static datetimeFromDate(dateString) {
		const date = new Date(dateString)
		let month = (date.getMonth() + 1).toString()
		let day = date.getDate().toString()
		let hours = date.getHours().toString()
		let minutes = date.getMinutes().toString()

		if (month.length === 1) {
			month = "0" + month
		}

		if (day.length === 1) {
			day = "0" + day
		}

		if (hours.length === 1) {
			hours = "0" + hours
		}

		if (minutes.length === 1) {
			minutes = "0" + minutes
		}

		return (
			date.getFullYear() + "-" + month + "-" + day + "-" + hours + minutes
		)
	}

	/**
	 * Creates a link out of a title.
	 * @param title The post's title.
	 * @returns {String} A safe link.
	 */
	static createLink(title) {
		return title
			.replace(/([#,;!:"\'\?\[\]\{\}\(\$\/)]+)/g, "")
			.replace(/&/g, "and")
			.replace(/\s|\./g, "-")
			.toLowerCase()
	}
}

export default Post
