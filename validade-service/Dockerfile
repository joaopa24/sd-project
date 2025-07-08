FROM node:20

# Define o diretório de trabalho no container
WORKDIR /app

# Copia apenas as dependências primeiro (para otimizar o cache)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o restante do código, incluindo produtos.json e utils/
COPY . .

# Expõe a porta do serviço (igual à porta usada no app.js)
EXPOSE 5000

# Comando para iniciar o app
CMD ["node", "app.js"]
