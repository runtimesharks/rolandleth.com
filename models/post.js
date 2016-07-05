/**
 * Created by roland on 1/7/16.
 */

function Post(title, body, datetime, modified, link) {
	var matches = datetime.match(/(\d{4})-(\d{2})-(\d{2})-(\d{4})/)
	var year = matches[1]
	var month = matches[2] - 1 // Months are 0 indexed :|
	var day = matches[3]
	var hour = matches[4].slice(0, 2)
	var minute = matches[4].slice(2, 4)

	this.title = title
	this.body = body
	this.datetime = datetime // For archive
	this.date = new Date(year, month, day, hour, minute)
	this.modified = modified
	this.link = link
}

module.exports = Post