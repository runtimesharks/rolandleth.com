/**
 * Created by roland on 3/7/16.
 */

'use strict'

const router = require('express').Router()
const Db     = require('../lib/db')

router.get('/', function(req, res) {
	const wordedMonth = {
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

	Db.fetchArchivePosts().then(function(data) {
		let groupedPosts = {}

		data.posts.forEach(function(post) {
			const matches = post.datetime.match(/(\d{4})-(\d{2})-(\d{2})-(\d{4})/)
			const year        = '_' + matches[1] // Just so it is forced as a string, thus ordered
			const month       = wordedMonth[matches[2]]
			const title = post.title
			const link = post.link

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