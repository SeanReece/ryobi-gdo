const axios = require('axios')

const API_URL = 'https://tti.tiwiconnect.com/api'

const identity = {}

/**
 * Log into Ryobi GDO account using username / password. After successful login,
 *   thr API can be used and commands can be sent to GDO
 * @param {String} username
 * @param {String} password
 * @returns apiKey on success
 */
const login = async (username, password) => {
  try {
    const loginResponse = await axios.post(
      `${API_URL}/login`,
      {
        username,
        password,
      },
      { withCredentials: true },
    )

    identity.apiKey = loginResponse.data.result.auth.apiKey
    identity.username = username
    identity.password = password

    return identity
  } catch (err) {
    console.error('Failed login', err)
    return undefined
  }
}

module.exports = {
  login,
  identity,
  isAuthenticated: () => !!identity.apiKey,
}
