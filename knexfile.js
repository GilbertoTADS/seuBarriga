module.exports = {
    test:{
        client: 'mysql',
        connection:{
            host:'localhost',
            user:'root',
            password:'root',
            database:'seuBarriga'
        },
    migrations:{
        directory:'src/migrations',
        }
    }

}