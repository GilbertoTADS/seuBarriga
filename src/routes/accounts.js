module.exports = (app) => {
    
    const findAll = (req, res) => {
        app.services.accounts.findAll()
            .then( result => {
                res.status(200).json(result)
            })
    }   

    const create = (req, res) => {
        app.services.accounts.save(req.body)
            .then( result =>{
                res.status(201).json(result[0])
            })
    }

    const getById = (req, res) => {
        let { id } = req.params
        app.services.accounts.findAll( { user_id: id })
            .then( result => {
                res.status(200).json(result[0])
            })
    }
    const updateById = (req, res) => {
        app.services.accounts.update(req.params.id,req.body)
            .then( result => {
                res.status(200).json(result[0])
            })
    }

    return { findAll,create, getById, updateById }
}