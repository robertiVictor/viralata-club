const { Router } = require('express');
const { body } = require('express-validator');
const AdocaoController = require('../controllers/AdocaoController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const validate = require('../middlewares/validate');

const router = Router();
const adocaoController = new AdocaoController();

router.post('/', authMiddleware, [
  body('pet_id').isUUID().withMessage('ID do pet inválido'),
  body('mensagem').optional(),
  validate,
], adocaoController.enviarInteresse);

router.get('/minhas', authMiddleware, adocaoController.listarMinhas);

router.get('/', authMiddleware, isAdmin, adocaoController.listarTodas);

router.patch('/:id/aprovar', authMiddleware, isAdmin, adocaoController.aprovar);
router.patch('/:id/rejeitar', authMiddleware, isAdmin, adocaoController.rejeitar);

module.exports = router;
