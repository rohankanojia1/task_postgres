const { Client } = require('pg')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let credentails = {
    user: 'user_1',
    password: 'user_1',
    host: 'localhost',
    port: '5432',
    database: 'users'
}


const utility = {
    connect: function(app){
        const client = new Client(credentails)
        client.connect()
        .then(() => console.log('Connected to db'))
        .then(() => client.query('SELECT * FROM USER_MASTER'))
        .catch(e => console.log('\nSomething went wrong\n',e))
        .finally(() => {
            client.end()
            app.listen(3000, () => console.log('Listening on port 3000'))
        })
    },
    executeQuery: async (qry,bind) => {
        const client = new Client(credentails)
        await client.connect()
        const res = await client.query(qry,bind)
        await client.end()
        return res
    },
    insert: async (Obj,tablename) => {
        let values = Object.keys(Obj)
        let bind = []
        let qry_1 = `INSERT INTO ${tablename}(`
        let qry_2 = ') VALUES('
        for(let i = 0; i<values.length; i++){
            if(i == values.length-1){
                qry_1 += values[i]
                qry_2 += `$${i+1})` 
            }
            else {
                qry_1 += values[i] + ','
                qry_2 += `$${i+1},`
            }
            bind.push(Obj[values[i]])
        }
        let result = await utility.executeQuery(qry_1 + qry_2, bind)
        return result
    },
    auth: async (req,res,next) => {
        
    },
    findByCredentials: async ({ email, password }) => {
        const user = (await utility.executeQuery('SELECT * FROM user_master WHERE email=$1',[email])).rows[0]
        if(!user){
            throw new Error('Unable to login')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            throw new Error('Unable to login')
        }
        delete user.password
        return user
    },
    generateAuthToken: async (user) => {
        const token = jwt.sign({id: user.id}, 'jwt_key', {expiresIn: '12h'})
        const result = (await utility.executeQuery('UPDATE user_master SET token=$1 WHERE email=$2',[token,user.email])).rows[0]
        user.token = token
        return user
    }
}

module.exports = utility