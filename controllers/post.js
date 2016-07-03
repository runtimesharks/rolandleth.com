/**
 * Created by roland on 1/7/16.
 */

function Post(title, body, datetime, modified, link) {
	this.title = title
	this.body = body
	this.datetime = datetime
	this.modified = modified
	this.link = link
}

module.exports = Post