module.exports = (app) => {

     const findAll = async (filter = {}) => {
        return app.db('accounts').select().where(filter)
    }
    
    const confirmInsert = (account) => {
        return app.db('accounts').select().where('user_id',account.user_id)
    }

    const save = (account) => {
        return app.db('accounts').insert(account)
            .then( result =>  confirmInsert(account) )
    }
    const update = (id, account) => {
        return app.db('accounts').update(account).where( {id} )
            .then( Confirm => findAll( {id}) )
    }
    return {findAll, save, confirmInsert, update}
}