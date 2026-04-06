const { Router } = require('express');
const { body } = require('express-validator');
const PetController = require('../controllers/PetController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const validate = require('../middlewares/validate');

const router = Router();
const petController = new PetController();

router.get('/', petController.listar);
router.get('/:id', petController.detalhe);

router.post('/', authMiddleware, isAdmin, [
  body('nome').notEmpty().withMessage('O campo nome é obrigatório'),
  body('especie').isIn(['cachorro', 'gato', 'outro']).withMessage('Espécie inválida'),
  body('porte').isIn(['pequeno', 'medio', 'grande']).withMessage('Porte inválido'),
  body('idade').isInt({ min: 0 }).withMessage('Idade deve ser um número inteiro positivo'),
  body('sexo').isIn(['macho', 'femea']).withMessage('Sexo inválido'),
  body('historico_saude').notEmpty().withMessage('O histórico de saúde é obrigatório'),
  body('descricao').optional(),
  body('imagem_url').optional(),
  validate,
], petController.criar);

router.put('/:id', authMiddleware, isAdmin, [
  body('nome').optional().notEmpty().withMessage('O campo nome não pode ser vazio'),
  body('especie').optional().isIn(['cachorro', 'gato', 'outro']).withMessage('Espécie inválida'),
  body('porte').optional().isIn(['pequeno', 'medio', 'grande']).withMessage('Porte inválido'),
  body('idade').optional().isInt({ min: 0 }).withMessage('Idade deve ser um número inteiro positivo'),
  body('sexo').optional().isIn(['macho', 'femea']).withMessage('Sexo inválido'),
  body('historico_saude').optional().notEmpty().withMessage('O histórico de saúde não pode ser vazio'),
  body('descricao').optional(),
  body('imagem_url').optional(),
  validate,
], petController.atualizar);

router.delete('/:id', authMiddleware, isAdmin, petController.excluir);

module.exports = router;
