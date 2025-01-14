const router = require('express').Router();
const bcrypt = require('bcryptjs')
const Auth_model = require('./auth_model')
const { check_user_already_exists, check_body_payload, handle_login } = require('../middleware/auth_middleware')

router.post('/register', [check_body_payload, check_user_already_exists], async (req, res, next) => {
  try {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8)
    const payload = { username: username, password: hash }

    const [new_user] = await Auth_model.register(payload)
    res.status(201).json(new_user)
  } catch (err) {
    next({ status: 500, message: "Error in registering new user: " + err.message })
  }
  /*

    res.end('implement register, please!');
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', [check_body_payload, handle_login], async (req, res, next) => {
  try {
    const { username } = req.body
    const logged_in = await Auth_model.login(username)
    res.status(200).json(logged_in)
  } catch (err) {
    next({ status: 500, message: "Error in logging in: " + err.message })
  }
  /*
 res.end('implement login, please!');
   
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
