test('Devo conhecer as assertivas do jest',()=>{
    let number = null
    expect(number).toBeNull()//é nulo?
    number = 10
    expect(number).not.toBeNull()//não é nulo?
    expect(number).toBe(10)//igual a 10? obs: apenas compara igualdade entre variaveis simples
    expect(number).toEqual(10)//igual a 10?(2º forma)
    expect(number).toBeGreaterThan(9)//maior que 9?
    expect(number).toBeLessThan(11)//menor que 11?
})
test('Devo saber trabalhar com objetos',()=>{
    const obj = { name: 'John', email: 'john@mail.com'}
    expect(obj).toHaveProperty('name','John')//possui a propriedade 'name' e seu valor é 'John'?
    expect(obj.name).toBe('John')//O valor da propriedade name é 'John'?

    const obj2 = { name: 'John', email: 'john@mail.com'}
    expect(obj).toEqual(obj2)//obj é igual a obj2?
})