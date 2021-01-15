const app =  require('express')()
const consign = require('consign')
const knex = require('knex')
const knexfile = require('./../knexfile')

app.db = knex(knexfile.test)//agora app tem a propriedade de conexao com banco de dados

consign({ cwd : 'src', verbose:false}) //diretório de ponto de partida
    .include('./config/middlewares.js')
        .then('./routes')
        .then('./config/routes.js')
        .into(app)

app.get('/',(req, res)=>{
    res.status(200).send()
})
module.exports = app