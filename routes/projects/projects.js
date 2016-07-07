/**
 * Created by roland on 4/7/16.
 */

var router = require('express').Router()

router.use('/carminder', require('./carminder'))
router.use('/expenses-planner', require('./expenses-planner'))
router.use('/bouncyb', require('./bouncyb'))
router.use('/sosmorse', require('./sosmorse'))
router.use('/iwordjuggle', require('./iwordjuggle'))

router.get('/', function(req, res) {
	res.render('projects', {
		title: 'Projects',
		metadata: 'iOS, Ruby, Node and JS projects by Roland Leth.'
	})
})

module.exports = router
