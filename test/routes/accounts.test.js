const request = require('supertest');
const app = require('./../../src/app')

const MAIN_ROUTE = '/accounts'
let user;

beforeAll(async()=>{
    const res = await app.services.users.save({name:"gilberto", mail:`${Date.now()}@mail.com`, passwd:'123456'})
    user = { ...res[0] }
})

test('Deve inserir uma conta com sucesso', () => {
    return request(app).post(MAIN_ROUTE)
        .send({name:'Ac #1', user_id: user.id })
        .then( result => {
            expect(result.status).toBe(201)
            expect(result.body.name).toBe('Ac #1')
        })
})
test('Deve listar todas as contas', () => {
    return request(app).get(MAIN_ROUTE)
        .then(result => {
        expect(result.status).toBe(200)
        expect(result.body.length).toBeGreaterThan(0)
    })
})
test('Deve retornar uma conta por id', async() => {
    const account = await request(app).post(MAIN_ROUTE)
        .send({name:'Ac list', user_id: user.id })
    
    const result = await request(app).get(`${MAIN_ROUTE}/${account.body.user_id}`)
    expect(result.status).toBe(200)
    expect(result.body.name).toBe('Ac #1')
    expect(result.body.id).toBe(account.body.id)
        
})
test('Deve alterar uma conta por id', async () => {
    const account = await request(app).post(MAIN_ROUTE)
        .send({name:'Ac To Update', user_id: user.id })
    
    const result = await request(app).put(`${MAIN_ROUTE}/${account.body.user_id}`)
        .send({name:'Ac Updated'})
    expect(result.status).toBe(200)
    expect(result.body.name).toBe('Ac Updated')
    expect(result.body.id).toBe(account.body.user_id)
        
})