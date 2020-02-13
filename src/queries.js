const { Pool } = require('pg')
const config = require('./config');
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'weatherapp',
  port: 5432,
  password: config.dbPass
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { username, password, cities } = request.body

  pool.query(`INSERT INTO users (username, password, cities) VALUES ($1, $2, $3) RETURNING id`, [username, password, cities], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({response: `User added with ID: ${results.rows[0].id}`})
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { username, password, cities } = request.body

  pool.query(
    'UPDATE users SET username = $1, password = $2, cities = $3 WHERE id = $4',
    [username, password, cities, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json({response: `User modified with ID: ${id}`})
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json({response: `User deleted with ID: ${id}`})
  })
}


module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
}