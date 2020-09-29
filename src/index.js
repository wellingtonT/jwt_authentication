const http = require('http');
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require("dotenv-safe").config();
var jwt = require('jsonwebtoken');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Função de validação do token
function verifyJWT(req, res, next){
    var token = req.headers['token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Não foi recebido nenhum token.' });

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Token inválido.' });

      req.userId = decoded.id;
      next();
    });
}

app.get('/', (req, res) => {
    res.json({message: "Pong!!"});
})

// Adicionar a função verifyJWT nas rotas que queira proteget
app.get('/clientes', verifyJWT, (req, res) => {
    console.log("Sucesso ao retornar todos os clientes.");
    res.json([{id:1,nome:'luiz'}]);
})

// Rota de login, para realizar a autenticação
app.post('/login', (req, res, next) => {
    // Simulação do banco de dados para validar as informações
    if(req.body.user === 'luiz' && req.body.pwd === '123'){
      const id = 1; // ID retornado do BD
      var token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300 // Dado em segundos
      });
      return res.json({ auth: true, token: token });
    }

    res.status(500).json({message: 'Login inválido!'});
});

app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
});

const server = http.createServer(app);
server.listen(3000);
console.log("Servidor escutando na porta 3000...")