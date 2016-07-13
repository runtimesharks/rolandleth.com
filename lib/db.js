/**
 * Created by roland on 3/7/16.
 */

'use strict'
_ = require('lodash')

const pg    = require('pg')
const Post  = require('./../models/post')
const dbURL = process.env.DATABASE_URL || (
		'postgres://localhost/' + process.env.USER
	)

function DB() {}

/**
 An object to wrap all configs required for DB handling.
 @property updating If we are doing an update, all posts must be fetched, including future ones, false by default.
 @property searching If we are doing a search, the query will be done by all fields, not just link and datetime, false by default.
 @property columns The columns to fetch, * by default. On archive, we only want the titles, for example.
 @property fields The fields to do the query by, usually for search, null by default.
 @property fieldValues The fields' values to do the query by, usually for search, null by default.
 @property orderBy The ordering field to do the query by, datetime by default.
 @property orderDirection The direction of ordering, ASC by default.
 @property pageSize The number of posts to return, env.PAGE_SIZE by default.
 @property offset The offset where to return posts from, for page x > 1, 0 by default.
 */
DB.Config = function() {
	this.updating       = false
	this.searching      = false
	this.columns        = '*'
	this.fields         = null
	this.fieldValues    = null
	this.orderBy        = 'datetime'
	this.orderDirection = 'ASC'
	this.limit          = process.env.PAGE_SIZE || 10
	this.offset         = 0
}

function fields() {
	return '(title, body, datetime, modified, link, readingtime)'
}

function values(post) {
	const title = post.title.replace(new RegExp('\'', 'g'), '\'\'')
	const body = post.body.replace(new RegExp('\'', 'g'), '\'\'')
	return '(\'' + title + '\', ' +
	       '\'' + body + '\', ' +
	       '\'' + post.datetime + '\', ' +
	       '\'' + post.modified + '\', ' +
	       '\'' + post.link + '\', ' +
	       '\'' + post.readingTime + '\')'
}

/**
 A simple object to wrap the results.
 @property posts An array of config.pageSize posts.
 @property totalPosts The total number of posts in the db.
 */
DB.Result = function() {
	this.posts      = []
	this.totalPosts = 0
}

/*
 Create a new post.
 */
DB.createPost = function(post) {
	const query = 'INSERT INTO posts ' +
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

/*
 Delete a post, based on its link and datetime fields.
 */
DB.deletePost = function(post) {
	const query = 'DELETE FROM posts WHERE' +
	              ' link = \'' + post.link + '\' AND' +
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

/*
 Update a post, based on its link and datetime fields.
 */
DB.updatePost = function(post) {
	const query = 'UPDATE posts SET' +
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

/*
 Fetch posts, filtering the ones on a future date, based on the posts' link field.
 If config.pageSize is set to -1, it will return everything, otherwise it will return env.PAGE_SIZE.
 If config.updating is set to true, it will return everything, including future ones.
 If config.searching is set to true, the query is done based on all passed fields.
 */
DB.fetchPosts = function(config) {
	let query   = 'SELECT ' + config.columns + ' FROM posts'
	const queried = config.fields && config.fieldValues
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
			query += ' WHERE ' + config.fields[0] + ' = \'' + config.fieldValues[0] + '\''
		}
	}
	query += ' ORDER BY ' + (config.orderBy || 'datetime') + ' ' + (config.orderDirection || 'ASC')

	return new Promise(function(resolve, reject) {
		pg.connect(dbURL, function(err, client, done) {
			client.query(query, function(err, result) {
				done()

				if (err) {
					reject(new Error(err.message + ' ' + err.id))
					return
				}

				const res      = new DB.Result()
				res.totalPosts = result.rows.length
				let posts      = result.rows.reverse()

				if (!config.updating && !config.searching && config.limit != 1) {
					posts = posts.filter(function(rawPost) {
						const date = Post.dateFromDateTime(rawPost.datetime)
						return date && date < new Date()
					})
				}

				if (config.limit) {
					posts = posts.slice(config.offset, config.offset + config.limit)
				}

				res.posts = posts.map(function(rawPost) {
					let body = rawPost.body

					if (queried && config.searching) {
						let pattern = ''
						config.fieldValues.forEach(function(value) {
							pattern += value + '|'
						})
						pattern   = pattern.slice(0, -1)
						const regex = new RegExp(pattern, 'gi')

						// This won't work for code blocks, because styling is applied via script
						body = body.replace(
							regex,
							'<mark class=\'search\'>\$&</mark>'
						)

						let lines = []
						body.split('\n').forEach(function(line) {
							let _line = line
							if (line.indexOf('<a href=<') ||
							    line.indexOf('/assets/') ||
							    line.indexOf('<img src=')) {
								_line = _line.replace(/<\/mark>/g, '')
								_line = _line.replace(/<mark class='search'>/g, '')
							}
							lines.push(_line)
						})
						body = lines.join('\n')
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
			})
		})
	})
}

module.exports = DB
