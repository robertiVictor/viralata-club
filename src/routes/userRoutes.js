const { Router } = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin        = require('../middlewares/isAdmin');

const router = Router();
const userController = new UserController();

router.get('/',                         authMiddleware, isAdmin, userController.listar);
router.get('/pendentes',                authMiddleware, isAdmin, userController.listarPendentes);
router.patch('/:id/bloquear',           authMiddleware, isAdmin, userController.bloquear);
router.patch('/:id/aprovar-cadastro',   authMiddleware, isAdmin, userController.aprovarCadastro);
router.patch('/:id/rejeitar-cadastro',  authMiddleware, isAdmin, userController.rejeitarCadastro);
router.delete('/:id',                   authMiddleware, isAdmin, userController.excluir);

module.exports = router;
