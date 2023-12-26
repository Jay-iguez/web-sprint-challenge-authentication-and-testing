const db = require('../../data/dbConfig')

const register = async (payload) => {
    const [id] = await db('users').insert(payload)

    return await db('users').where('id', id)
}

module.exports = {
    register
}