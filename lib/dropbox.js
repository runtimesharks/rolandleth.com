/**
 * Created by roland on 6/7/16.
 */

'use strict'

const request = require('request')
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

/**
 * Creates a file from a POST request body.
 * @param {Object} body - The body of the POST request.
 * @returns {Promise} A promise that contains true if successful.
 */
Dropbox.createFile = function(body) {
	return new Promise(function(resolve) {
		const fileContents = body.title + '\n\n' + body.body
		const fileName = 'posts/' + body.datetime + '-' + body.title + '.md'

		var options = {
			method: 'PUT',
			url: 'https://api-content.dropbox.com/1/files_put/auto/' + fileName + '?overwrite',
			headers: {
				'Content-Type': 'text/plain',
				Authorization: 'Bearer ' + process.env.DB_ACCESS_TOKEN
			},
			body: fileContents
		}

		request(options, function(err) {
			if (err) {
				console.log('Creating ' + fileName + ' failed.')
			}
			else {
				resolve(true)
			}
		})
	})
}

module.exports = Dropbox
