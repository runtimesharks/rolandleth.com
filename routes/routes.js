/**
 * Created by roland on 3/7/16.
 */

var router = require('express').Router()

router.use('/about', require('./about'))
router.use('/archive', require('./archive'))
router.use('/privacy-policy', require('./privacy-policy'))
router.use('/projects', require('./projects/projects'))
router.use('/search', require('./search'))
router.use('/cmd.sync', require('./sync'))
router.use(/^\/(\d+)/, require('./page'))
router.use(/^\/([\w\d\-]+)/, require('./article'))
router.use('/', require('./page'))
router.use('*', function(req, res) {
	res.render('not-found', {
		title: 'Not found',
		metadata: 'Development thoughts by Roland Leth.'
	})
})

module.exports = router