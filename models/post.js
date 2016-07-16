/**
 * Created by roland on 1/7/16.
 */

'use strict'

/**
 * The Post model.
 * @param {String} title
 * @param {String} body
 * @param {String} readingTime
 * @param {String} datetime
 * @param {String} modified
 * @param {String} link
 * @constructor
 */
function Post(title = '', body = '', readingTime = '', datetime = '', modified = '', link = '') {
	this.title = title
	this.body = body
	this.readingTime = readingTime
	this.datetime = datetime
	this.date = Post.dateFromDateTime(datetime) || ''
	this.modified = modified
	this.link = link
}

/**
 * Converts a string of YYYY-MM-dd format into a Date.
 * @param {String} datetime - YYYY-MM-dd format parameter
 * @returns {String|Date} A new Date corresponding to the parameter passed in, or an empty string.
 */
Post.dateFromDateTime = function(datetime) {
	if (!datetime) { return '' }
	const matches = datetime.match(/(\d{4})-(\d{2})-(\d{2})-(\d{4})/)
	const year    = matches[1]
	const month   = matches[2] - 1 // Months are 0 indexed :|
	const day     = matches[3]
	const hour    = matches[4].slice(0, 2)
	const minute  = matches[4].slice(2, 4)

	return new Date(year, month, day, hour, minute)
}

/**
 * Truncates the body of a post to 700 characters, if it's longer than 900, otherwise it does nothing.
 * @param {Post} post - The post for which the body's truncation is required.
 * @returns {String} The truncated body.
 */
Post.truncatedBody = function(post) {
	if (post.body.length < 900) { return post.body }

	const truncateHTML = require('html-truncate') // This one is really fast (400ms vs 80)
	const body = truncateHTML(post.body, 700, {
		ellipsis: ' [&hellip;]',
		keepImageTag: true
	})

	return body + "\
	      <br/> \
				<a href='/" + post.link + "'\
						onClick = \"_gaq.push([\
						'_trackEvent', \
						'continue-reading', \
						'click', \
						'/" + post.link + ">']);\">\
						Continue reading &rarr;\
	       </a>"
}

/**
 * Tests if two posts have matching links, by checking for --X variations on the first parameter.
 * @param {Post} newPost - The file post.
 * @param {Post} post - The database post.
 * @returns {Boolean} True, if the two links match, false if they do not.
 */
Post.linksMatch = function(newPost, post) {
	// Yea, yea, I know. But I'll never have 100+ duplicates unknowingly :)
	return newPost.link == post.link ||
	       (newPost.link + '--') == post.link.slice(0, -1) ||
	       (newPost.link + '--') == post.link.slice(0, -2)
}

module.exports = Post