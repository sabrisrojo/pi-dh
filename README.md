
# Projeto Integrador - Digital House
## Grupo 5 - Fev/2023

### Instalação

Clonar o projeto do repositório usando o terminal ou sua IDE de preferência
```bash
  git clone https://github.com/sabrisrojo/pi-dh.git
  cd pi-dh
```

Estando na raiz do projeto, instalar das dependências atráves do comando:
```bash
  npm install
```

Para iniciar o projeto é necessário ter MySQL instalado e é necessário configurar um arquivo ".env" com os dados do banco e usuário com acesso admin, um exemplo foi fornecido e se encontra na raiz do projeto ".env.example"

```bash
## ESSE ARQUIVO DEVE SER ALTERADO DE .ENV.EXAMPLE PARA .ENV PARA QUE O PROJETO FUNCIONE ##
DB_USER=root

## UTILIZAR A SENHA GERADA DURANTE A INSTALAÇÃO DO MYSQL ##
## Exemplo
## DB_PWD=senha_do_banco
DB_PWD=

## CRIAR UM BANCO DE DADOS QUALQUER E SUBSTITUIR O NOME AQUI ##
## Exemplo
## DB_NAME=pi_dh
DB_NAME=

## DADOS PADRÕES DO MYSQL ##
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
```

Feita a configuração do arquivo .env, na pasta raiz do projeto, rodar o comando "npm start" ou "npm run dev" que utiliza nodemon e permite hot reload
```bash
  npm run dev
```

Uma mensagem no console dizendo "Database synchronized." representará o sucesso na instalação e execução do projeto.
