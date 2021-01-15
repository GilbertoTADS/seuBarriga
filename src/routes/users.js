module.exports = (app) => {

    const findAll = () => {
        app.get('/users', (req, res)=>{
            app.db('users').select()
                .then( result => res.status(200).json(result))
        })
    }    
    
    const create = () => {
        app.post('/users', async (req, res)=>{
            app.db('users').insert(req.body)
            .then( success => {
                app.db('users').select().where('mail',req.body.mail)
                    .then( result => {
                        console.log(result[0].id)
                        res.status(201).json(result[0])
                    })
            } )
        })
    }
    return { findAll, create}
}