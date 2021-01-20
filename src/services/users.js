const { isGetAccessor } = require("typescript")

module.exports = (app) => {
    const findAll = ( filter = {} ) => {
       return app.db('users').where(filter).select()
    }
    const confirmInsert = (user) => {
        return app.db('users').select().where('mail',user.mail)
    }
    const save = async (user) => {
        if(!user.name ) return { error:'Nome é um atributo obrigátorio'}
        if(!user.mail) return { error:'E-mail é um atributo obrigátorio'}
        if(!user.passwd) return { error:'Senha é um atributo obrigátorio'}
        
        const userDb = await findAll({ mail:user.mail})
        if(userDb && userDb.length > 0) return { error: 'Já existe um usuário com este e-mail'}

        return app.db('users').insert(user)
            .then( singUp => {
                return confirmInsert(user)
            })
        
    }
    return { findAll, save, confirmInsert }
}
