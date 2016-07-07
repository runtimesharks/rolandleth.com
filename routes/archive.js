/**
 * Created by roland on 3/7/16.
 */

var router = require('express').Router()
var DB = require('../lib/db')

router.get('/', function(req, res) {
	var config     = new DB.Config()
	config.limit   = -1
	config.columns = 'title, link, datetime'

	DB.fetchPosts(config).then(function(data) {
		var wordedMonth = {
			'01': 'January',
			'02': 'February',
			'03': 'March',
			'04': 'April',
			'05': 'May',
			'06': 'June',
			'07': 'July',
			'08': 'August',
			'09': 'September',
			'10': 'October',
			'11': 'November',
			'12': 'December'
		}

		var groupedPosts = {}

		data.posts.forEach(function(post) {
			var matches = post.datetime.match(/(\d{4})-(\d{2})-(\d{2})-(\d{4})/)
			var year        = '_' + matches[1] // Just so it is forced as a string, thus ordered
			var month       = wordedMonth[matches[2]]
			var title = post.title
			var link = post.link

			if (!groupedPosts[year]) { groupedPosts[year] = {} }
			if (!groupedPosts[year][month]) { groupedPosts[year][month] = [] }

			groupedPosts[year][month].push({
				title: title,
				link: link
			})
		})

		res.render('archive', {
			title: 'Archive',
			metadata: 'Roland Leth\'s archive.',
			posts: groupedPosts
		})
	})
})

module.exports = router
