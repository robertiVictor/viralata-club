const { Router } = require('express');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const upload = require('../middlewares/upload');
const ResponseFactory = require('../helpers/ResponseFactory');

const router = Router();

router.post('/imagem', authMiddleware, isAdmin, upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return ResponseFactory.error(res, 'Nenhuma imagem enviada', 400);
  }
  const url = `/uploads/${req.file.filename}`;
  return ResponseFactory.success(res, { url }, 'Imagem enviada com sucesso');
});

module.exports = router;
