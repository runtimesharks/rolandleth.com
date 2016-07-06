/**
 * Created by roland on 6/7/16.
 */

var dropbox = require('node-dropbox').api(process.env.DB_ACCESS_TOKEN)

function Dropbox() {}

Dropbox.getFolder = function(path) {
	return new Promise(function(resolve, reject) {
		dropbox.getMetadata(path,  function(error, result, folder) {
			if (error) {
				reject(new Error('Getting ' + path + ' failed.'))
			}
			else {
				resolve(folder)
			}
		})
	})
}

Dropbox.getFile = function(path) {
	return new Promise(function(resolve, reject) {
		dropbox.getFile(path, function(error, result, file) {
			if (error) {
				reject(new Error('Getting ' + path + ' failed.'))
			}
			else {
				resolve(file)
			}
		})
	})
}

module.exports = Dropbox