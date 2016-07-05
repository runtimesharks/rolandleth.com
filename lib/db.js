/**
 * Created by roland on 3/7/16.
 */

function DB() {
	var pg    = require('pg')
	var Post  = require('./../models/post')
	var dbURL = process.env.DATABASE_URL || (
			'postgres://localhost/' + process.env.USER
		)

	this.fetchPosts = function(where, value, orderBy, direction) {
		var query = 'SELECT * FROM post_posts'

		if (where && value) {
			query += ' WHERE ' + where + ' = \'' + value + '\''
		}
		query += ' ORDER BY ' + (orderBy || 'datetime')+ ' ' + (direction || 'ASC')

		return new Promise(function(resolve, reject) {
			pg.connect(dbURL, function(err, client, done) {
				client.query(query, function(err, result) {
					done()

					if (err) {
						reject(new Error(err.message + ' ' + err.id))
					}
					else {
						var posts = _.sortBy(result.rows, 'datetime')
							.reverse()
							.map(function(rawPost) {
								return new Post(
									rawPost.title,
									rawPost.body,
									rawPost.datetime,
									rawPost.modified,
									rawPost.link
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