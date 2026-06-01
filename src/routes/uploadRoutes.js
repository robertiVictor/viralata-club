const { Router } = require('express');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const upload = require('../middlewares/upload');
const ResponseFactory = require('../helpers/ResponseFactory');

const router = Router();

// Multer para documentos de adoção (imagem + PDF, qualquer usuário autenticado)
const uploadAdocao = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'public', 'uploads')),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `adocao-${crypto.randomBytes(12).toString('hex')}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Formato não permitido. Use JPG, PNG, WebP ou PDF.'), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/imagem', authMiddleware, isAdmin, upload.single('imagem'), (req, res) => {
  if (!req.file) return ResponseFactory.error(res, 'Nenhuma imagem enviada', 400);
  return ResponseFactory.success(res, { url: `/uploads/${req.file.filename}` }, 'Imagem enviada com sucesso');
});

router.post('/adocao', authMiddleware, uploadAdocao.fields([
  { name: 'doc', maxCount: 1 },
  { name: 'foto_local', maxCount: 1 },
]), (req, res) => {
  const result = {};
  if (req.files?.doc?.[0]) result.doc_url = `/uploads/${req.files.doc[0].filename}`;
  if (req.files?.foto_local?.[0]) result.foto_url = `/uploads/${req.files.foto_local[0].filename}`;
  if (!result.doc_url && !result.foto_url) return ResponseFactory.error(res, 'Nenhum arquivo enviado', 400);
  return ResponseFactory.success(res, result, 'Arquivos enviados com sucesso');
});

module.exports = router;
