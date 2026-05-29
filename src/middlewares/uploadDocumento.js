const multer = require('multer');
const path   = require('path');
const crypto = require('crypto');
const fs     = require('fs');

// Garante que o diretório de destino existe
const dest = path.join(__dirname, '..', '..', 'public', 'uploads', 'documentos');
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dest),
  filename: (_req, file, cb) => {
    const ext    = path.extname(file.originalname).toLowerCase();
    const unique = crypto.randomBytes(12).toString('hex');
    cb(null, `doc-${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext)
    ? cb(null, true)
    : cb(new Error('Apenas PDF, JPG, PNG ou WebP são permitidos'), false);
};

const uploadDocumento = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = uploadDocumento;
