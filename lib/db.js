/**
 * Created by roland on 3/7/16.
 */

function DB() {
	_ = require('lodash')

	var pg    = require('pg')
	var Post  = require('./../models/post')
	var dbURL = process.env.DATABASE_URL || (
			'postgres://localhost/' + process.env.USER
		)

	this.fetchPosts = function(config) {
		var query = 'SELECT * FROM post_posts'

		if (config.field && config.fieldValue) {
			query += ' WHERE ' + config.field + ' = \'' + config.fieldValue + '\''
		}
		query += ' ORDER BY ' + (config.orderBy || 'datetime') + ' ' + (config.orderDirection || 'ASC')

		return new Promise(function(resolve, reject) {
			pg.connect(dbURL, function(err, client, done) {
				client.query(query, function(err, result) {
					done()

					if (err) {
						reject(new Error(err.message + ' ' + err.id))
					}
					else {
						var marked = require('marked')
						var DBResult = require('./dbResult')
						var res        = new DBResult()
						res.totalPosts = result.rows.length
						var posts = _.sortBy(result.rows, 'datetime').reverse()

						if (config.limit !== -1) { // This is for archive, to fetch them all
							var limit = config.limit || config.pageSize
							posts = posts.slice(config.offset, config.offset + limit)
						}

						res.posts =	posts.map(function(rawPost) {
								return new Post(
									rawPost.title,
									marked(rawPost.body),
									rawPost.datetime,
									rawPost.modified,
									rawPost.link
								)
							})

						resolve(res)
					}
				})
			})
		})
	}
}

module.exports = DB