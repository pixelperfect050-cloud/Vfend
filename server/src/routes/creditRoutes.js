const router = require('express').Router();
const { getCredits, useCredits } = require('../controllers/creditController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getCredits);
router.post('/use', auth, useCredits);

module.exports = router;
