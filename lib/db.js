/**
 * Created by roland on 3/7/16.
 */

'use strict'
_ = require('lodash')

var pg    = require('pg')
var Post  = require('./../models/post')
var dbURL = process.env.DATABASE_URL || (
		'postgres://localhost/' + process.env.USER
	)

function DB() {}

DB.Config = function() {
	this.updating       = false
	this.searching      = false
	this.columns        = '*'
	this.fields         = null
	this.fieldValues    = null
	this.orderBy        = 'datetime'
	this.orderDirection = 'ASC'
	this.pageSize       = process.env.PAGE_SIZE || 10
	this.offset         = 0
	this.limit          = null
}

function fields() {
	return '(title, body, datetime, modified, link, readingtime)'
}

function values(post) {
	var title = post.title.replace(new RegExp('\'', 'g'), '\'\'')
	var body = post.body.replace(new RegExp('\'', 'g'), '\'\'')
	return '(\'' + title + '\', ' +
	       '\'' + body + '\', ' +
	       '\'' + post.datetime + '\', ' +
	       '\'' + post.modified + '\', ' +
	       '\'' + post.link + '\', ' +
	       '\'' + post.readingTime + '\')'
}

DB.migrate = function() {
	var query = 'ALTER TABLE post_posts ADD COLUMN readingtime varchar(20)'
	pg.connect(dbURL, function(err, client, done) {
		client.query(query, function(err) {
			done()

			query = 'ALTER TABLE post_posts RENAME TO posts'
			pg.connect(dbURL, function(err, client, done1) {
				client.query(query, function(err) {
					done1()
				})
			})
		})
	})
}

DB.Result = function() {
	this.posts      = []
	this.totalPosts = 0
}

DB.createPost = function(post) {
	var query = 'INSERT INTO posts ' +
	            fields() +
	            ' VALUES ' + values(post)

	return new Promise(function(resolve, reject) {
		pg.connect(dbURL, function(err, client, done) {
			client.query(query, function(err) {
				done()

				if (err) {
					reject(new Error(err.message + ' ' + err.id))
				}
				else {
					resolve(true)
				}
			})
		})
	})
}

DB.updatePost = function(post) {
	var query = 'UPDATE posts SET' +
	            ' ' + fields() +
	            ' = ' + values(post) + ' WHERE ' +
	            ' link = \'' + post.link + '\' AND ' +
	            ' datetime = \'' + post.datetime + '\''

	return new Promise(function(resolve, reject) {
		pg.connect(dbURL, function(err, client, done) {
			client.query(query, function(err) {
				done()

				if (err) {
					reject(new Error(err.message + ' ' + err.id))
				}
				else {
					resolve(true)
				}
			})
		})
	})
}

DB.fetchPosts = function(config) {
	var query   = 'SELECT ' + config.columns + ' FROM posts'
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
					var res         = new DB.Result()
					res.totalPosts  = result.rows.length
					var posts       = result.rows.reverse()

					if (!config.updating) {
						posts = posts.filter(function(rawPost) {
							var date = Post.dateFromDateTime(rawPost.datetime)
							return date && date < new Date()
						})
					}

					if (config.limit !== -1) { // This is for archive, to fetch them all
						var limit = config.limit || config.pageSize
						posts     = posts.slice(config.offset, config.offset + limit)
					}

					res.posts = posts
						.map(function(rawPost) {
							var body = rawPost.body

							if (queried) {
								var pattern = ''
								config.fieldValues.forEach(function(value) {
									pattern += value + '|'
								})
								pattern   = pattern.slice(0, -1)
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
								rawPost.readingtime,
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

module.exports = DB