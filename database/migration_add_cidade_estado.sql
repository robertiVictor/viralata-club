-- Migração: adicionar colunas cidade e estado na tabela pets
-- Executar com: psql -U postgres -d viralata_club -f migration_add_cidade_estado.sql

ALTER TABLE pets
  ADD COLUMN IF NOT EXISTS cidade VARCHAR(100),
  ADD COLUMN IF NOT EXISTS estado CHAR(2);

CREATE INDEX IF NOT EXISTS idx_pets_estado ON pets(estado);
CREATE INDEX IF NOT EXISTS idx_pets_cidade ON pets(cidade);

-- Opcional: atualizar pets existentes com localização padrão
-- UPDATE pets SET cidade = 'São Paulo', estado = 'SP' WHERE cidade IS NULL;

SELECT 'Migração concluída: colunas cidade e estado adicionadas à tabela pets.' AS resultado;
