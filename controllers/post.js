/**
 * Created by roland on 1/7/16.
 */

function Post(name, body) {
	var internal = "internal"

	this.name = name
	this.body = body

	this.perk = function(arg) {
		return "perkone " + arg
	}
}

module.exports = Post