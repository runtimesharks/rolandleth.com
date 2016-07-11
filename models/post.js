/**
 * Created by roland on 1/7/16.
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

Post.linksMatch = function(newPost, post) {
	// Yea, yea, I know. But I'll never have 100+ duplicates unknowingly :)
	return newPost.link == post.link ||
	       (newPost.link + '--') == post.link.slice(0, -1) ||
	       (newPost.link + '--') == post.link.slice(0, -2)
}

module.exports = Post
