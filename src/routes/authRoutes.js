const { Router } = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');

const router = Router();
const authController = new AuthController();

router.post('/register', [
  body('nome').notEmpty().withMessage('O campo nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
  body('telefone').optional(),
  validate,
], authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('E-mail inválido'),
  body('senha').notEmpty().withMessage('O campo senha é obrigatório'),
  validate,
], authController.login);

router.get('/me', authMiddleware, authController.me);

module.exports = router;
