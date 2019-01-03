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
		process.env.DATABASE_URL || `postgres://localhost/${process.env.USER}`
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

/**
 * @class
 * A namespace for all related database operations.
 */
class Db {
	static fields(post) {
		const fields =
			"(title, body, rawbody, truncatedbody, firstparagraph, authorid, datetime, date, isodate, modified, link, readingtime)"
		const values = [
			post.title,
			post.body,
			post.rawBody,
			post.truncatedBody,
			post.firstParagraph,
			post.authorid,
			post.datetime,
			post.date,
			post.isoDate,
			post.modified,
			post.link,
			post.readingTime
		]
		// A string that looks like "$1, $2, $3". prettier-ignore
		const placeholders =
			"(" +
			values.reduce((a, _, i) => [...a, `$${i + 1}`], []).join(", ") +
			")"

		return { fields, placeholders, values }
	}

	/**
	 * Create a new post.
	 * @param {Post} post - The post to be created.
	 * @param {String} section - The blog's section.
	 * @returns {Promise.<Boolean>} A promise that contains true or false, based on the success.
	 */
	static async createPost(post, section) {
		const table = postsTableForSection(section)
		const fields = this.fields(post)
		const query = `INSERT INTO ${table} ${fields.fields} VALUES ${
			fields.placeholders
		}`

		await pool.query(query, fields.values)

		return true
	}

	/**
	 * Delete a post, based on its link and datetime fields.
	 * @param {Post} post - The post to delete.
	 * @param {String} section - The blog's section.
	 * @returns {Promise.<Boolean>} A promise that contains true or false, based on the success.
	 */
	static async deletePost(post, section) {
		const table = postsTableForSection(section)
		const query = `DELETE FROM ${table} WHERE link = $2 AND datetime = $3`
		const values = [post.link, post.datetime]

		await pool.query(query, values)

		return true
	}

	/**
	 * Update a post, based on its link and datetime fields.
	 * @param {Post} post - The post to update.
	 * @param {"life"|"tech"} section A String representing the section of the site.
	 * @returns {Promise.<Boolean>} A promise that contains true or false, based on the success.
	 */
	static async updatePost(post, section) {
		const table = postsTableForSection(section)
		const fields = this.fields(post)

		const query = `UPDATE ${table} SET ${fields.fields} = ${
			fields.placeholders
		} WHERE link = $${fields.values.length + 1} AND datetime = $${fields
			.values.length + 2}`
		const values = fields.values.concat([post.link, post.datetime])

		await pool.query(query, values)

		return true
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

		const table = postsTableForSection(config.section)
		let query = `SELECT ${config.columns} FROM ${table}`
		const isQueried = config.fields && config.fieldValues
		let values = []

		if (isQueried) {
			query += " WHERE "
			let clauses = []

			config.fields.forEach(function(field) {
				config.fieldValues.forEach(function(value) {
					values.push(`%${value}%`)
					clauses.push(`${field} ILIKE $${values.length}`)
				})
			})

			query += clauses.join(" OR ")
		}

		const countQuery = query.replace(
			/SELECT .+? FROM/,
			"SELECT count(distinct link) FROM"
		)

		query += ` ORDER BY ${config.orderBy} ${config.orderDirection}`

		if (config.limit > 0) {
			query += ` LIMIT ${config.limit}`
		}

		query += ` OFFSET ${config.offset}`

		const result = await pool.query(query, values)
		const res = new DbResult()
		let posts = result.rows

		if (config.limit === 1) {
			res.totalPages = 1
		} else {
			const countResult = await pool.query(countQuery, values)
			const count = countResult.rows[0].count

			res.totalPages = parseInt(count / config.limit, 10) + 1
		}

		if (config.limit !== 1 && config.includeFuturePosts === false) {
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
				false,
				rawPost.title, // For archive we don't fetch this field, but we process it in the constructor
				rawPost.rawbody || "",
				rawPost.datetime,
				rawPost.imageurl,
				rawPost.authorid,
				rawPost.body,
				truncatedBody,
				rawPost.firstparagraph,
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
