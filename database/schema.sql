-- ViraLata Club - Schema do Banco de Dados
-- PostgreSQL 14+

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tipos ENUM
CREATE TYPE role_enum AS ENUM ('adotante', 'admin');
CREATE TYPE especie_enum AS ENUM ('cachorro', 'gato', 'outro');
CREATE TYPE porte_enum AS ENUM ('pequeno', 'medio', 'grande');
CREATE TYPE sexo_enum AS ENUM ('macho', 'femea');
CREATE TYPE pet_status_enum AS ENUM ('disponivel', 'em_analise', 'adotado');
CREATE TYPE adocao_status_enum AS ENUM ('pendente', 'em_analise', 'aprovada', 'rejeitada');

-- Tabela USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  role role_enum NOT NULL DEFAULT 'adotante',
  bloqueado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela PETS
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  especie especie_enum NOT NULL,
  porte porte_enum NOT NULL,
  idade INTEGER NOT NULL CHECK (idade >= 0),
  sexo sexo_enum NOT NULL,
  historico_saude TEXT NOT NULL,
  status pet_status_enum NOT NULL DEFAULT 'disponivel',
  descricao TEXT,
  imagem_url VARCHAR(500),
  cidade VARCHAR(100),
  estado CHAR(2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela ADOCOES
CREATE TABLE adocoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  adotante_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status adocao_status_enum NOT NULL DEFAULT 'pendente',
  mensagem TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela NOTIFICACOES
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  adocao_id UUID NOT NULL REFERENCES adocoes(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT,
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_especie ON pets(especie);
CREATE INDEX idx_pets_estado ON pets(estado);
CREATE INDEX idx_pets_cidade ON pets(cidade);
CREATE INDEX idx_adocoes_pet ON adocoes(pet_id);
CREATE INDEX idx_adocoes_adotante ON adocoes(adotante_id);
CREATE INDEX idx_notificacoes_admin ON notificacoes(admin_id);

-- Trigger para atualizar updated_at em pets
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_adocoes_updated_at
  BEFORE UPDATE ON adocoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed: criar admin padrão (senha: Admin@123)
-- Hash bcryptjs de 'Admin@123'
INSERT INTO users (nome, email, senha_hash, role)
VALUES ('Admin ONG', 'admin@viralataclub.com', '$2a$10$hfIS5rQ75CI4oR5s9Hx1cuNfkO3s.DnuO3IPBO0Y10eolNQXLFTru', 'admin');
