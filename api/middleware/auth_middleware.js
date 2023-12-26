const db = require('../../data/dbConfig')

const check_user_already_exists = async (req, res, next) => {
    const [users] = await db('users').where('username', req.body.username)

    if (users) {
        next({status: 400, message: 'username taken'})
    } else {
        next()
    }
}

const check_body_payload = async (req, res, next) => {
    const {username, password} = req.body
    const values_to_check = {username: username, password: password}

    let invalid
    for (const key in values_to_check) {
        const value = values_to_check[key]
        if (value.trim() === '' || typeof value !== 'string' || value === undefined){
            invalid = key
            break
        }
    }

    if (invalid) {
        next({status: 400, message: 'username and password required'})
    } else {
        next()
    }
}

module.exports = {
    check_user_already_exists,
    check_body_payload
}