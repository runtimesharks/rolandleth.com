/**
 * Created by roland on 6/7/16.
 */

var router  = require('express').Router()
var Dropbox = require('../lib/dropbox')
var Post    = require('../models/post')
var DB       = require('../lib/db')

router.get('/', function(req, res) {
	Dropbox.getFolder('/Apps/Editorial/posts')
		.then(function(folder) {
			var posts = []

			folder.contents.forEach(function(item) {
				var matches  = item.path.match(/\/(apps)\/(editorial)\/(posts)\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\/\}\{\[\]_#&@$:"';,!=\?\+\*\-\)\(]+)\.md$/)
				var datetime = matches[4] + '-' + matches[5] + '-' + matches[6] + '-' + matches[7]
				var link     = matches[8]
				link         = link.replace(new RegExp(/([#,;!:"\'\.\?\[\]\{\}\(\$\/)]+)/, 'g'), '')
				link         = link.replace(new RegExp('&', 'g'), 'and')
				link         = link.replace(new RegExp(' ', 'g'), '-')
				link         = link.toLowerCase()

				var title    = ''
				var body     = ''
				var modified = item.client_mtime

				Dropbox.getFile(item.path)
					.then(function(file) {
						var lines = file.toString().split('\n')
						title     = lines[0]
						lines.splice(0, 2)
						body = lines.join('\n')

						posts.push(
							new Post(title, body, '', datetime, modified, link)
						)

						if (folder.contents[folder.contents.length - 1] == item) {
							posts.forEach(function(post) {
								var config = new DB.Config()


							})
							res.redirect('/')
						}
					})
					.catch(function(error) {
						console.log(error)
					})
			})
		})
		.catch(function(error) {
			console.log(error)
		})
})

module.exports = router