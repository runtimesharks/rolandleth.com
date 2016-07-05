/**
 * Created by roland on 5/7/16.
 */

function DBConfig() {
	this.columns        = '*'
	this.field          = null
	this.fieldValue     = null
	this.orderBy        = 'datetime'
	this.orderDirection = 'ASC'
	this.pageSize       = process.env.PAGE_SIZE || 10
	this.offset         = 0
	this.limit          = null
}
module.exports = DBConfig