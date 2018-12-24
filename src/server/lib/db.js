"use strict"

import DbResult from "../models/dbResult"
import DbConfig from "../models/dbConfig"
import Post from "./../models/post"
import { Pool } from "pg"
import url from "url"

function postsTableForSection(section) {
	return section === "life" ? "lifePosts" : "techPosts"
}

const pool = (function() {
	const dbURL =
		process.env.DATABASE_URL || "postgres://localhost/" + process.env.USER
	const params = url.parse(dbURL)

	// Running locally usually implies no auth.
	if (!params.auth) {
		params.auth = ":"
	}
	const auth = params.auth.split(":")

	const config = {
		user: auth[0],
		password: auth[1],
		host: params.hostname,
		port: params.port || 5432,
		database: params.pathname.split("/")[1]
	}

	return new Pool(config)
})()

function fields() {
	return "(title, body, rawbody, truncatedbody, firstparagraph, authorid, datetime, date, isodate, modified, link, readingtime)"
}

function values(post) {
	const title = post.title.replace(new RegExp("'", "g"), "''")
	const body = post.body.replace(new RegExp("'", "g"), "''")
	const truncatedBody = post.truncatedBody.replace(new RegExp("'", "g"), "''")
	return (
		"('" +
		title +
		"', " +
		"'" +
		body +
		"', " +
		"'" +
		post.rawBody +
		"', " +
		"'" +
		truncatedBody +
		"', " +
		"'" +
		post.firstParagraph +
		"', " +
		"'" +
		post.authorid +
		"', " +
		"'" +
		post.datetime +
		"', " +
		"'" +
		post.date +
		"', " +
		"'" +
		post.isoDate +
		"', " +
		"'" +
		post.modified +
		"', " +
		"'" +
		post.link +
		"', " +
		"'" +
		post.readingTime +
		"')"
	)
}

/**
 * @class
 * A namespace for all related database operations.
 */
class Db {
	/**
	 * Create a new post.
	 * @param {Post} post - The post to be created.
	 * @param {String} section - The blog's section.
	 * @returns {Promise.<Boolean>} A promise that contains true or false, based on the success.
	 */
	static createPost(post, section) {
		const query =
			"INSERT INTO " +
			postsTableForSection(section) +
			fields() +
			" VALUES " +
			values(post)

		return pool.query(query).then(function() {
			return true
		})
	}

	/**
	 * Delete a post, based on its link and datetime fields.
	 * @param {Post} post - The post to delete.
	 * @param {String} section - The blog's section.
	 * @returns {Promise.<Boolean>} A promise that contains true or false, based on the success.
	 */
	static deletePost(post, section) {
		const query =
			"DELETE FROM " +
			postsTableForSection(section) +
			" WHERE" +
			" link = '" +
			post.link +
			"' AND" +
			" datetime = '" +
			post.datetime +
			"'"

		return pool.query(query).then(function() {
			return true
		})
	}

	/**
	 * Update a post, based on its link and datetime fields.
	 * @param {Post} post - The post to update.
	 * @param {"life"|"tech"} section A String representing the section of the site.
	 * @returns {Promise.<Boolean>} A promise that contains true or false, based on the success.
	 */
	static updatePost(post, section) {
		const query =
			"UPDATE " +
			postsTableForSection(section) +
			" SET" +
			" " +
			fields() +
			" = " +
			values(post) +
			" WHERE " +
			" link = '" +
			post.link +
			"' AND " +
			" datetime = '" +
			post.datetime +
			"'"

		return pool.query(query).then(function() {
			return true
		})
	}

	/**
	 * Fetch one post, based by its link. Can return future posts.
	 * @param {String} link - The post's link.
	 * @param {"life"|"tech"} section A String representing the section of the site.
	 * @returns {Promise.<DbResult>} A promise that contains a {@link DbResult}.
	 */
	static fetchPost(link, section) {
		return Db.fetchPosts(DbConfig.post(link, section))
	}

	/**
	 * Fetch posts that contain the query in the title or body.
	 * @param {String} query - The query to search for.
	 * @param {int} page - The page we want posts for.
	 * @param {"life"|"tech"} section A String representing the section of the site.
	 * @returns {Promise.<DbResult>} A promise that contains a {@link DbResult}.
	 */
	static searchPosts(query, page, section) {
		return Db.fetchPosts(DbConfig.search(query, page, section))
	}

	/**
	 * Fetch all posts, even future ones.
	 * @returns {Promise.<DbResult>} A promise that contains a {@link DbResult}.
	 */
	static fetchPostsForUpdating() {
		return Db.fetchPosts(DbConfig.update())
	}

	/**
	 * Fetch title, link and datetime fields of all posts, except future ones.
	 * @param {"life"|"tech"} section A String representing the section of the site.
	 * @returns {Promise.<DbResult>} A promise that contains a {@link DbResult}.
	 */
	static fetchArchivePosts(section) {
		return Db.fetchPosts(DbConfig.archive(section))
	}

	/**
	 * Fetch all posts, except future ones.
	 * @param {"life"|"tech"} section A String representing the section of the site.
	 * @returns {Promise.<DbResult>} A promise that contains a {@link DbResult}.
	 */
	static fetchFeedPosts(section) {
		return Db.fetchPosts(DbConfig.feed(section))
	}

	/**
	 * Fetch link, modified and datetime fields of all posts, except future ones.
	 * @returns {Promise.<DbResult>} A promise that contains a {@link DbResult}.
	 */
	static fetchSiteMapPosts() {
		return Db.fetchPosts(DbConfig.siteMap())
	}

	/**
	 * Fetch posts, creating the query based on the config.
	 * @param {DbConfig} config - An object on which the creation of the db query is based on.
	 * @returns {Promise.<DbResult>} A promise that contains a {@link DbResult}.
	 */
	static async fetchPosts(config) {
		//	pool.query(
		//		'CREATE TABLE posts(title VARCHAR(100), body VARCHAR(99999), truncatedbody VARCHAR(5000), datetime VARCHAR(50), modified VARCHAR(55), link VARCHAR(100), readingtime VARCHAR(15))'
		//	);

		let query =
			"SELECT " +
			config.columns +
			" FROM " +
			postsTableForSection(config.section)
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
			} else {
				query +=
					" WHERE " +
					config.fields[0] +
					" = '" +
					config.fieldValues[0] +
					"'"
			}
		}
		query +=
			" ORDER BY " +
			(config.orderBy || "datetime") +
			" " +
			(config.orderDirection || "ASC")

		const result = await pool.query(query)
		const res = new DbResult()
		res.totalPages = parseInt(result.rows.length / config.limit, 10) + 1

		let posts = result.rows.reverse()

		if (!config.updating && config.limit !== 1) {
			const date = new Date()
			const utcDate = new Date(
				Date.UTC(
					date.getUTCFullYear(),
					date.getUTCMonth(),
					date.getUTCDate(),
					date.getUTCHours(),
					date.getUTCMinutes(),
					date.getUTCSeconds(),
					date.getUTCMilliseconds()
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
				pattern = pattern.slice(0, -1)
				const regex = new RegExp(pattern, "gi")

				// Marking won"t work inside code blocks, because styling is applied via script
				truncatedBody = truncatedBody.replace(
					regex,
					'<mark class="search">$&</mark>'
				)

				// Open <, and match any number of characters except >, and only then match marks,
				// otherwise it would just match up until a later >, and most likely include the marks too.
				const matches = truncatedBody.match(
					/<[^>]*?<mark class="search">.+?<\/mark>.*?>/gi
				)

				if (matches) {
					matches.forEach(function(match) {
						truncatedBody = truncatedBody.replace(
							match,
							match.replace(/<\/mark>|<mark class="search">/gi, "")
						)
					})
				}
			}

			return new Post(
				rawPost.title,
				rawPost.body,
				rawPost.rawbody,
				truncatedBody,
				rawPost.firstparagraph,
				rawPost.authorid,
				rawPost.datetime,
				rawPost.date,
				rawPost.isodate,
				rawPost.modified,
				rawPost.link,
				rawPost.readingtime
			)
		})

		return res
	}
}

export default Db
