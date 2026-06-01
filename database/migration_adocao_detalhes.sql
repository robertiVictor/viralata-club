-- Migração: adiciona campos detalhados à tabela adocoes
ALTER TABLE adocoes
  ADD COLUMN IF NOT EXISTS perguntas JSONB,
  ADD COLUMN IF NOT EXISTS doc_identidade_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS foto_local_url VARCHAR(500);
