const db = require('../../data/dbConfig')
const bcrypt = require('bcryptjs')

const check_user_already_exists = async (req, res, next) => {
    const [user] = await db('users').where('username', req.body.username)

    if (user) {
        next({ status: 400, message: 'username taken' })
    } else {
        next()
    }
}

const check_body_payload = async (req, res, next) => {
    const { username, password } = req.body

    if (username === undefined || password === undefined) {
        next({ status: 422, message: 'username and password required' })
    } else {

        const values_to_check = { username: username, password: password }

        let invalid
        for (const key in values_to_check) {
            const value = values_to_check[key]
            if (value.trim() === '' || typeof value !== 'string' || value === undefined) {
                invalid = key
                break
            }
        }

        if (invalid) {
            next({ status: 422, message: 'username and password required' })
        } else {
            next()
        }
    }
}

const handle_login = async (req, res, next) => {
    const { username, password } = req.body

    const [does_user_exist] = await db('users').where('username', username)

    if (!does_user_exist) {
        next({ status: 400, message: 'invalid credentials' })
    } else {
        let is_valid_password = bcrypt.compareSync(password, does_user_exist.password)

        if (is_valid_password) {
            next()
        } else {
            next({ status: 400, message: 'invalid credentials' })
        }
    }
}

module.exports = {
    check_user_already_exists,
    check_body_payload,
    handle_login
}