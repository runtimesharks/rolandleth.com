/**
 * Created by roland on 14/7/16.
 */

/**
 * A simple object to wrap the results.
 * @property {Post[]} posts - An array of {@link DbConfig.pageSize} posts.
 * @property {int} totalPosts - The total number of posts in the db.
 * @constructor
 */
class DbResult {
	
	constructor() {
		this.posts      = []
		this.totalPosts = 0
	}
	
}

module.exports = DbResult
