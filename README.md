#LINK DOCUMENTAÇÃO: https://app.notion.com/p/ViraLata-Club-Documenta-o-T-cnica-3728eed5821e807786a2c11661ecfc29

# COMO RODAR O PROJETO

# Clonar repositório
git clone https://github.com/seu-usuario/viralata-club.git
cd viralata-club

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Criar banco de dados
psql -U postgres -c "CREATE DATABASE viralata_club;"

# Executar DDL
psql -U postgres -d viralata_club -f database/schema.sql

# Iniciar servidor
npm run dev
