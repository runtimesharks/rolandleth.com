/**
 * Created by roland on 3/7/16.
 */

"use strict"
_ = require("lodash")

const postsTable = "posts"
const pool  = function() {
	const Pool = require("pg").Pool
	const url = require('url')
	const params = url.parse(process.env.DATABASE_URL || (
			"postgres://localhost/" + process.env.USER
		)
	)
	
	// Running locally usually implies no auth.
	if (!params.auth) {
		params.auth = ":"
	}
	const auth = params.auth.split(':')
	
	const config = {
		user: auth[0],
		password: auth[1],
		host: params.hostname,
		port: params.port || 5432,
		database: params.pathname.split('/')[1]
	}
	
	return new Pool(config)
}()
const DbResult = require("../models/dbResult")
const DbConfig = require("../models/dbConfig")
const Post  = require("./../models/post")

/**
 * @class
 * A namespace for all related database operations.
 */
function Db() {}

function fields() {
	return "(title, body, truncatedbody, datetime, modified, link, readingtime)"
}

function values(post) {
	const title = post.title.replace(new RegExp("'", "g"), "''")
	const body = post.body.replace(new RegExp("'", "g"), "''")
	const truncatedBody = post.truncatedBody.replace(new RegExp("'", "g"), "''")
	return "('" + title + "', " +
	       "'" + body + "', " +
	       "'" + truncatedBody + "', " +
	       "'" + post.datetime + "', " +
	       "'" + post.modified + "', " +
	       "'" + post.link + "', " +
	       "'" + post.readingTime + "')"
}

/**
 * Create a new post.
 * @param {Post} post - The post to be created.
 * @returns {Promise} A promise that contains true or false, based on the success.
 */
Db.createPost = function(post) {
	const query = "INSERT INTO " + postsTable + fields() +
	              " VALUES " + values(post)
	
	return pool.query(query).then(function() {
		return true
	})
}

/**
 * Delete a post, based on its link and datetime fields.
 * @param {Post} post - The post to delete.
 * @returns {Promise} A promise that contains true or false, based on the success.
 */
Db.deletePost = function(post) {
	const query = "DELETE FROM " + postsTable + " WHERE" +
	              " link = '" + post.link + "' AND" +
	              " datetime = '" + post.datetime + "'"
	
	return pool.query(query).then(function() {
		return true
	})
}

/**
 * Update a post, based on its link and datetime fields.
 * @param {Post} post - The post to update.
 * @returns {Promise} A promise that contains true or false, based on the success.
 */
Db.updatePost = function(post) {
	const query = "UPDATE " + postsTable + " SET" +
	              " " + fields() +
	              " = " + values(post) + " WHERE " +
	              " link = '" + post.link + "' AND " +
	              " datetime = '" + post.datetime + "'"
	
	return pool.query(query).then(function() {
		return true
	})
}

/**
 * Fetch one post, based by its link. Can return future posts.
 * @param {String} link - The post"s link.
 * @returns {Promise} A promise that contains a {@link DbResult}.
 */
Db.fetchPost = function(link) {
	return Db.fetchPosts(DbConfig.post(link))
}

/**
 * Fetch posts that contain the query in the title or body.
 * @param {String} query - The query to search for.
 * @returns {Promise} A promise that contains a {@link DbResult}.
 */
Db.searchPosts = function(query) {
	return Db.fetchPosts(DbConfig.search(query))
}

/**
 * Fetch all posts, even future ones.
 * @returns {Promise} A promise that contains a {@link DbResult}.
 */
Db.fetchPostsForUpdating = function() {
	return Db.fetchPosts(DbConfig.update())
}

/**
 * Fetch title, link and datetime fields of all posts, except future ones.
 * @returns {Promise} A promise that contains a {@link DbResult}.
 */
Db.fetchArchivePosts = function() {
	return Db.fetchPosts(DbConfig.archive())
}

/**
 * Fetch all posts, except future ones.
 * @returns {Promise} A promise that contains a {@link DbResult}.
 */
Db.fetchFeedPosts = function() {
	return Db.fetchPosts(DbConfig.feed())
}

/**
 * Fetch link, modified and datetime fields of all posts, except future ones.
 * @returns {Promise} A promise that contains a {@link DbResult}.
 */
Db.fetchSiteMapPosts = function() {
	return Db.fetchPosts(DbConfig.siteMap())
}

/**
 * Fetch posts, creating the query based on the config.
 * @param {DbConfig} config - An object on which the creation of the db query is based on.
 * @returns {Promise} A promise that contains a {@link DbResult}.
 */
Db.fetchPosts = function(config) {
	let query     = "SELECT " + config.columns + " FROM " + postsTable
	const queried = config.fields && config.fieldValues
	if (queried) {
		if (config.searching) {
			query += " WHERE "
			
			config.fields.forEach(function(field) {
				config.fieldValues.forEach(function(value) {
					query += field + " ILIKE "
					query += "'%" + value + "%'"
					query += " OR "
				})
			})

			query = query.slice(0, -4)
		}
		else {
			query += " WHERE " + config.fields[0] + " = '" + config.fieldValues[0] + "'"
		}
	}
	query += " ORDER BY " + (config.orderBy || "datetime") + " " + (config.orderDirection || "ASC")
	
	return pool.query(query).then(result => {
		const res      = new DbResult()
		res.totalPosts = result.rows.length
		let posts      = result.rows.reverse()
		
		if (!config.updating && config.limit != 1) {
			const date = new Date()
			const utcDate = new Date(
				Date.UTC(
					date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
					date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()
				)
			)
			
			posts = posts.filter(function(rawPost) {
				const postDate = Post.dateFromDateTime(rawPost.datetime)
				return postDate && postDate < utcDate
			})
		}
		
		if (config.limit) {
			posts = posts.slice(config.offset, config.offset + config.limit)
		}
		
		res.posts = posts.map(function(rawPost) {
			let truncatedBody = rawPost.truncatedbody
			
			if (config.searching) {
				let pattern = ""
				config.fieldValues.forEach(function(value) {
					pattern += value.replace(/<|>/g, "") + "|"
				})
				pattern     = pattern.slice(0, -1)
				const regex = new RegExp(pattern, "gi")
				
				// Marking won"t work inside code blocks, because styling is applied via script
				truncatedBody = truncatedBody.replace(
					regex,
					'<mark class="search">\$&</mark>'
				)
				
				// Open <, and match any number of characters except >, and only then match marks,
				// otherwise it would just match up until a later >, and most likely include the marks too.
				const matches = truncatedBody.match(/<[^>]*?<mark class="search">.+?<\/mark>.*?>/gi)
				
				if (matches) {
					matches.forEach(function(match) {
						truncatedBody = truncatedBody.replace(match, match.replace(/<\/mark>|<mark class="search">/gi, ""))
					})
				}
			}
			
			return new Post(
				rawPost.title,
				rawPost.body,
				rawPost.datetime,
				rawPost.modified,
				rawPost.link,
				rawPost.readingtime,
				truncatedBody
			)
		})
		
		return res
	})
}

module.exports = Db
