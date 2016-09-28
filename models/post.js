/**
 * Created by roland on 1/7/16.
 */

"use strict"

const readingTime = require("reading-time")
const truncateHTML = require("truncate-html") // This one is really fast (400ms vs 80)
require("../lib/date")

/**
 * The Post model.
 * @param {String} title
 * @param {String} body
 * @param {String} datetime
 * @param {String} modified
 * @param {String} link
 * @param {String} readingTime
 * @param {String} truncatedBody
 * @constructor
 */
function Post(title = "", body = "", datetime = "", modified = (new Date()).toDateString(),
              link = Post.createLink(title), readingTime = timeToRead(body), truncatedBody = truncateBody(body, link)) {
	this.title = title
	this.body = body
	this.truncatedBody = truncatedBody
	this.readingTime = readingTime
	this.datetime = datetime
	this.date = Post.dateFromDateTime(datetime) || ""
	this.modified = modified
	this.link = link
}

/**
 * Creates a friedly reading time text.
 * @param body The post's body.
 * @returns {String} A string in "1 min read" format.
 */
function timeToRead(body) {
	return function() {
		const t = readingTime(body)
		switch (true) {
			case t.minutes <= 0.2: return ""; break
			case t.minutes <= 0.5: return "25 sec read"; break
			case t.minutes <= 0.8: return "45 sec read"; break
			default: return t.text
		}
	}()
}

/**
 * Truncates the body of a post to 700 characters, but only if it's longer than 900; otherwise it does nothing.
 * @param body {String} The post of the body.
 * @param link {String} The link of the body.
 * @returns {String} The truncated body.
 */
function truncateBody(body, link) {
	if (body.length < 900) { return body }
	
	const truncatedBody = truncateHTML(body, {
		length: 700,
		ellipsis: " [&hellip;]",
		stripTags: false,
		keepWhitespaces: true
	})
	
	return truncatedBody + "<br/><a href='/" + link + "' onClick=\"_gaq.push(['_trackEvent', 'continue-reading', 'click', '/" + link + "']);\">Continue reading &rarr;</a>"
}

/**
 * Converts a string of yyyy-MM-dd format into a Date.
 * @param {String} datetime - yyyy-MM-dd format parameter
 * @returns {String|Date} A new Date corresponding to the parameter passed in, or an empty string.
 */
Post.dateFromDateTime = function(datetime) {
	if (!datetime) { return "" }
	const matches = datetime.match(/(\d{4})-(\d{2})-(\d{2})-(\d{4})/)
	const year    = matches[1]
	const month   = matches[2] - 1 // Months are 0 indexed :|
	const day     = matches[3]
	const hour    = matches[4].slice(0, 2)
	const minute  = matches[4].slice(2, 4)
	const postDate = new Date(year, month, day, hour, minute)

	// Convert to UTC, but offset hours to match Bucharest timezone.
	return new Date(Date.UTC(year, month, day, hour - (postDate.dst() ? 3 : 2), minute))
}

/**
 * Converts a date string into a date, then into a string of yyyy-MM-dd format.
 * @param {String} dateString - The string to be converted.
 * @returns {String} A string of yyyy-MM-dd format.
 */
Post.datetimeFromDate = function(dateString) {
	const date = new Date(dateString)
	let month = (date.getMonth() + 1).toString()
	let day = date.getDate().toString()
	let hours = date.getHours().toString()
	let minutes = date.getMinutes().toString()

	if (month.length == 1) {
		month = "0" + month
	}

	if (day.length == 1) {
		day = "0" + day
	}

	if (hours.length == 1) {
		hours = "0" + hours
	}

	if (minutes.length == 1) {
		minutes = "0" + minutes
	}

	return date.getFullYear() + "-" + month + "-" + day + "-" + hours + minutes
}

/**
 * Tests if two posts have matching links, by checking for --X variations on the first parameter.
 * @param {Post} newPost - The file post.
 * @param {Post} post - The database post.
 * @returns {Boolean} True, if the two links match, false if they do not.
 */
Post.linksMatch = function(newPost, post) {
	// Yea, yea, I know. But I"ll never have 100+ duplicates unknowingly :)
	return newPost.link == post.link ||
	       (newPost.link + "--") == post.link.slice(0, -1) ||
	       (newPost.link + "--") == post.link.slice(0, -2)
}

/**
 * Creates a link out of a title.
 * @param title The post's title.
 * @returns {String} A safe link.
 */
Post.createLink = function(title) {
	return title.replace(/([#,;!:"\'\?\[\]\{\}\(\$\/)]+)/g, "")
		.replace(/&/g, "and")
		.replace(/\s|\./g, "-")
		.toLowerCase()
}

module.exports = Post
