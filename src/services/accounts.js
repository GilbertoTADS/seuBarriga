module.exports = (app) => {

     const findAll = async (filter = {}) => {
        return app.db('accounts').select().where(filter)
    }
    
    const confirmInsert = (account) => {
        return app.db('accounts').select().where('user_id',account.user_id)
    }

    const save = async (account) => {
        if(!account.name) return { error:'Nome é um atributo obrigatório' }

        return app.db('accounts').insert(account)
            .then( result =>  confirmInsert(account) )
    }
    const update = (id, account) => {
        return app.db('accounts').update(account).where( {id} )
            .then( Confirm => findAll( {id}) )
    }
    const deleteById = (id) => {
        return app.db('accounts').del().where({id})
    }
    return {findAll, save, confirmInsert, update, deleteById}
}