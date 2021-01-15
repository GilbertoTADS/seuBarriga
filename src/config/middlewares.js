//Midlewares são funções que serão executadas antes das requisições http 
const bodyParser =  require('body-parser')

module.exports = (app)=>{
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
}
