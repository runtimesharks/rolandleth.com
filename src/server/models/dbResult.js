/**
 * A simple object to wrap the results.
 * @property {Post[]} posts - An array of {@link DbConfig.pageSize} posts.
 * @property {int} totalPages - The total number of pages.
 * @constructor
 */
class DbResult {
	constructor() {
		this.posts = []
		this.totalPages = 0
	}
}

export default DbResult
