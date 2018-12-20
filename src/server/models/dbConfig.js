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
class DbConfig {
	constructor() {
		this.updating = false
		this.searching = false
		this.columns = "*"
		this.fields = null
		this.fieldValues = null
		this.orderBy = "datetime"
		this.orderDirection = "ASC"
		this.limit = parseInt(process.env.PAGE_SIZE) || 10
		this.offset = 0
		this.accessibleOnlyByLink = false
		this.section = "tech"
	}

	/** * Limit one, link as field, and the post"s link as fieldValue.
	 * @param {String} link - The post"s link to fetch it by.
	 * @returns {DbConfig} The {@link DbConfig} object.
	 */
	static post(link) {
		const config = new DbConfig()
		config.fields = ["link"]
		config.fieldValues = [link]
		config.limit = 1

		return config
	}

	/**
	 * Offset set to limit * page - 1.
	 * @param {int} page - The page we want posts for.
	 * @returns {DbConfig} The {@link DbConfig} object.
	 */
	static page(page) {
		const config = new DbConfig()
		config.offset = config.limit * (page - 1)

		return config
	}

	/**
	 * Zero limit and updating set to true.
	 * @returns {DbConfig} The {@link DbConfig} object.
	 */
	static update() {
		const config = new DbConfig()
		config.limit = 0
		config.updating = true

		return config
	}

	/**
	 * Zero limit.
	 * @param {"life"|"tech"} section A String representing the section of the site.
	 * @returns {DbConfig} The {@link DbConfig} object.
	 */
	static feed(section) {
		const config = new DbConfig()
		config.limit = 0
		config.section = section

		return config
	}

	/**
	 * Zero limit, and link, modified and datetime columns.
	 * @returns {DbConfig} The {@link DbConfig} object.
	 */
	static siteMap() {
		const config = new DbConfig()
		config.limit = 0
		config.columns = "link, modified, datetime"

		return config
	}

	/**
	 * Zero limit, and title, link and datetime columns.
	 * @returns {DbConfig} The {@link DbConfig} object.
	 */
	static archive() {
		const config = new DbConfig()
		config.limit = 0
		config.columns = "title, link, datetime"

		return config
	}

	/**
	 * Zero limit, searching true, body and title as fields and the query as a field value.
	 * @param {String} query - The strings we want to search for.
	 * @param {Number} offset - The offset where to start from.
	 * @returns {DbConfig} The {@link DbConfig} object.
	 */
	static search(query, offset) {
		const config = new DbConfig()
		config.searching = true
		config.fields = ["body", "title"]
		config.fieldValues = [query]
		config.offset = offset

		return config
	}
}

export default DbConfig
