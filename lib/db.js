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
		var query = 'SELECT ' + config.columns + ' FROM post_posts'
		var queried = config.fields && config.fieldValues
		if (queried) {
			if (config.searching) {
				query += ' WHERE '

				config.fields.forEach(function(field) {
					config.fieldValues.forEach(function(value) {
						query += field + ' LIKE '
						query += '\'%' + value + '%\''
						query += ' OR '
					})
				})

				query = query.slice(0, -4)
			}
			else {
				query += ' WHERE ' + config.fields + ' = \'' + config.fieldValues + '\''
			}
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
						var readingTime = require('reading-time')
						var marked = require('marked')
						var DBResult = require('./dbResult')
						var res        = new DBResult()
						res.totalPosts = result.rows.length
						var posts = result.rows
							.reverse()
							.filter(function(rawPost) {
								var date = Post.dateFromDateTime(rawPost.datetime)
								return date && date < new Date()
							})

						if (config.limit !== -1) { // This is for archive, to fetch them all
							var limit = config.limit || config.pageSize
							posts = posts.slice(config.offset, config.offset + limit)
						}

						res.posts =	posts
							.map(function(rawPost) {
								var body = marked(rawPost.body || '')

								if (queried) {
									var pattern = ''
									config.fieldValues.forEach(function(value) {
										pattern += value + '|'
									})
									pattern = pattern.slice(0, -1)
									var regex = new RegExp(pattern, 'gi')

									// This won't work for code blocks, because styling is applied via script
									body = body.replace(
										regex,
										'<mark class=\'search\'>\$&</mark>'
									)
								}

								return new Post(
									rawPost.title,
									body,
									readingTime(rawPost.body || ''),
									rawPost.datetime,
									rawPost.modified || '',
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