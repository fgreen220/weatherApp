const { Pool } = require('pg')
const { config } = require('./config');
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'weatherapp',
  port: 5432,
  password: config.dbPass
})

const getUsers = (request, response) => {
  const { username, password } = request.headers;
  if (request.method === 'GET') {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  } else if (request.method === 'POST') {
    pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (error, results) => {
      if (error) {
        throw error
      }
      results.rowCount===1 ? console.log(results.rows[0].id): null;
      if(results.rowCount===1 && results.rows[0].state === undefined) {
        response.status(200).json({isLoggedIn: true, id:results.rows[0].id, state: results.rows[0].state});
      } else if (results.rowCount===1 && results.rows[0].state !== undefined) {
        response.status(200).json({isLoggedIn: true, id:results.rows[0].id, state: results.rows[0].state});
      }
      else {
        response.status(200).json({isLoggedIn: false})
      }
    })
  }
}

const createUser = (request, response) => {
  const { username, password, cities } = request.body

  pool.query(`INSERT INTO users (username, password, cities) VALUES ($1, $2, $3, $4) RETURNING id`, [username, password, cities, state], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({response: `User added with ID: ${results.rows[0].id}`})
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { username, password, cities, state } = request.body
  // username = $1, password = $2, cities = $3, 
  // username, password, cities, 
  pool.query(
    'UPDATE users SET state = $1 WHERE id = $2',
    [state, id],
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