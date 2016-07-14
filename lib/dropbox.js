/**
 * Created by roland on 6/7/16.
 */

'use strict'

const dropbox = require('node-dropbox').api(process.env.DB_ACCESS_TOKEN)

/**
 * @class
 * A namespace for all related Dropbox operations.
 */
function Dropbox() {}

/**
 * Fetches the metadata for a folder.
 * @param {String} path - The path of the folder to fetch.
 * @returns {Promise} A promise that contains the folder metadata.
 */
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

/**
 * Fetches the content of a file.
 * @param {String} path - The path of the file to fetch.
 * @returns {Promise} A promise that contains the file contents.
 */
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
