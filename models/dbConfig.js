/**
 * Created by roland on 13/7/16.
 */

/**
 * An object to wrap all configs required for DB handling.
 * @property {Boolean} updating - If we are doing an update, all posts must be fetched, including future ones.
 * @property {Boolean} searching - If we are doing a search, the query will be done by all fields, not just link and datetime, false by default.
 * @property {String} columns - The columns to fetch, * by default. On archive, we only want the titles, for example.
 * @property {String[]} fields - The fields to do the query by, usually for search, null by default.
 * @property {String[]} fieldValues - The fields' values to do the query by, usually for search, null by default.
 * @property {String} orderBy - The ordering field to do the query by, datetime by default.
 * @property {String} orderDirection - The direction of ordering, ASC by default.
 * @property {int} pageSize - The number of posts to return, env.PAGE_SIZE by default.
 * @property {int} offset - The offset where to return posts from, for page x > 1, 0 by default.
 * @property {int} limit - The number of posts to return, env.PAGE_SIZE || 10 by default.
 * @constructor
 */
function DbConfig() {
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

/**
 * Limit one, link as field, and the post's link as fieldValue.
 * @param {String} link - The post's link to fetch it by.
 * @returns {DbConfig} The {@link DbConfig} object.
 */
DbConfig.post = function(link) {
	const config       = new DbConfig()
	config.fields      = ['link']
	config.fieldValues = [link]
	config.limit       = 1

	return config
}

/**
 * Offset set to limit * page - 1.
 * @param {int} page - The page we want posts for.
 * @returns {DbConfig} The {@link DbConfig} object.
 */
DbConfig.page = function(page) {
	const  config = new DbConfig()
	config.offset = config.limit * (page - 1)

	return config
}

/**
 * Zero limit and updating set to true.
 * @returns {DbConfig} The {@link DbConfig} object.
 */
DbConfig.update = function() {
	const config = new DbConfig()
	config.limit = 0
	config.updating = true

	return config
}

/**
 * Zero limit.
 * @returns {DbConfig} The {@link DbConfig} object.
 */
DbConfig.feed = function() {
	const config = new DbConfig()
	config.limit = 0

	return config
}

/**
 * Zero limit, and link, modified and datetime columns.
 * @returns {DbConfig} The {@link DbConfig} object.
 */
DbConfig.siteMap = function() {
	const config = new DbConfig()
	config.limit = 0
	config.columns = 'link, modified, datetime'

	return config
}

/**
 * Zero limit, and title, link and datetime columns.
 * @returns {DbConfig} The {@link DbConfig} object.
 */
DbConfig.archive = function() {
	const  config  = new DbConfig()
	config.limit   = 0
	config.columns = 'title, link, datetime'

	return config
}

/**
 * Zero limit, searching true, body and title as fields and the query as a field value.
 * @param {String} query - The strings we want to search for.
 * @returns {DbConfig} The {@link DbConfig} object.
 */
DbConfig.search = function(query) {
	const config = new DbConfig()
	config.limit = 0
	config.searching = true
	config.fields      = ['body', 'title']
	config.fieldValues = [query]

	return config
}

module.exports = DbConfig
