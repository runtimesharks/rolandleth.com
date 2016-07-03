/**
 * Created by roland on 3/7/16.
 */

function DB() {
	var pg    = require('pg')
	var Post  = require('./post')
	var dbURL = process.env.DATABASE_URL || (
			'postgres://localhost/' + process.env.USER
		)

	this.fetchPosts = function() {
		return new Promise(function(resolve, reject) {
			pg.connect(dbURL, function(err, client, done) {
				client.query('SELECT * FROM post_posts', function(err, result) {
					done()

					if (err) {
						reject(new Error(err.message + ' ' + err.id))
					}
					else {
						var posts = _.sortBy(result.rows, 'datetime')
							.reverse()
							.map(function(post) {
								return new Post(
									post.title,
									post.body,
									post.datetime,
									post.modified,
									post.link
								)
							})
						resolve(posts)
					}
				})
			})
		})
	}
}

module.exports = DB