var knex = require('knex')({
    client: 'mysql2', 
    connection: {
      host : 'localhost',
      user : 'root',
      password : 'umburana2011',
      database : 'apiusers'
    }
  });

module.exports = knex