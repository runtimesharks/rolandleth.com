/**
 * Created by roland on 6/7/16.
 */

function NotFound() {}

NotFound.show = function(res, search) {
	res.render('not-found' + (search ? '-search' : ''), {
		title: '404',
		metadata: 'Development thoughts by Roland Leth'
	})
	res.end()
}

module.exports = NotFound