const { Router } = require('express');
const NotificacaoController = require('../controllers/NotificacaoController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

const router = Router();
const notificacaoController = new NotificacaoController();

router.get('/', authMiddleware, isAdmin, notificacaoController.listar);
router.patch('/:id/lida', authMiddleware, isAdmin, notificacaoController.marcarComoLida);

module.exports = router;
