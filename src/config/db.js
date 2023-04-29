const {Sequelize} = require('sequelize')

  const db = new Sequelize(process.env.DATABASE, process.env.USERNAME, process.env.DB_PASS, {
    host : 'localhost',
    dialect : 'postgres'
  })

module.exports = db