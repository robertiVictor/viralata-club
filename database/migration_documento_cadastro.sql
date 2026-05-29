-- Migração: Documento de identificação e aprovação de cadastro
-- ViraLata Club — 2026/1

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS documento_url    VARCHAR(500),
  ADD COLUMN IF NOT EXISTS status_cadastro  VARCHAR(20) NOT NULL DEFAULT 'pendente';

-- Usuários já existentes (admin e demais) ficam aprovados automaticamente
UPDATE users SET status_cadastro = 'aprovado';

-- Adicionar constraint de validação (usando DO para ser idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_status_cadastro'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT chk_status_cadastro
      CHECK (status_cadastro IN ('pendente', 'aprovado', 'rejeitado'));
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_users_status_cadastro ON users(status_cadastro);
