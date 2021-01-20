//Midlewares são funções que serão executadas antes das requisições http 
const bodyParser =  require('body-parser')
const cors = require('cors')
const knexLogger = require('knex-logger')

module.exports = (app)=>{
    app.use(knexLogger(app.db))//para criar logs em app.db
    app.use(cors())    
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))
}
