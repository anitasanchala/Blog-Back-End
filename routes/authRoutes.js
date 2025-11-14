const { Router } = require('express');
const { register, login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authmiddleware');
const router = Router();

router.post('/register', register);
router.post('/login', login);// verifyToken()

module.exports = router;