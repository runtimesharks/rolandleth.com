/**
 * Created by roland on 4/7/16.
 */

var router = require('express').Router()

router.get('/', function(req, res) {
	res.render('expenses-planner')
})

router.get('/press-kit', function(req, res) {
	res.download('./assets/files/Expenses Planner Press Kit.zip', 'Expenses Planner Press Kit.zip')
})

module.exports = router
