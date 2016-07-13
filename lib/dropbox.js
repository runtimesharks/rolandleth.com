/**
 * Created by roland on 6/7/16.
 */

'use strict'

const dropbox = require('node-dropbox').api(process.env.DB_ACCESS_TOKEN)

function Dropbox() {}

Dropbox.getFolder = function(path) {
	return new Promise(function(resolve) {
		dropbox.getMetadata(path, function(error, result, folder) {
			if (error) {
				console.log('Getting ' + path + ' failed.')
			}
			else {
				resolve(folder)
			}
		})
	})
}

Dropbox.getFile = function(path) {
	return new Promise(function(resolve) {
		dropbox.getFile(path, function(error, result, file) {
			if (error) {
				console.log('Getting ' + path + ' failed.')
			}
			else {
				resolve(file)
			}
		})
	})
}

module.exports = Dropbox
