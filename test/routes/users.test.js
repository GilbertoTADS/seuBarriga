const request = require('supertest')


const app = require('../../src/app.js')

const mail = `${Date.now()}@mail.com`

test('Deve listar todos os usuarios',()=>{
    return request(app).get('/users')
        .then( res =>{
            expect(res.status).toBe(200)
            expect(res.body.length).toBeGreaterThan(0)//É maio que zero?
        })
})
test('Deve inserir usuario com sucesso',()=>{
    
    return request(app).post('/users')
        .send({ name:'Gilberto', mail ,passwd:'123456'})
        .then( res => {
            expect(res.status).toBe(201)
            expect(res.body.name).toBe('Gilberto')//post retorna o valor do recurso criado, então: é igual ao enviado?
        })
})

test('Não deve inserir um usuário sem nome', () => {
    return request(app).post('/users')
        .send( { mail ,passwd:'123456'})
        .then( res => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Nome é um atributo obrigátorio')
        })
})
test('Não deve criar um usuário sem e-mail', async () => { //outra forma de fazer teste
    const result = await request(app).post('/users')
        .send({ name:'Gilberto',passwd:'123456'})
    
    expect(result.status).toBe(400)
    expect(result.body.error).toBe('E-mail é um atributo obrigátorio')
    
})
test('Não deve inserir um usuário sem senha', (done) => {//outra forma de fazer testes
    request(app).post('/users')
        .send({ name:'Gilberto', mail })
        .then( res => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Senha é um atributo obrigátorio')

            done()//indica a finalização do teste
        })
        .catch(error => done.fail(error))//quando há um erro
})
test('Não deve inserir usuario com email existente',() =>{
    return request(app).post('/users')
        .send({ name:'Gilberto', mail ,passwd:'123456'})
        .then( res => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Já existe um usuário com este e-mail')
        })
})