/**
 * Created by roland on 3/7/16.
 */

var router = require('express').Router()

router.use('/', require('./index'))
router.use('/about', require('./about'))
router.use('/archive', require('./archive'))
router.use('/privacy-policy', require('./privacy-policy'))
router.use('/projects', require('./projects/projects'))
router.use('*', function(req, res) {
	res.render('not-found', {
		title: 'Not found',
		metadata: 'Development thoughts by Roland Leth.'
	})
})

module.exports = router