/**
 * Created by roland on 3/7/16.
 */

var router = require('express').Router()

router.use('/', require('./index'))
router.use('/about', require('./about'))
router.use('/archive', require('./archive'))
router.use('/privacy-policy', require('./privacy-policy'))

module.exports = router