const { Router } = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

const router = Router();
const userController = new UserController();

router.get('/', authMiddleware, isAdmin, userController.listar);
router.patch('/:id/bloquear', authMiddleware, isAdmin, userController.bloquear);
router.delete('/:id', authMiddleware, isAdmin, userController.excluir);

module.exports = router;
