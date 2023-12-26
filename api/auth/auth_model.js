const db = require('../../data/dbConfig')
const { build_token } = require('../../data/utils')

const register = async (payload) => {
    const [id] = await db('users').insert(payload)

    return await db('users').where('id', id)
}

const login = async (username) => {
    const [user] = await db('users').where('username', username)

    const token = build_token(user)

    return {
        message: 'welcome, ' + user.username,
        token: token
    }
}

module.exports = {
    register,
    login
}